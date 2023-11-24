import Dexie, { Table } from "dexie";

// ENUMS
export enum ExchangeType {
  CREDIT = "CR",
  DEBIT = "DR",
  TRANSFER = "TRF",
  LEND = "LND",
  BORROW = "BRW",
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

export interface User {
  name: string;
  photo: Blob | null;
}

export interface Wallet {
  id?: number;
  name: string;
  type: string;
  amount: number;
}

export interface SplurTransaction {
  id?: number;
  assignedTo: number; // WALLET ID (Ex. Cash Wallet, Bank Wallet)
  timestamp: Date;
  amount: number;
  exchanger: string | undefined; // Person, UPI ID, BANK ACCOUNT One Liner Details, Mobile Number
  exchangeType: ExchangeType; // Credit, Debit, Transfer, Borrow, Lend
  transferFrom: number | undefined; // WALLET ID (Ex. Cash Wallet, Bank Wallet)
  transferTo: number | undefined; // WALLET ID (Ex. Cash Wallet, Bank Wallet)
  dismissed: boolean | undefined; // Used for Lend OR BORROW
  category: string;
  subcategory: string | undefined;
  autoCategoryMap: boolean | true; // For marchant to Category or Sub Category Mapping
}

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
  caseSensitiveCheck: boolean | true;
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
  detectionCondition: string | "AND"; // AND, OR, 1 AND 2 OR 3
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
  preferences!: Table<Preferences>;
  categoryMaps!: Table<CategoryMap>;
  importStatementConfigs!: Table<ImportStatementConfig>;

  constructor() {
    super("splur");
    this.version(1).stores({
      wallets: "++id, &name",
      user: "&name",
      splurTransactions: "++id, timestamp, assignedTo, transferFrom",
      preferences: "id",
      categoryMaps: "++id",
      importStatementConfigs: "&name",
    });
  }
}

const db = new MySubClassedDexie();

export default db;
