import { SplurTransaction } from "@/model/db";
import { LoanOperations } from "@/model/transactionOps";
import React, { useEffect, useState } from "react";

type Props = {
  parent: SplurTransaction;
  transaction: SplurTransaction;
  refreshTransactions: () => Promise<void>;
};

export default function EditChildTransaction({ parent, transaction, refreshTransactions }: Props) {
  const [show, setShow] = useState(false);
  const [amount, setAmount] = useState(() => transaction.amount);

  const deleteTransaction = async (id: number | undefined) => {
    if (id) await LoanOperations.deleteChild(id);
    await refreshTransactions();
  };

  const updateTransaction = async () => {
    const myNewTransaction: SplurTransaction = {
      ...transaction,
      amount: amount,
    };
    await LoanOperations.edit(myNewTransaction);

    await refreshTransactions();
    setShow(false);
  };

  return (
    <div>
      {!show && (
        <>
          <button className={`btn`} onClick={() => setShow(!show)}>
            Edit
          </button>
          <button
            className={`btn`}
            onClick={() => {
              deleteTransaction(transaction.id);
            }}
          >
            Delete
          </button>
        </>
      )}

      {show && (
        <div>
          <div>
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
            <button className="btn btn-primary" onClick={updateTransaction}>
              Update
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
