import { WalletType, walletSchema, type Wallet } from "@/model/schema";
import { WalletOperations } from "@/model/walletOps";
import type { ActionFunctionArgs } from "react-router-dom";

const DEFAULT_WALLETS: Wallet[] = [
  {
    name: "Bank",
    type: WalletType.enum.Bank,
    amount: 0,
  },
  {
    name: "Credit Card",
    type: WalletType.enum.CreditCard,
    amount: 0,
  },
  {
    name: "Cash",
    type: WalletType.enum.Cash,
    amount: 0,
  },
];

export interface LoaderData {
  wallets: Wallet[];
  defaultWallets: Wallet[];
}

export async function loader(): Promise<LoaderData> {
  let defaultWallets: Wallet[] = DEFAULT_WALLETS;

  const wallets = await WalletOperations.get();
  if (wallets.length > 0) {
    defaultWallets = defaultWallets.filter(
      defaultWallet => wallets.findIndex(wallet => wallet.name === defaultWallet.name) == -1,
    );
  }

  return { wallets, defaultWallets };
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();

  switch (request.method) {
    case "POST": {
      const wallet = DEFAULT_WALLETS.find(wallet => wallet.name === formData.get("wallet"));
      return await WalletOperations.create(wallet!);
    }
    case "PUT": {
      const wallet = walletSchema.parse(Object.fromEntries(formData));
      await WalletOperations.edit(wallet);
      return wallet;
    }
    default: {
      throw new Response("", { status: 405 });
    }
  }
}
