import Dexie, { Table } from "dexie";

export interface Wallet {
  name: string;
  type: string;
}

export class MySubClassedDexie extends Dexie {
  wallets!: Table<Wallet>;

  constructor() {
    super("sontosh");
    this.version(1).stores({
      wallets: "&name, type",
    });
  }
}

const db = new MySubClassedDexie();

db.on("ready", function () {
  // Will trigger once and only once.
  console.log("DB Initialized");
});

export default db;
