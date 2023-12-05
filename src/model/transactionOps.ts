import type { IndexableType } from "dexie";
import { CategoryOperations } from "./categoryOps";
import type { Category, SplurTransaction, Wallet } from "./db";
import db, { ExchangeType } from "./db";
import { WalletOperations } from "./walletOps";

export class TransactionOperations {
  static mapObj(
    wallets: Wallet[],
    categories: Category[],
    transaction?: SplurTransaction,
  ): SplurTransaction | undefined {
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

  static objsNormalizer(transactions: (SplurTransaction | undefined)[]): SplurTransaction[] {
    const ret: SplurTransaction[] = [];
    transactions.forEach(item => {
      if (item) ret.push(item);
    });
    return ret;
  }

  static async get(walletId?: number): Promise<SplurTransaction[]> {
    const wallets = await WalletOperations.get();
    const categories = await CategoryOperations.get();
    let transactions = [];

    if (walletId) {
      transactions = await db.splurTransactions
        .where("assignedTo")
        .equals(walletId)
        .or("transferFrom")
        .equals(walletId)
        .reverse()
        .sortBy("timestamp");
    } else {
      transactions = await db.splurTransactions.toArray();
    }

    return this.objsNormalizer(transactions.map(item => this.mapObj(wallets, categories, item)));
  }

  static async getById(transactionId?: number): Promise<SplurTransaction | undefined> {
    const wallets = await WalletOperations.get();
    const categories = await CategoryOperations.get();
    const transaction = await db.splurTransactions.get(transactionId as IndexableType);

    // Map category as well
    // WIP
    return this.mapObj(wallets, categories, transaction);
  }

  // WIP
  static async bulkGet(walletIds: number[]): Promise<SplurTransaction[]> {
    if (walletIds?.length > 0) {
      const wallets = await WalletOperations.get();
      const categories = await CategoryOperations.get();
      const transactions = await db.splurTransactions.bulkGet(walletIds);
      return this.objsNormalizer(transactions.map(item => this.mapObj(wallets, categories, item)));
    }

    return [];
  }

  static async getByYear(year: number, walletId?: number | null): Promise<SplurTransaction[]> {
    const startOfYear = new Date(year, 0, 1);
    const endOfYear = new Date(year, 11, 31);
    const wallets = await WalletOperations.get();
    const categories = await CategoryOperations.get();
    let transactions = [];

    if (walletId) {
      transactions = await db.splurTransactions
        .where("timestamp")
        .between(startOfYear, endOfYear, true, true)
        .and(record => record.assignedTo === walletId)
        .reverse()
        .sortBy("timestamp");
    } else {
      transactions = await db.splurTransactions
        .where("timestamp")
        .between(startOfYear, endOfYear, true, true)
        .reverse()
        .sortBy("timestamp");
    }

    return this.objsNormalizer(transactions.map(item => this.mapObj(wallets, categories, item)));
  }

  static async getByMonth(month: number, walletId?: number | null): Promise<SplurTransaction[]> {
    const startOfMonth = new Date().setMonth(month, 1);
    const endOfMonth = new Date().setMonth(month, 0);
    const wallets = await WalletOperations.get();
    const categories = await CategoryOperations.get();
    let transactions = [];

    if (walletId) {
      transactions = await db.splurTransactions
        .where("timestamp")
        .between(startOfMonth, endOfMonth, true, true)
        .and(record => record.assignedTo === walletId)
        .reverse()
        .sortBy("timestamp");
    } else {
      transactions = await db.splurTransactions
        .where("timestamp")
        .between(startOfMonth, endOfMonth, true, true)
        .reverse()
        .sortBy("timestamp");
    }

    return this.objsNormalizer(transactions.map(item => this.mapObj(wallets, categories, item)));
  }

  static async getByDate(date: Date, walletId?: number | null): Promise<SplurTransaction[]> {
    const wallets = await WalletOperations.get();
    const categories = await CategoryOperations.get();
    let transactions = [];

    if (walletId) {
      transactions = await db.splurTransactions
        .where("timestamp")
        .equals(date)
        .and(record => record.assignedTo === walletId)
        .reverse()
        .sortBy("timestamp");
    } else {
      transactions = await db.splurTransactions.where("timestamp").equals(date).toArray();
    }

    return this.objsNormalizer(transactions.map(item => this.mapObj(wallets, categories, item)));
  }

  static async getByDateRange(
    startDate: Date,
    endDate: Date,
    walletId?: number | null,
  ): Promise<SplurTransaction[]> {
    const wallets = await WalletOperations.get();
    const categories = await CategoryOperations.get();
    let transactions = [];

    if (walletId) {
      transactions = await db.splurTransactions
        .where("timestamp")
        .between(startDate, endDate, true, true)
        .and(record => record.assignedTo === walletId)
        .reverse()
        .sortBy("timestamp");
    } else {
      transactions = await db.splurTransactions
        .where("timestamp")
        .between(startDate, endDate, true, true)
        .reverse()
        .sortBy("timestamp");
    }

    return this.objsNormalizer(transactions.map(item => this.mapObj(wallets, categories, item)));
  }

  static async add(transaction: SplurTransaction): Promise<SplurTransaction | null> {
    return await db.transaction("rw", db.splurTransactions, db.wallets, db.categories, async () => {
      try {
        if (LoanOperations.isLoan(transaction)) {
          throw new Error(
            "This Exchange type is not allowed for this operation. Please use LoanOperations methods.",
          );
        }

        if (transaction.autoCategoryMap) {
          // Need to call mapper to get associated category
          // WIP
        }

        const newTransactionId = await db.splurTransactions.add(transaction);

        // Sync wallet
        await WalletOperations.sync(transaction);

        // Get the transaction object
        if (!newTransactionId) throw new Error("Transaction creation failed");

        const wallets = await WalletOperations.get();
        const categories = await CategoryOperations.get();
        let newTransaction = await TransactionOperations.getById(newTransactionId as number);
        newTransaction = this.mapObj(wallets, categories, newTransaction);
        return newTransaction ? newTransaction : null;
      } catch (error) {
        console.log(error);
        return null;
      }
    });
  }

  static async addBulk(transactions: SplurTransaction[]): Promise<boolean> {
    return await db.transaction("rw", db.splurTransactions, db.wallets, async () => {
      try {
        for (const transaction of transactions) {
          if (LoanOperations.isLoan(transaction)) {
            throw new Error(
              "This Exchange type is not allowed for this operation. Please use LoanOperations methods.",
            );
          }

          if (transaction.autoCategoryMap) {
            // Need to call mapper to get associated category
            // Need to find effective solution for this
            // WIP
          }
        }

        await db.splurTransactions.bulkAdd(transactions);

        // Sync wallet
        for (const transaction of transactions) {
          await WalletOperations.sync(transaction);
        }
        return true;
      } catch {
        return false;
      }
    });
  }

  static async edit(transaction: SplurTransaction): Promise<SplurTransaction | null> {
    return await db.transaction("rw", db.splurTransactions, db.wallets, db.categories, async () => {
      try {
        if (LoanOperations.isLoan(transaction)) {
          throw new Error(
            "This Exchange type is not allowed for this operation. Please use LoanOperations methods.",
          );
        }

        if (transaction.autoCategoryMap) {
          // Need to call mapper to get associated category
          // WIP
        }

        if (!transaction.id) return null;

        // Fetch previous version of transaction so that we can use it to revert back those amounts from wallet.
        const prevTransaction = await TransactionOperations.getById(transaction.id);

        // Checking few of the things if prevTransaction is transfer and new transaction is not
        if (
          prevTransaction?.exchangeType === ExchangeType.TRANSFER &&
          transaction.exchangeType !== ExchangeType.TRANSFER
        ) {
          transaction.transferFrom = undefined;
          transaction.transferTo = undefined;
        }

        const ret = await db.splurTransactions.update(transaction.id, transaction);

        // Syncing wallet
        if (ret === 1 && prevTransaction) {
          // Popped previous transaction
          await WalletOperations.sync(prevTransaction, true);

          // Synced new modified transaction
          await WalletOperations.sync(transaction);

          // Gets updated transaction
          const wallets = await WalletOperations.get();
          const categories = await CategoryOperations.get();
          let updatedTransaction = await TransactionOperations.getById(transaction.id);
          updatedTransaction = this.mapObj(wallets, categories, updatedTransaction);
          return updatedTransaction ? updatedTransaction : null;
        }

        throw new Error("Transaction update failed");
      } catch (error) {
        console.log(error);
        return null;
      }
    });
  }

  static async delete(id: number): Promise<number | null> {
    return await db.transaction("rw", db.splurTransactions, db.wallets, async () => {
      try {
        const transaction = await db.splurTransactions.get(id);
        if (!transaction) throw new Error("Transaction doesn't exists");

        if (LoanOperations.isLoan(transaction)) {
          await db.splurTransactions.update(id, { assignedTo: undefined });
        } else {
          await db.splurTransactions.delete(id);
        }

        await WalletOperations.sync(transaction, true);
        return id;
      } catch (error) {
        console.log(error);
        return null;
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

        // Not deleting any transaction records when its loan
        const transactionIdsWithoutLoan: number[] = [];
        const transactionIdsWithLoan: SplurTransaction[] = [];
        for (const transaction of transactions) {
          if (transaction?.id) {
            if (LoanOperations.isLoan(transaction)) {
              transaction.assignedTo = undefined;
              transactionIdsWithLoan.push(transaction);
            } else {
              transactionIdsWithoutLoan.push(transaction.id);
            }
          }
        }

        // Removing assigned to from those ids which have loan
        await db.splurTransactions.bulkPut(transactionIdsWithLoan);

        await db.splurTransactions.bulkDelete(transactionIdsWithoutLoan);
        return true;
      } catch {
        return false;
      }
    });
  }
}

export class LoanOperations {
  static isLoan(transaction: SplurTransaction): boolean {
    return [
      ExchangeType.BORROW,
      ExchangeType.SUB_BORROW,
      ExchangeType.LEND,
      ExchangeType.SUB_LEND,
    ].includes(transaction.exchangeType);
  }

  static async get(parentId?: number): Promise<SplurTransaction[]> {
    let transactions = [];
    const wallets = await WalletOperations.get();
    const categories = await CategoryOperations.get();
    if (parentId) {
      transactions = await db.splurTransactions
        .where("loanId")
        .equals(parentId)
        .reverse()
        .sortBy("timestamp");
    } else {
      transactions = await db.splurTransactions
        .filter(item => item.loanId !== undefined)
        .reverse()
        .sortBy("timestamp");
    }

    return TransactionOperations.objsNormalizer(
      transactions.map(item => TransactionOperations.mapObj(wallets, categories, item)),
    );
  }

  // Only for Parent loan obj
  static async create(transaction: SplurTransaction): Promise<SplurTransaction | null> {
    return await db.transaction("rw", db.splurTransactions, db.wallets, db.categories, async () => {
      try {
        if (
          transaction.exchangeType !== ExchangeType.BORROW &&
          transaction.exchangeType !== ExchangeType.LEND
        ) {
          throw new Error("Only Borrow and Lend transaction allowed for this operation");
        }

        const objIndex = await db.splurTransactions.add(transaction);
        await db.splurTransactions.update(objIndex, { loanId: objIndex });
        if (!objIndex) throw new Error("Transaction creation failed");

        // Sync wallet
        if (transaction.assignedTo) {
          await WalletOperations.sync(transaction);
        }

        // Gets transaction
        const wallets = await WalletOperations.get();
        const categories = await CategoryOperations.get();
        let newTransaction = await TransactionOperations.getById(objIndex as number);
        newTransaction = TransactionOperations.mapObj(wallets, categories, newTransaction);
        return newTransaction ? newTransaction : null;
      } catch (error) {
        console.log(error);
        return null;
      }
    });
  }

  static async addChild(
    transaction: SplurTransaction,
    parentId: number,
  ): Promise<SplurTransaction | null> {
    return await db.transaction("rw", db.splurTransactions, db.wallets, db.categories, async () => {
      try {
        const parent = await TransactionOperations.getById(parentId);
        if (!parent) throw new Error("Parent doesn't exists");

        if (
          parent.exchangeType !== ExchangeType.BORROW &&
          parent.exchangeType !== ExchangeType.LEND
        ) {
          throw new Error("Only Borrow and Lend parent transaction allowed for this operation");
        }

        if (
          (parent.exchangeType === ExchangeType.BORROW &&
            transaction.exchangeType !== ExchangeType.SUB_BORROW) ||
          (parent.exchangeType === ExchangeType.LEND &&
            transaction.exchangeType !== ExchangeType.SUB_LEND)
        ) {
          throw new Error(
            `Parent [${parent.exchangeType}] & Child [${transaction.exchangeType}] exchange type is not matching`,
          );
        }

        if (transaction.assignedTo) {
          // Validate if assigned to Really exists in DB
          const wallet = await WalletOperations.getById(transaction.assignedTo);

          if (!wallet) throw new Error("Assigned wallet id doesn't exists");
        }

        transaction.loanId = parentId;
        const transactionId = await db.splurTransactions.add(transaction);
        if (!transactionId) throw new Error("Transaction creation failed");

        if (transaction.assignedTo) {
          await WalletOperations.sync(transaction);
        }

        // Gets transaction
        const wallets = await WalletOperations.get();
        const categories = await CategoryOperations.get();
        let newTransaction = await TransactionOperations.getById(transactionId as number);
        newTransaction = TransactionOperations.mapObj(wallets, categories, newTransaction);
        return newTransaction ? newTransaction : null;
      } catch (error) {
        console.log(error);
        return null;
      }
    });
  }

  // We can only able to edit (Show Hide transaction & Amount)
  static async edit(transaction: SplurTransaction): Promise<SplurTransaction | null> {
    return await db.transaction("rw", db.splurTransactions, db.wallets, db.categories, async () => {
      try {
        if (!transaction.id) return null;

        // Fetch previous version of transaction so that we can use it to revert back those amounts from wallet.
        const prevTransaction = await TransactionOperations.getById(transaction.id);

        const ret = await db.splurTransactions.update(transaction.id, {
          assignedTo: transaction.assignedTo,
          amount: transaction.amount,
        });

        // Syncing wallet
        if (ret === 1 && prevTransaction) {
          if (prevTransaction.assignedTo) {
            // Popped previous transaction
            await WalletOperations.sync(prevTransaction, true);
          }

          if (transaction.assignedTo) {
            // Synced new modified transaction
            await WalletOperations.sync(transaction);
          }

          // Gets updated transaction
          const wallets = await WalletOperations.get();
          const categories = await CategoryOperations.get();
          let updatedTransaction = await TransactionOperations.getById(transaction.id);
          updatedTransaction = TransactionOperations.mapObj(
            wallets,
            categories,
            updatedTransaction,
          );
          return updatedTransaction ? updatedTransaction : null;
        }

        throw new Error("Transaction update failed.");
      } catch (error) {
        console.log(error);
        return null;
      }
    });
  }

  // Destroy a particular loan (Including childs)
  static async destroy(parentId: number): Promise<number | null> {
    return await db.transaction("rw", db.splurTransactions, db.wallets, db.categories, async () => {
      try {
        const loanTransactions = await LoanOperations.get(parentId);

        // Reverting wallet changes whatever parent or child is associated with wallet
        for (const transaction of loanTransactions) {
          if (transaction.assignedTo) {
            await WalletOperations.sync(transaction, true);
          }
        }

        const ret = await db.splurTransactions.where("loanId").equals(parentId).delete();
        if (ret !== loanTransactions.length) {
          throw new Error("Not all the records are deleted.");
        }

        return parentId;
      } catch (error) {
        console.log(error);
        return null;
      }
    });
  }

  // Delete child
  static async deleteChild(childId: number): Promise<number | null> {
    return await db.transaction("rw", db.splurTransactions, db.wallets, db.categories, async () => {
      try {
        const childTransaction = await TransactionOperations.getById(childId);

        if (!childTransaction) throw new Error("Provided child id not exists");

        // Check exchange type and parent
        if (childTransaction.id === childTransaction.loanId) {
          throw new Error("Parent loan transaction not allowed for this operation");
        }

        if (
          ![ExchangeType.SUB_BORROW, ExchangeType.SUB_LEND].includes(childTransaction.exchangeType)
        ) {
          throw new Error("Other exchange types are not allowed for this operation");
        }

        // Revert wallet changes
        if (childTransaction.assignedTo) {
          await WalletOperations.sync(childTransaction, true);
        }

        await db.splurTransactions.delete(childId);
        return childId;
      } catch (error) {
        console.log(error);
        return null;
      }
    });
  }

  // It will only delete from wallet (transaction existence will be there)
  static async deleteFromWallet(transactionId: number): Promise<number | null> {
    return await db.transaction("rw", db.splurTransactions, db.wallets, db.categories, async () => {
      try {
        const transaction = await TransactionOperations.getById(transactionId);

        if (!transaction) throw new Error("Provided transaction id not exists");

        if (
          ![
            ExchangeType.BORROW,
            ExchangeType.SUB_BORROW,
            ExchangeType.LEND,
            ExchangeType.SUB_LEND,
          ].includes(transaction.exchangeType)
        ) {
          throw new Error("Other exchange types are not allowed for this operation");
        }

        // Revert wallet changes
        if (transaction.assignedTo) {
          await WalletOperations.sync(transaction, true);
        }

        await db.splurTransactions.update(transactionId, { assignedTo: undefined });

        return transactionId;
      } catch (error) {
        console.log(error);
        return null;
      }
    });
  }
}
