import { CategoryOperations } from "@/model/categoryOps";
import type { SplurTransactionWithData } from "@/model/schema";
import { transactionSchema, type Category, type Wallet } from "@/model/schema";
import { TransactionOperations } from "@/model/transactionOps";
import { WalletOperations } from "@/model/walletOps";
import { json, redirect, type ActionFunctionArgs, type LoaderFunctionArgs } from "react-router-dom";

export interface LoaderData {
  wallets: Wallet[];
  categories: Category[];
  transaction?: SplurTransactionWithData;
}

export async function loader({ params }: LoaderFunctionArgs<unknown>): Promise<LoaderData> {
  const id = Number(params?.id) || 0;

  const [wallets, categories] = await Promise.all([
    WalletOperations.get(),
    CategoryOperations.get(),
  ]);

  const data: LoaderData = {
    wallets,
    categories,
  };

  if (id === 0) {
    return data;
  }

  data.transaction = await TransactionOperations.getById(id);
  return data;
}

export async function action({ request, params }: ActionFunctionArgs) {
  const id = Number(params?.id) || 0;
  const formData = Object.fromEntries(await request.formData());
  const payload = transactionSchema.parse(formData);

  if (payload.exchangeType === "Transfer") {
    if (payload.transferFrom === payload.transferTo) {
      return json({ error: "Transfer from and To wallet can not be the same" });
    }
    payload.walletId = payload.transferTo; // TODO: probably not the best way to handle this
  }

  if (id) {
    await TransactionOperations.edit(payload);
  } else {
    await TransactionOperations.add(payload);
  }

  return redirect("/");
}
