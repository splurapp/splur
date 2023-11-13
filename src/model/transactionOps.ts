import { IndexableType } from "dexie";
import db, { SplurTransaction, ExchangeType, Wallet } from "./db";
import { WalletOperations } from "./walletOps";

export class TransactionOperations {
  static async get(walletId?: number): Promise<SplurTransaction[]> {
    if (walletId) {
      return await db.splurTransactions
        .where("assignedTo")
        .equals(walletId)
        .or("transferFrom")
        .equals(walletId)
        .toArray();
    }

    return await db.splurTransactions.toArray();
  }

  static async getById(transactionId?: number): Promise<SplurTransaction | undefined> {
    return db.splurTransactions.get(transactionId as IndexableType);
  }

  static async bulkGet(walletIds: number[]): Promise<(SplurTransaction | undefined)[]> {
    if (walletIds?.length > 0) {
      return await db.splurTransactions.bulkGet(walletIds);
    }

    return [];
  }

  static async getByYear(year: number, walletId?: number | null): Promise<SplurTransaction[]> {
    const startOfYear = new Date(year, 0, 1);
    const endOfYear = new Date(year, 11, 31);

    if (walletId) {
      return await db.splurTransactions
        .where("timestamp")
        .between(startOfYear, endOfYear, true, true)
        .and(record => record.assignedTo === walletId)
        .toArray();
    }

    return await db.splurTransactions
      .where("timestamp")
      .between(startOfYear, endOfYear, true, true)
      .toArray();
  }

  static async getByMonth(month: number, walletId?: number | null): Promise<SplurTransaction[]> {
    const startOfMonth = new Date().setMonth(month, 1);
    const endOfMonth = new Date().setMonth(month, 0);

    if (walletId) {
      return await db.splurTransactions
        .where("timestamp")
        .between(startOfMonth, endOfMonth, true, true)
        .and(record => record.assignedTo === walletId)
        .toArray();
    }

    return await db.splurTransactions
      .where("timestamp")
      .between(startOfMonth, endOfMonth, true, true)
      .toArray();
  }

  static async getByDate(date: Date, walletId?: number | null): Promise<SplurTransaction[]> {
    if (walletId) {
      return await db.splurTransactions
        .where("timestamp")
        .equals(date)
        .and(record => record.assignedTo === walletId)
        .toArray();
    }

    return await db.splurTransactions.where("timestamp").equals(date).toArray();
  }

  static async getByDateRange(
    startDate: Date,
    endDate: Date,
    walletId?: number | null,
  ): Promise<SplurTransaction[]> {
    if (walletId) {
      return await db.splurTransactions
        .where("timestamp")
        .between(startDate, endDate, true, true)
        .and(record => record.assignedTo === walletId)
        .toArray();
    }

    return await db.splurTransactions
      .where("timestamp")
      .between(startDate, endDate, true, true)
      .toArray();
  }

  static async add(transaction: SplurTransaction): Promise<boolean> {
    return await db.transaction("rw", db.splurTransactions, db.wallets, async () => {
      try {
        if (transaction.autoCategoryMap) {
          // Need to call mapper to get associated category
          // WIP
        }

        await db.splurTransactions.add(transaction);

        // Sync wallet
        await WalletOperations.sync(transaction);
        return true;
      } catch (error) {
        console.log(error);
        return false;
      }
    });
  }

  static async addBulk(transactions: SplurTransaction[]): Promise<boolean> {
    return await db.transaction("rw", db.splurTransactions, db.wallets, async () => {
      try {
        for (let transaction of transactions) {
          if (transaction.autoCategoryMap) {
            // Need to call mapper to get associated category
            // Need to find effective solution for this
            // WIP
          }
        }

        await db.splurTransactions.bulkAdd(transactions);

        // Sync wallet
        for (let transaction of transactions) {
          await WalletOperations.sync(transaction);
        }
        return true;
      } catch {
        return false;
      }
    });
  }

  static async edit(transaction: SplurTransaction): Promise<boolean> {
    return await db.transaction("rw", db.splurTransactions, db.wallets, async () => {
      try {
        if (transaction.autoCategoryMap) {
          // Need to call mapper to get associated category
          // WIP
        }

        if (!transaction.id) return false;

        // Fetch previous version of transaction so that we can use it to revert back those amounts from wallet.
        const prevTransaction = await TransactionOperations.getById(transaction.id);

        const ret = await db.splurTransactions.update(transaction.id, transaction);

        // Syncing wallet
        if (ret === 1 && prevTransaction) {
          // Popped previous transaction
          await WalletOperations.sync(prevTransaction, true);

          // Synced new modified transaction
          return await WalletOperations.sync(transaction);
        }

        return false;
      } catch {
        return false;
      }
    });
  }

  static async delete(id: number): Promise<boolean> {
    return await db.transaction("rw", db.splurTransactions, db.wallets, async () => {
      try {
        const transaction = await db.splurTransactions.get(id);
        if (transaction) {
          await db.splurTransactions.delete(id);
          return await WalletOperations.sync(transaction, true);
        }

        return true;
      } catch {
        return false;
      }
    });
  }

  static async deleteBulk(ids: number[]): Promise<boolean> {
    return await db.transaction("rw", db.splurTransactions, db.wallets, async () => {
      try {
        // Get all transaction so that we can revert those changes in wallet
        const transactions = await TransactionOperations.bulkGet(ids);
        for (const transaction of transactions) {
          // Reverting transactions
          if (transaction) await WalletOperations.sync(transaction, true);
        }

        await db.splurTransactions.bulkDelete(ids);
        return true;
      } catch {
        return false;
      }
    });
  }
}
