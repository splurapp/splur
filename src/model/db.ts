import type { Table } from "dexie";
import Dexie from "dexie";
import type { Category, Wallet } from "./schema";

// ENUMS
export enum ExchangeType {
  CREDIT = "Income",
  DEBIT = "Expense",
  TRANSFER = "Transfer",
  LEND = "LND",
  SUB_LEND = "SLND",
  BORROW = "BRW",
  SUB_BORROW = "SBRW",
}

export enum Currency {
  INR = "INR",
  USD = "USD",
  EUR = "EUR",
}

export enum WalletType {
  CASH = "Cash",
  BANK = "Bank",
  CREDIT_CARD = "Credit Card",
}

export interface User {
  name: string;
  photo: Blob | null;
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
  autoCategoryMap: boolean; // For marchant to Category or Sub Category Mapping
  recurringId?: number; // To identify recurring transaction
  loanId?: number; // To identify loan transaction
}

// export interface Loan {
//   id?: number;
//   timestamp: Date;
//   amount: number;
//   exchangeType: ExchangeType; // Borrow, Lend, Sub Borrow, Sub Lend
//   recurring_id?: any; // To identify recurring transaction
//   assignedTo?: number;
//   transaction_exists: boolean | true;
//   parent_id?: any; // To identify parent of current transaction
// }

export interface Preferences {
  id?: number;
  currency: Currency | Currency.INR;

  // Application stuff
  theme: string;
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
  categories!: Table<Category>;
  // loans!: Table<Loan>;
  preferences!: Table<Preferences>;
  categoryMaps!: Table<CategoryMap>;
  importStatementConfigs!: Table<ImportStatementConfig>;

  constructor(databaseName?: string) {
    super(databaseName ?? "splur");
    this.version(2).stores({
      wallets: "++id, &name",
      user: "&name",
      splurTransactions: "++id, timestamp, assignedTo, transferFrom, loanId, categoryId",
      categories: "++id, &name",
      // loans: "++id, timestamp, exchangeType, parent_id",
      preferences: "id",
      categoryMaps: "++id",
      importStatementConfigs: "&name",
    });
  }
}

const db = new MySubClassedDexie();

export default db;
