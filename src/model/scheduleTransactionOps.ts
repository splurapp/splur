import type { IndexableType } from "dexie";
import { CategoryOperations } from "./categoryOps";
import type { Category, ScheduledTransaction, SplurTransaction, Wallet } from "./db";
import db, { ExchangeType } from "./db";
import { TransactionOperations } from "./transactionOps";
import { WalletOperations } from "./walletOps";

export class ScheduledTransactionOperations {
  static mapObj(
    wallets: Wallet[],
    categories: Category[],
    transaction?: ScheduledTransaction,
  ): ScheduledTransaction | undefined {
    if (!transaction) return undefined;

    if (transaction.assignedTo)
      transaction.assignedToWallet = WalletOperations.getObj(wallets, transaction?.assignedTo);

    if (transaction.transferFrom)
      transaction.transferFromWallet = WalletOperations.getObj(wallets, transaction?.transferFrom);

    if (transaction.transferTo)
      transaction.transferToWallet = WalletOperations.getObj(wallets, transaction?.transferTo);

    if (transaction.categoryId)
      transaction.category = CategoryOperations.getObj(categories, transaction.categoryId);

    return transaction;
  }

  static objsNormalizer(
    transactions: (ScheduledTransaction | undefined)[],
  ): ScheduledTransaction[] {
    const ret: ScheduledTransaction[] = [];
    transactions.forEach(item => {
      if (item) ret.push(item);
    });
    return ret;
  }

  static async get(walletId?: number): Promise<ScheduledTransaction[]> {
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

    return this.objsNormalizer(transactions.map(item => this.mapObj(wallets, categories, item)));
  }

  static async getById(transactionId?: number): Promise<ScheduledTransaction | undefined> {
    const wallets = await WalletOperations.get();
    const categories = await CategoryOperations.get();
    const transaction = await db.scheduledTransactions.get(transactionId as IndexableType);

    // Map category as well
    // WIP
    return this.mapObj(wallets, categories, transaction);
  }

  static async add(transaction: ScheduledTransaction): Promise<ScheduledTransaction> {
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
          let newTransaction = await ScheduledTransactionOperations.getById(
            newTransactionId as number,
          );
          newTransaction = this.mapObj(wallets, categories, newTransaction);

          if (newTransaction) return newTransaction;

          throw new Error("Transaction creation failed");
        } catch (error) {
          console.log(error);
          // return null;
          throw error;
        }
      },
    );
  }

  static async edit(transaction: ScheduledTransaction): Promise<ScheduledTransaction> {
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
            prevTransaction?.exchangeType === ExchangeType.TRANSFER &&
            transaction.exchangeType !== ExchangeType.TRANSFER
          ) {
            transaction.transferFrom = undefined;
            transaction.transferTo = undefined;
          }

          const ret = await db.scheduledTransactions.update(transaction.id, transaction);

          // Syncing wallet
          if (ret === 1 && prevTransaction) {
            // Gets updated transaction
            const wallets = await WalletOperations.get();
            const categories = await CategoryOperations.get();
            let updatedTransaction = await ScheduledTransactionOperations.getById(transaction.id);
            updatedTransaction = this.mapObj(wallets, categories, updatedTransaction);
            if (updatedTransaction) return updatedTransaction;
          }

          throw new Error("Transaction update failed");
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
