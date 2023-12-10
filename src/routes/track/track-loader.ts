import { CategoryOperations } from "@/model/categoryOps";
import type { SplurTransaction } from "@/model/db";
import { transactionSchema, type Category, type Wallet } from "@/model/schema";
import { TransactionOperations } from "@/model/transactionOps";
import { WalletOperations } from "@/model/walletOps";
import { redirect, type ActionFunctionArgs, type LoaderFunctionArgs } from "react-router-dom";

export interface LoaderData {
  wallets: Wallet[];
  categories: Category[];
  transaction?: SplurTransaction;
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

  if (id) {
    // EDITING TRANSACTION
    // @ts-expect-error change this once transaction schema is done
    await TransactionOperations.edit({ ...payload, id }); // TODO: change
  } else {
    // ADDING TRANSACTION
    // @ts-expect-error change this once transaction schema is done
    await TransactionOperations.add({ ...payload }); // TODO: change
  }

  return redirect("/");
}
