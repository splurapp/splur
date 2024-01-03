import { TransactionOperations } from "@/model/transactionOps";

export async function loader() {
  return await TransactionOperations.get();
}
