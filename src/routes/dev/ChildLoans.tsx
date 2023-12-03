import type { SplurTransaction } from "@/model/db";
import { LoanOperations } from "@/model/transactionOps";
import { useEffect, useState } from "react";
import AddChildTransaction from "./AddChildTransaction";
import EditChildTransaction from "./EditChildTransaction";

interface Props {
  parent: SplurTransaction;
  refresh: () => Promise<void>;
}

export default function ChildLoans({ parent, refresh }: Props) {
  const [transactions, setTransactions] = useState<SplurTransaction[]>([]);
  const [show, setShow] = useState(false);
  const [totalCalcAmount, setTotalCalcAmount] = useState(0);

  const refreshTransactions = async () => {
    const retTransaction = await LoanOperations.get(parent.id);
    const childTransactions = retTransaction.filter(item => item.id !== item.loanId);

    setTransactions(childTransactions);
  };

  useEffect(() => {
    let amount = 0;
    transactions.forEach(item => {
      amount += item.amount;
    });

    setTotalCalcAmount(amount);
  }, [transactions]);

  useEffect(() => {
    refresh().catch(reason => {
      console.error(reason);
    });
  }, [transactions]);

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
          <div>Parent Loan Amount - {parent.amount}</div>
          <div>
            Parent/TRN Balance Amount - {parent.amount}/{totalCalcAmount}
          </div>
          <h1>Transactions - </h1>
          <button className="btn btn-primary" onClick={() => void refreshTransactions()}>
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
                  <EditChildTransaction
                    parent={parent}
                    transaction={item}
                    refreshTransactions={refreshTransactions}
                  />
                </div>
                <hr></hr>
              </div>
            ))}
            <AddChildTransaction parent={parent} refreshTransactions={refreshTransactions} />
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
