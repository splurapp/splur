import type { IndexableType, IndexableTypeArray } from "dexie";
import db from "./db";
import { type SplurTransaction, type Wallet } from "./schema";
import { TransactionOperations } from "./transactionOps";

export class WalletOperations {
  static async getById(id?: number): Promise<Wallet | undefined> {
    if (!id) return undefined;

    return await db.wallets.get(id);
  }

  static getObj(wallets: Wallet[], id: number): Wallet | undefined {
    return wallets.find(item => item.id === id);
  }

  static async get(): Promise<Wallet[]> {
    return await db.wallets.toArray();
  }

  static async create(wallet: Wallet): Promise<Wallet | undefined> {
    return await db.transaction("rw", db.wallets, db.splurTransactions, db.categories, async () => {
      try {
        const newWallet: Wallet = { ...wallet, amount: 0 };
        const walletId = (await db.wallets.add(newWallet)) as number;
        if (!walletId) throw new Error("Wallet creation failed");

        if (wallet.amount !== 0) {
          // New Transaction need to be created
          const newTransaction: SplurTransaction = {
            timestamp: new Date(),
            walletId: walletId,
            amount: wallet.amount,
            autoCategoryMap: false,
            title: "Adjust balance",
            exchanger: undefined,
            exchangeType: "Income",
            transferFrom: undefined,
            transferTo: undefined,
          };

          await TransactionOperations.add(newTransaction);
        }

        // gets updated wallet
        return await WalletOperations.getById(walletId);
      } catch (error) {
        console.log(error);
        throw error;
      }
    });
  }

  static async remove(id: number): Promise<number | null> {
    return await db.transaction("rw", db.wallets, db.splurTransactions, async () => {
      try {
        const ret = await db.wallets.where("id").equals(id).delete();

        if (ret === 1) {
          // Gethers wallet ids to check if any transfer transaction depends on any other wallet
          const wallets = await WalletOperations.get();
          const walletIds = wallets.map(item => item.id);

          // delete only if its not Transfer transaction OR transferFrom wallet exists for that transfer transaction
          return await db.transaction("rw", db.splurTransactions, async () => {
            try {
              const uselessTransactions = await db.splurTransactions
                .where("walletId")
                .equals(id)
                .and(
                  record =>
                    record.exchangeType !== "Transfer" ||
                    (record.exchangeType === "Transfer" &&
                      !walletIds.includes(record.transferFrom)),
                )
                .toArray();
              await db.splurTransactions.bulkDelete(
                uselessTransactions.map(transaction => transaction.id) as IndexableTypeArray,
              );
              return id;
            } catch (error) {
              console.log(error);
              throw error;
            }
          });
        }

        return id;
      } catch (error) {
        console.log(error);
        throw error;
      }
    });
  }

  static async edit(wallet: Wallet): Promise<Wallet | null> {
    return await db.transaction("rw", db.wallets, db.splurTransactions, db.categories, async () => {
      try {
        const currWallet = await db.wallets.get(wallet.id as IndexableType);

        const ret = await db.wallets.update(wallet.id as IndexableType, {
          name: wallet.name,
          type: wallet.type,
        });

        if (ret === 1 && currWallet?.id && currWallet?.amount !== wallet.amount) {
          // New Transaction need to be created for adjustments based on negative or positive amount
          const newTransaction: SplurTransaction = {
            timestamp: new Date(),
            walletId: currWallet.id,
            amount:
              wallet.amount > currWallet.amount
                ? wallet.amount - currWallet.amount
                : currWallet.amount - wallet.amount,
            autoCategoryMap: false,
            title: "Adjust balance",
            exchanger: undefined,
            exchangeType: wallet.amount > currWallet.amount ? "Income" : "Expense",
            transferFrom: undefined,
            transferTo: undefined,
          };

          await TransactionOperations.add(newTransaction);
        }

        // Gets the wallet
        const updatedWallet = await db.wallets.get(wallet.id as IndexableType);

        return ret === 1 && updatedWallet ? updatedWallet : null;
      } catch (error) {
        console.log(error);
        throw error;
      }
    });
  }

  static async sync(transaction: SplurTransaction, revert = false): Promise<boolean> {
    return await db.transaction("rw", db.wallets, db.splurTransactions, async () => {
      try {
        if (transaction.exchangeType !== "Transfer") {
          const currWallet = await WalletOperations.getById(transaction.walletId);

          if (currWallet) {
            if (
              transaction.exchangeType === "Borrow" ||
              transaction.exchangeType === "SubLend" ||
              transaction.exchangeType === "Income"
            ) {
              currWallet.amount = revert
                ? currWallet.amount - transaction.amount
                : currWallet.amount + transaction.amount;
            } else if (
              transaction.exchangeType === "Lend" ||
              transaction.exchangeType === "SubBorrow" ||
              transaction.exchangeType === "Expense"
            ) {
              currWallet.amount = revert
                ? currWallet.amount + transaction.amount
                : currWallet.amount - transaction.amount;
            }

            await db.wallets.update(currWallet.id as IndexableType, {
              amount: currWallet.amount,
            });
          }

          return true;
        } else {
          const transferFrom = await WalletOperations.getById(transaction.transferFrom);
          const transferTo = await WalletOperations.getById(transaction.transferTo);
          const currWallet = await WalletOperations.getById(transaction.walletId);

          // Transfer revert
          if (revert) {
            // Add amounts to the transfer to if its exists
            if (transferFrom) {
              transferFrom.amount = transferFrom.amount + transaction.amount;
              await db.wallets.update(transferFrom.id as IndexableType, {
                amount: transferFrom.amount,
              });
            }

            // Balancing current wallet too
            if (transferTo && currWallet && currWallet.id === transferTo.id) {
              currWallet.amount = currWallet.amount - transaction.amount;
              await db.wallets.update(currWallet.id as IndexableType, {
                amount: currWallet.amount,
              });
            }

            return true;
          }

          // Transfer transaction
          if (!transferFrom || !transferTo || !currWallet)
            throw new Error("Transfer to/from & Curr Wallet cannot be null");
          if (transferTo.id !== currWallet.id)
            throw new Error("Transfer to & Curr Wallet id should match");

          currWallet.amount += transaction.amount;
          transferFrom.amount -= transaction.amount;
          await db.wallets.update(currWallet.id as IndexableType, {
            amount: currWallet.amount,
          });
          await db.wallets.update(transferFrom.id as IndexableType, {
            amount: transferFrom.amount,
          });
          return true;
        }
      } catch (error) {
        console.log(error);
        throw error;
      }
    });
  }

  static async destroy(): Promise<boolean> {
    try {
      await db.wallets.clear();
      return true;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
