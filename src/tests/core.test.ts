import "fake-indexeddb/auto";
import { describe, test, expect, beforeEach } from "vitest";
import { ExchangeType, MySubClassedDexie, Wallet, WalletType } from "../model/db";
import { WalletOperations } from "@/model/walletOps";
import { TransactionOperations } from "@/model/transactionOps";

const db = new MySubClassedDexie("testDatabase");
beforeEach(async () => await db.delete());

describe("Wallet Operations", () => {
  test("Wallet create", async () => {
    const myWallet: Wallet = {
      name: "cash",
      amount: 0,
      type: WalletType.CASH,
    };
    const ret = await WalletOperations.create(myWallet);
    const ret2 = await WalletOperations.getById(ret?.id);
    expect(ret).toStrictEqual(ret2);
  });

  test("Wallet create with amount", async () => {
    const myWallet: Wallet = {
      name: "bank",
      amount: 500,
      type: WalletType.CASH,
    };
    const ret = await WalletOperations.create(myWallet);
    const ret2 = await WalletOperations.getById(ret?.id);
    expect(ret).toStrictEqual(ret2);

    const transaction = await TransactionOperations.get(ret?.id);
    expect(transaction.length).toBe(1);
    expect(transaction[0].amount).toBe(500);
    expect(transaction[0].exchangeType).toBe(ExchangeType.CREDIT);
  });
});
