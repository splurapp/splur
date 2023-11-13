import { SplurTransaction, Wallet } from "@/model/db";
import { useState } from "react";
import "./transaction.css";
import { TransactionOperations } from "@/model/transactionOps";
import EditTransaction from "./EditTransaction";
import AddTransaction from "./AddTransaction";

type Props = {
  wallet: Wallet;
  refresh: () => Promise<void>;
};

export default function Transactions({ wallet }: Props) {
  const [transactions, setTransactions] = useState<SplurTransaction[]>([]);
  const [show, setShow] = useState(false);

  const refreshTransactions = async () => {
    const retTransaction = await TransactionOperations.get(wallet.id);
    setTransactions(retTransaction);
  };
  return (
    <div>
      {!show && (
        <button className="btn btn-primary" onClick={() => setShow(!show)}>
          Show Transactions
        </button>
      )}
      {show && transactions.length === 0 && <div>No Transactions</div>}
      {show && (
        <div className="trn-cont">
          <h1>Transactions - </h1>
          <button className="btn btn-primary" onClick={refreshTransactions}>
            Refresh
          </button>
          <br></br>
          <br></br>
          <div className="transactions">
            {transactions.map((item, index) => (
              <div key={index}>
                <div key={index}>
                  {item.timestamp.toTimeString()} - {item.exchangeType} - {item.amount}
                  {" ----> "}
                  <EditTransaction transaction={item} refreshTransactions={refreshTransactions} />
                </div>
                <hr></hr>
              </div>
            ))}
            <AddTransaction wallet={wallet} refreshTransactions={refreshTransactions} />
          </div>

          <hr></hr>
          <button id="close-btn" className="btn btn-primary" onClick={() => setShow(!show)}>
            Close
          </button>
        </div>
      )}
    </div>
  );
}
