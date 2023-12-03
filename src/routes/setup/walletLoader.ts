import type { Wallet } from "@/model/db";
import { WalletType } from "@/model/db";
import { WalletOperations } from "@/model/walletOps";

const DEFAULT_WALLETS: Wallet[] = [
  {
    name: "Bank",
    type: WalletType.BANK,
    amount: 0,
  },
  {
    name: "Credit Card",
    type: WalletType.CREDITCARD,
    amount: 0,
  },
  {
    name: "Cash",
    type: WalletType.CASH,
    amount: 0,
  },
];

export async function loader() {
  let defaultWallets: Wallet[] = DEFAULT_WALLETS;

  const wallets = await WalletOperations.get();
  if (wallets.length > 0) {
    defaultWallets = defaultWallets.filter(
      defaultWallet => wallets.findIndex(wallet => wallet.name === defaultWallet.name) == -1,
    );
  }

  return { wallets, defaultWallets };
}
