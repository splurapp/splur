import type { IndexableType } from "dexie";
import { CategoryOperations } from "./categoryOps";
import type { ScheduledTransaction } from "./db";
import db from "./db";
import type { SplurTransaction, TransactionExtraData } from "./schema";
import { TransactionOperations } from "./transactionOps";
import { WalletOperations } from "./walletOps";

type ScheduledTransactionWithData = ScheduledTransaction & TransactionExtraData;

export class ScheduledTransactionOperations {
  static async get(walletId?: number): Promise<ScheduledTransactionWithData[]> {
    const wallets = await WalletOperations.get();
    const categories = await CategoryOperations.get();
    let transactions = [];

    if (walletId) {
      transactions = await db.scheduledTransactions
        .where("assignedTo")
        .equals(walletId)
        .or("transferFrom")
        .equals(walletId)
        .reverse()
        .sortBy("timestamp");
    } else {
      transactions = await db.scheduledTransactions.reverse().sortBy("timestamp");
    }

    return transactions.map(item =>
      TransactionOperations.mapObj<ScheduledTransactionWithData>(wallets, categories, item),
    );
  }

  static async getById(transactionId?: number): Promise<ScheduledTransactionWithData | undefined> {
    const wallets = await WalletOperations.get();
    const categories = await CategoryOperations.get();
    const transaction = await db.scheduledTransactions.get(transactionId as IndexableType);

    // Map category as well
    // WIP
    return transaction
      ? TransactionOperations.mapObj<ScheduledTransactionWithData>(wallets, categories, transaction)
      : undefined;
  }

  static async add(transaction: ScheduledTransaction): Promise<ScheduledTransactionWithData> {
    return await db.transaction(
      "rw",
      db.scheduledTransactions,
      db.wallets,
      db.categories,
      async () => {
        try {
          if (transaction.id === transaction.loanId) {
            throw new Error("Parent Loan transaction can't be scheduled.");
          }

          const newTransactionId = await db.scheduledTransactions.add(transaction);

          // Get the transaction object
          if (!newTransactionId) throw new Error("Transaction creation failed");

          const wallets = await WalletOperations.get();
          const categories = await CategoryOperations.get();
          const newTransaction = await ScheduledTransactionOperations.getById(
            newTransactionId as number,
          );

          if (!newTransaction) throw new Error("Transaction creation failed");

          return TransactionOperations.mapObj<ScheduledTransactionWithData>(
            wallets,
            categories,
            newTransaction,
          );
        } catch (error) {
          console.log(error);
          throw error;
        }
      },
    );
  }

  static async edit(transaction: ScheduledTransaction): Promise<ScheduledTransactionWithData> {
    return await db.transaction(
      "rw",
      db.scheduledTransactions,
      db.wallets,
      db.categories,
      async () => {
        try {
          if (transaction.id === transaction.loanId) {
            throw new Error("Parent Loan transaction can't be scheduled.");
          }

          if (!transaction.id) throw new Error("Transaction id not provided");

          // Fetch previous version of transaction so that we can use it to revert back those amounts from wallet.
          const prevTransaction = await ScheduledTransactionOperations.getById(transaction.id);

          // Checking few of the things if prevTransaction is transfer and new transaction is not
          if (
            prevTransaction?.exchangeType === "Transfer" &&
            transaction.exchangeType !== "Transfer"
          ) {
            transaction.transferFrom = undefined;
            transaction.transferTo = undefined;
          }

          const ret = await db.scheduledTransactions.update(transaction.id, transaction);

          // Syncing wallet
          if (ret === 1 && prevTransaction) {
            // Gets updated transaction
          }

          const wallets = await WalletOperations.get();
          const categories = await CategoryOperations.get();
          const updatedTransaction = await ScheduledTransactionOperations.getById(transaction.id);
          if (!updatedTransaction) throw new Error("Transaction update failed");

          return TransactionOperations.mapObj(wallets, categories, updatedTransaction);
        } catch (error) {
          console.log(error);
          // return null;
          throw error;
        }
      },
    );
  }

  static async delete(id: number): Promise<number> {
    return await db.transaction("rw", db.scheduledTransactions, db.wallets, async () => {
      try {
        const transaction = await db.splurTransactions.get(id);
        if (!transaction) throw new Error("Transaction doesn't exists");

        await db.scheduledTransactions.delete(id);
        return id;
      } catch (error) {
        console.log(error);
        // return null;
        throw error;
      }
    });
  }

  static async run(id: number): Promise<boolean> {
    return db.transaction(
      "rw",
      db.scheduledTransactions,
      db.splurTransactions,
      db.wallets,
      async () => {
        try {
          const curr = await ScheduledTransactionOperations.getById(id);
          if (!curr) throw new Error("Scheduled transaction not found.");
          // Checking eligibility
          //WIP

          // Create splur transaction
          const newSplurTransaction: SplurTransaction = {
            assignedTo: curr.assignedTo,
            timestamp: new Date(),
            amount: curr.amount,
            title: curr.title,
            desc: curr.desc,
            exchanger: curr.exchanger,
            exchangeType: curr.exchangeType,
            transferFrom: curr.transferFrom,
            transferTo: curr.transferTo,
            categoryId: curr.categoryId,
            autoCategoryMap: curr.autoCategoryMap,
            loanId: curr.loanId,
            recurringId: curr.id,
          };

          const retSplurTransaction = await TransactionOperations.add(newSplurTransaction);
          curr.jobHistory.push(retSplurTransaction.timestamp);
          await ScheduledTransactionOperations.edit(curr);
          return true;
        } catch (error) {
          console.log(error);
          throw error;
        }
      },
    );
  }

  static async putInBlacklist(id: number, timestamp: Date): Promise<boolean> {
    return db.transaction("rw", db.scheduledTransactions, () => {
      try {
        // dummy
        console.log(id, timestamp);

        return true;
      } catch (error) {
        console.log(error);
        throw error;
      }
    });
  }

  static async removeFromBlacklist(id: number, timestamp: Date): Promise<boolean> {
    return db.transaction("rw", db.scheduledTransactions, () => {
      try {
        // dummy
        console.log(id, timestamp);

        return true;
      } catch (error) {
        console.log(error);
        throw error;
      }
    });
  }
}
