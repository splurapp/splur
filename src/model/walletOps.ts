import { IndexableType, IndexableTypeArray } from "dexie";
import db, { ExchangeType, SplurTransaction, Wallet } from "./db";
import { TransactionOperations } from "./transactionOps";

export class WalletOperations {
  static async getById(id?: number): Promise<Wallet | undefined> {
    if (!id) return undefined;

    return await db.wallets.get(id);
  }

  static async get(): Promise<Wallet[]> {
    return await db.wallets.toArray();
  }

  static async create(wallet: Wallet): Promise<Wallet | null> {
    return await db.transaction("rw", db.wallets, db.splurTransactions, async () => {
      try {
        const newWallet: Wallet = {
          ...wallet,
          amount: 0,
        };
        const walletId = (await db.wallets.add(newWallet)) as number;

        if (wallet.amount !== 0) {
          // New Transaction need to be created
          const newTransaction: SplurTransaction = {
            timestamp: new Date(),
            assignedTo: walletId,
            amount: wallet.amount,
            autoCategoryMap: false,
            category: "other",
            subcategory: "other",
            dismissed: undefined,
            exchanger: undefined,
            exchangeType: ExchangeType.CREDIT,
            transferFrom: undefined,
            transferTo: undefined,
          };

          await TransactionOperations.add(newTransaction);
        }

        newWallet.id = walletId;
        return newWallet;
      } catch (error) {
        console.log(error);
        return null;
      }
    });
  }

  static async remove(id: number): Promise<boolean> {
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
                .where("assignedTo")
                .equals(id)
                .and(
                  record =>
                    record.exchangeType !== ExchangeType.TRANSFER ||
                    (record.exchangeType === ExchangeType.TRANSFER &&
                      !walletIds.includes(record.transferFrom)),
                )
                .toArray();
              await db.splurTransactions.bulkDelete(
                uselessTransactions.map(transaction => transaction.id) as IndexableTypeArray,
              );
              return true;
            } catch (error) {
              console.log(error);
              return false;
            }
          });
        }

        return true;
      } catch (error) {
        console.log(error);
        return false;
      }
    });
  }

  static async edit(wallet: Wallet): Promise<boolean> {
    // TODO: return updated wallet, instead of boolean
    return await db.transaction("rw", db.wallets, db.splurTransactions, async () => {
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
            assignedTo: currWallet.id,
            amount:
              wallet.amount > currWallet.amount
                ? wallet.amount - currWallet.amount
                : currWallet.amount - wallet.amount,
            autoCategoryMap: false,
            category: "other",
            subcategory: "other",
            dismissed: undefined,
            exchanger: undefined,
            exchangeType:
              wallet.amount > currWallet.amount ? ExchangeType.CREDIT : ExchangeType.DEBIT,
            transferFrom: undefined,
            transferTo: undefined,
          };

          await TransactionOperations.add(newTransaction);
        }

        return ret === 1 ? true : false;
      } catch {
        return false;
      }
    });
  }

  static async sync(transaction: SplurTransaction, revert: boolean = false): Promise<boolean> {
    return await db.transaction("rw", db.wallets, db.splurTransactions, async () => {
      try {
        if (transaction.exchangeType !== ExchangeType.TRANSFER) {
          const currWallet = await WalletOperations.getById(transaction.assignedTo);

          if (currWallet) {
            if (
              transaction.exchangeType === ExchangeType.BORROW ||
              transaction.exchangeType === ExchangeType.CREDIT
            ) {
              currWallet.amount = revert
                ? currWallet.amount - transaction.amount
                : currWallet.amount + transaction.amount;
            } else if (
              transaction.exchangeType === ExchangeType.LEND ||
              transaction.exchangeType === ExchangeType.DEBIT
            ) {
              currWallet.amount = revert
                ? currWallet.amount + transaction.amount
                : currWallet.amount - transaction.amount;
            }

            await db.wallets.update(currWallet.id as IndexableType, {
              amount: currWallet.amount,
            });
            return true;
          }
          return false;
        } else {
          const transferFrom = await WalletOperations.getById(transaction.transferFrom);
          const transferTo = await WalletOperations.getById(transaction.transferTo);
          const currWallet = await WalletOperations.getById(transaction.assignedTo);

          // Transfer revert
          if (revert) {
            // Add amounts to the transfer to if its exists
            if (transferFrom) {
              transferFrom.amount = transferFrom.amount + transaction.amount;
              // await WalletOperations.edit(transferFrom);
              await db.wallets.update(transferFrom.id as IndexableType, {
                amount: transferFrom.amount,
              });
            }

            // Balancing current wallet too
            if (transferTo && currWallet && currWallet.id === transferTo.id) {
              currWallet.amount = currWallet.amount - transaction.amount;
              // await WalletOperations.edit(currWallet);
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
          // await WalletOperations.edit(currWallet);
          // await WalletOperations.edit(transferFrom);
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
        return false;
      }
    });
  }

  static async destroy(): Promise<boolean> {
    try {
      await db.wallets.clear();
      return true;
    } catch {
      return false;
    }
  }
}
