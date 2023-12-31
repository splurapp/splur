import "fake-indexeddb/auto";
// import all this after fake indexeddb
import { CategoryOperations } from "@/model/categoryOps";
import { MySubClassedDexie } from "@/model/db";
import { CategoryType, ExchangeType, WalletType, type Category, type Wallet } from "@/model/schema";
import { TransactionOperations } from "@/model/transactionOps";
import { WalletOperations } from "@/model/walletOps";
import { beforeEach, describe, expect, test } from "vitest";

const db = new MySubClassedDexie("testDatabase");
beforeEach(async () => {
  console.log("Called");
  await db.delete();
});

describe("Wallet Operations", () => {
  test("Wallet create", async () => {
    const myWallet: Wallet = {
      name: "cash",
      amount: 0,
      type: WalletType.enum.Cash,
    };
    const ret = await WalletOperations.create(myWallet);
    const ret2 = await WalletOperations.getById(ret?.id);
    expect(ret).toStrictEqual(ret2);
  });

  test("Wallet create with amount", async () => {
    const myWallet: Wallet = {
      name: "bank",
      amount: 500,
      type: WalletType.enum.Cash,
    };
    const ret = await WalletOperations.create(myWallet);
    const ret2 = await WalletOperations.getById(ret?.id);
    expect(ret).toStrictEqual(ret2);

    const transaction = await TransactionOperations.get(ret?.id);
    expect(transaction.length).toBe(1);
    expect(transaction[0].amount).toBe(500);
    expect(transaction[0].exchangeType).toBe(ExchangeType.enum.Income);
  });
});

describe("Category Operations", () => {
  test("Category add", async () => {
    const category: Category = {
      name: "Food",
      types: [CategoryType.enum.Expense],
      color: "#FFFFFF",
      icon: "🍕",
    };
    const ret = await CategoryOperations.add(category);
    const ret2 = await CategoryOperations.getById(ret?.id);
    expect(ret).toStrictEqual(ret2);
  });

  test("Category bulkadd", async () => {
    const category: Category = {
      name: "Food",
      types: [CategoryType.enum.Expense],
      color: "#FFFFFF",
      icon: "🍕",
    };

    const category2: Category = {
      name: "Dinner",
      types: [CategoryType.enum.Expense],
      color: "#FFFFFF",
      icon: "🍕",
    };
    await CategoryOperations.bulkAdd([category, category2]);
    const ret2 = await CategoryOperations.get();
    console.log(ret2);
    expect(2).toStrictEqual(ret2.length);
  });
});
