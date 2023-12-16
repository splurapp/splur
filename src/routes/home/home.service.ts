import { TransactionOperations } from "@/model/transactionOps";
import { WalletOperations } from "@/model/walletOps";

export async function loader() {
  return await Promise.all([TransactionOperations.get(), WalletOperations.get()]);
}
