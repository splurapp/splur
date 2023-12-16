import { ExchangeType, type SplurTransaction, type Wallet } from "@/model/schema";
import { TransactionOperations } from "@/model/transactionOps";
import { useEffect, useState } from "react";
import AddTransaction from "./AddTransaction";
import EditTransaction from "./EditTransaction";
import "./transaction.css";

interface Props {
  wallet: Wallet;
  refresh: () => Promise<void>;
}

export default function Transactions({ wallet, refresh }: Props) {
  const [transactions, setTransactions] = useState<SplurTransaction[]>([]);
  const [show, setShow] = useState(false);
  const [totalCalcAmount, setTotalCalcAmount] = useState(0);

  const refreshTransactions = async () => {
    const retTransaction = await TransactionOperations.get(wallet.id);
    setTransactions(retTransaction);
  };

  useEffect(() => {
    let amount = 0;
    transactions.forEach(item => {
      if (item.exchangeType !== ExchangeType.enum.Transfer) {
        if (
          item.exchangeType === ExchangeType.enum.Borrow ||
          item.exchangeType === ExchangeType.enum.Income
        ) {
          amount = amount + item.amount;
        } else if (
          item.exchangeType === ExchangeType.enum.Lend ||
          item.exchangeType === ExchangeType.enum.Expense
        ) {
          amount = amount - item.amount;
        }
      } else {
        if (wallet.id === item.transferTo) {
          amount = amount + item.amount;
        } else if (wallet.id === item.transferFrom) {
          amount = amount - item.amount;
        }
      }
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
          <div>Wallet Name - {wallet.name}</div>
          <div>
            Wallet/TRN Balance Amount - {wallet.amount}/{totalCalcAmount}
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
                  <EditTransaction
                    wallet={wallet}
                    transaction={item}
                    refreshTransactions={refreshTransactions}
                    disabled={wallet.id === item.transferTo}
                  />
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
