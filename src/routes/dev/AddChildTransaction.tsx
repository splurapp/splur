import type { SplurTransaction } from "@/model/schema";
import { ExchangeType } from "@/model/schema";
import { LoanOperations } from "@/model/transactionOps";
import { useState } from "react";
import type { z } from "zod";

interface Props {
  parent: SplurTransaction;
  refreshTransactions: () => Promise<void>;
}

export default function AddChildTransaction({ parent, refreshTransactions }: Props) {
  const [show, setShow] = useState(false);
  const [amount, setAmount] = useState(0);
  const [exchangeType] = useState<z.infer<typeof ExchangeType>>(() =>
    parent.exchangeType === "Borrow" ? "SubBorrow" : "SubLend",
  );

  const addTransaction = async () => {
    if (!parent.id) return;

    const myNewTransaction: SplurTransaction = {
      timestamp: new Date(),
      autoCategoryMap: false,
      exchangeType: exchangeType,
      amount: amount,
      loanId: parent.id,
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
              Transaction Type: {exchangeType === ExchangeType.enum.SubBorrow ? "Borrow" : "Lend"}
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
