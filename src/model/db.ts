import type { Table } from "dexie";
import Dexie from "dexie";

// ENUMS
export enum ExchangeType {
  CREDIT = "CR",
  DEBIT = "DR",
  TRANSFER = "TRF",
  LEND = "LND",
  SUB_LEND = "SLND",
  BORROW = "BRW",
  SUB_BORROW = "SBRW",
}

export enum Currency {
  INR = "INR",
  USDOLLER = "USDOLLER",
}

export enum WalletType {
  CASH = "CASH",
  BANK = "BANK",
  CREDITCARD = "CREDITCARD",
}

export enum FrequencyType {
  EVERY_DAY = "EVERY_DAY",
  EVERY_MONTH = "EVERY_MONTH",
  EVERY_YEAR = "EVERY_YEAR",
}

export enum CategoryType {
  INCOME = "INCOME",
  EXPENSE = "EXPENSE",
}

export interface User {
  name: string;
  photo: Blob | null;
}

export interface Wallet {
  id?: number;
  name: string;
  color?: string;
  icon?: string;
  type: string;
  amount: number;
}

export interface SplurTransaction {
  id?: number;
  assignedTo?: number; // WALLET ID (Ex. Cash Wallet, Bank Wallet)
  assignedToWallet?: Wallet; // Will not be used in DB (will only be used in get)
  timestamp: Date;
  amount: number;
  title?: string;
  desc?: string;
  exchanger?: string; // Person, UPI ID, BANK ACCOUNT One Liner Details, Mobile Number
  exchangeType: ExchangeType; // Credit, Debit, Transfer, Borrow, Lend
  transferFrom?: number; // WALLET ID (Ex. Cash Wallet, Bank Wallet)
  transferFromWallet?: Wallet; // Will not be used in DB (will only be used in get)
  transferTo?: number; // WALLET ID (Ex. Cash Wallet, Bank Wallet)
  transferToWallet?: Wallet; // Will not be used in DB (will only be used in get)
  // dismissed?: boolean; // Used for Lend OR BORROW
  categoryId?: number;
  category?: Category; // Will not be used in DB (will only be used in get)
  // subcategory?: string;
  autoCategoryMap?: boolean; // For marchant to Category or Sub Category Mapping
  recurringId?: number; // To identify recurring transaction
  loanId?: number; // To identify loan transaction
}

export interface Category {
  id?: number;
  type: CategoryType;
  name: string;
  icon: string;
  color: string;
}

type refinedSplurTransaction = Omit<SplurTransaction, "recurringId">;
export interface ScheduledTransaction extends refinedSplurTransaction {
  frequency: FrequencyType;
  jobHistory: Date[];
  blacklist: Date[];
}

export interface CategoryMap {
  id?: number;
  category: string;
  exchanger: string;
  subcategory: string | null;
  conditionType: string; // CONTAINS, BEGINSWITH, ENDSWITH, EQUALSTO
  caseSensitiveCheck: boolean; // by default true
}

export interface ImportStatementConfig {
  name?: string;
  detection: [
    {
      rank: number;
      type: string; // BYFILENAME, BYCOLUMNNAME, BYSHEETNAME, BY ROWNAME
      conditionType: string; // CONTAINS, BEGINSWITH, ENDSWITH, EQUALSTO
    },
  ];
  // DAY 3
  detectionCondition: "AND" | "OR"; // AND, OR, 1 AND 2 OR 3  // by default "AND"
  transactionMap: [
    {
      columnName: string; // Excel column name
      mapTo: string; // Map to fields of Transaction row (Ex. Amount, sender or reciever)
    },
  ];
}

export class MySubClassedDexie extends Dexie {
  user!: Table<User>;
  wallets!: Table<Wallet>;
  splurTransactions!: Table<SplurTransaction>;
  scheduledTransactions!: Table<ScheduledTransaction>;
  categories!: Table<Category>;
  categoryMaps!: Table<CategoryMap>;
  importStatementConfigs!: Table<ImportStatementConfig>;

  constructor(databaseName?: string) {
    super(databaseName ?? "splur");
    this.version(2).stores({
      wallets: "++id, &name",
      user: "&name",
      splurTransactions: "++id, timestamp, assignedTo, transferFrom, loanId, categoryId",
      scheduledTransactions: "++id, timestamp, assignedTo, transferFrom",
      categories: "++id, &name",
      preferences: "id",
      categoryMaps: "++id",
      importStatementConfigs: "&name",
    });
  }
}

const db = new MySubClassedDexie();

export default db;
