import { ExchangeType, SplurTransaction } from "@/model/db";
import { LoanOperations } from "@/model/transactionOps";
import { useState } from "react";

interface Props {
  parent: SplurTransaction;
  refreshTransactions: () => Promise<void>;
}

export default function AddChildTransaction({ parent, refreshTransactions }: Props) {
  const [show, setShow] = useState(false);
  const [amount, setAmount] = useState(0);
  const [exchangeType] = useState<ExchangeType>(() =>
    parent.exchangeType === ExchangeType.BORROW ? ExchangeType.SUB_BORROW : ExchangeType.SUB_LEND,
  );

  const addTransaction = async () => {
    if (!parent.id) return;

    const myNewTransaction: SplurTransaction = {
      timestamp: new Date(),
      autoCategoryMap: false,
      exchangeType: exchangeType,
      amount: amount,
      loanId: parent.id,
      category: "loan",
      subcategory: parent.exchangeType === ExchangeType.BORROW ? "borrow" : "lend",
    };
    await LoanOperations.addChild(myNewTransaction, parent.id);

    await refreshTransactions();
    setShow(false);
  };

  return (
    <div>
      {!show && (
        <>
          <button className="btn" onClick={() => setShow(!show)}>
            Add Transaction
          </button>
        </>
      )}

      {show && (
        <div>
          <div>
            <label>
              Transaction Type: {exchangeType === ExchangeType.SUB_BORROW ? "Borrow" : "Lend"}
            </label>

            <br></br>
            <label>
              Amount:
              <input
                type="number"
                value={amount}
                onChange={e => setAmount(parseFloat(e.target.value))}
              ></input>
            </label>

            <br></br>
            <button className="btn" onClick={() => setShow(!show)}>
              Close
            </button>
            <button className="btn btn-primary" onClick={() => void addTransaction()}>
              Add
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
