import { ExchangeType, SplurTransaction, Wallet } from "@/model/db";
import { useEffect, useState } from "react";
import "./transaction.css";
import { TransactionOperations } from "@/model/transactionOps";
import EditTransaction from "./EditTransaction";
import AddTransaction from "./AddTransaction";

type Props = {
  wallet: Wallet;
  refresh: () => Promise<void>;
};

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
      if (item.exchangeType !== ExchangeType.TRANSFER) {
        if (
          item.exchangeType === ExchangeType.BORROW ||
          item.exchangeType === ExchangeType.CREDIT
        ) {
          amount = amount + item.amount;
        } else if (
          item.exchangeType === ExchangeType.LEND ||
          item.exchangeType === ExchangeType.DEBIT
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
    refresh().then(() => {});
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
