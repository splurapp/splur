import { WalletOperations } from "@/model/walletOps";

export async function loader() {
  return await WalletOperations.get();
}
