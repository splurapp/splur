import type { SplurTransaction } from "@/model/schema";
import { ExchangeType } from "@/model/schema";
import { LoanOperations } from "@/model/transactionOps";
import { useState } from "react";
import type { z } from "zod";
import ChildLoans from "./ChildLoans";
import EditParentLoan from "./EditParentLoan";

const getExchangeType = (i: string) => {
  if (i === ExchangeType.enum.Borrow) return ExchangeType.enum.Borrow;
  return ExchangeType.enum.Lend;
};

export default function Loan() {
  const [loans, setLoans] = useState<SplurTransaction[]>([]);
  const [childLoans, setChildLoans] = useState<SplurTransaction[]>([]);
  const [exchangeType, setExchangeType] = useState<z.infer<typeof ExchangeType>>(
    () => ExchangeType.enum.Borrow,
  );
  const [amount, setAmount] = useState(() => 0);

  const refreshLoans = async () => {
    const loans = await LoanOperations.get();
    const parentLoans = loans.filter(item => item.id === item.loanId);
    const childLoans = loans.filter(item => item.loanId !== item.id);
    setLoans(parentLoans);
    setChildLoans(childLoans);
  };

  const createLoan = async () => {
    const myLoan: SplurTransaction = {
      timestamp: new Date(),
      amount: amount,
      autoCategoryMap: false,
      exchangeType: exchangeType,
    };
    await LoanOperations.create(myLoan);
    await refreshLoans();
  };

  const deleteLoan = async (id: number | undefined) => {
    if (id) {
      await LoanOperations.destroy(id);
      await refreshLoans();
    }
  };

  const getCompletion = (parent: SplurTransaction) => {
    let totalAmount = 0;

    childLoans.forEach(item => {
      if (item.loanId === parent.id) {
        totalAmount += item.amount;
      }
    });

    if (totalAmount >= parent.amount) {
      return "Completed";
    }

    return (
      `${totalAmount} [` + parseFloat(`${(totalAmount / parent.amount) * 100}`).toFixed(2) + "%]"
    );
  };

  return (
    <div>
      <br></br>
      <hr></hr>
      <br></br>

      <h1>Loans</h1>

      <div>
        <h2>
          Loans{" "}
          <button className="btn btn-primary" onClick={() => void refreshLoans()}>
            Refresh
          </button>
        </h2>
        {loans.length === 0 && <div>No loans</div>}
        {loans.map((item, index) => (
          <div key={index}>
            <div>
              ID :: <strong>{item.id}</strong>
            </div>
            <div>
              Amount :: <strong>{item.amount}</strong>
            </div>
            <div>
              Type ::{" "}
              <strong>{item.exchangeType === ExchangeType.enum.Borrow ? "Borrow" : "Lend"}</strong>
            </div>
            <div>
              Completion :: <strong>{getCompletion(item)}</strong>
            </div>
            <button className="btn" onClick={() => void deleteLoan(item.id)}>
              Delete
            </button>
            <EditParentLoan info={item} refresh={refreshLoans} />
            <ChildLoans parent={item} refresh={refreshLoans} />
          </div>
        ))}

        <hr></hr>
        <h1>Create Loan</h1>
        <label>
          Transaction Type:
          <select
            name="transactionType"
            value={exchangeType}
            onChange={e => setExchangeType(getExchangeType(e.target.value))}
          >
            <option key={1} value={ExchangeType.enum.Borrow}>
              Borrow
            </option>
            <option key={4} value={ExchangeType.enum.Lend}>
              Lend
            </option>
          </select>
        </label>
        <br></br>
        <input
          type="number"
          placeholder="initial amount"
          value={amount}
          onChange={e => setAmount(parseFloat(e.target.value))}
        ></input>
        <br></br>
        <br></br>
        <button className="btn btn-primary" onClick={() => void createLoan()}>
          Create Loan
        </button>
      </div>
    </div>
  );
}
