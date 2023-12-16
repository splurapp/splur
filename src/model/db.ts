import type { Table } from "dexie";
import Dexie from "dexie";
import type { Category, SplurTransaction, Wallet } from "./schema";

// ENUMS
export enum Currency {
  INR = "INR",
  USD = "USD",
  EUR = "EUR",
}

export enum FrequencyType {
  EVERY_DAY = "EVERY_DAY",
  EVERY_MONTH = "EVERY_MONTH",
  EVERY_YEAR = "EVERY_YEAR",
}

export interface User {
  name: string;
  photo: Blob | null;
}

export interface ScheduledTransaction extends Omit<SplurTransaction, "recurringId"> {
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
      splurTransactions: "++id, timestamp, walletId, transferFrom, loanId, categoryId",
      scheduledTransactions: "++id, timestamp, walletId, transferFrom",
      categories: "++id, &name",
      categoryMaps: "++id",
      importStatementConfigs: "&name",
    });
  }
}

const db = new MySubClassedDexie();

export default db;
