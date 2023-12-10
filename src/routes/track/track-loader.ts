import type { SplurTransaction } from "@/model/db";
import type { Wallet } from "@/model/schema";
import { TransactionOperations } from "@/model/transactionOps";
import { WalletOperations } from "@/model/walletOps";
import type { LoaderFunctionArgs } from "react-router-dom";

export interface LoaderData {
  wallets: Wallet[];
  transaction?: SplurTransaction;
}

export async function loader({ params }: LoaderFunctionArgs<unknown>): Promise<LoaderData> {
  const id = Number(params?.id) || 0;
  const data: LoaderData = {
    wallets: await WalletOperations.get(),
  };
  if (id === 0) return data;

  data.transaction = await TransactionOperations.getById(id);
  return data;
}
