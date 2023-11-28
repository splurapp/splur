import { ExchangeType, SplurTransaction } from "@/model/db";
import { LoanOperations, TransactionOperations } from "@/model/transactionOps";
import { useState } from "react";
import EditParentLoan from "./EditParentLoan";
import ChildLoans from "./ChildLoans";

type Props = {};

const getExchangeType = (i: string) => {
  if (ExchangeType.BORROW.toString() === i) return ExchangeType.BORROW;
  return ExchangeType.LEND;
};

export default function Loan({}: Props) {
  const [loans, setLoans] = useState<SplurTransaction[]>([]);
  const [childLoans, setChildLoans] = useState<SplurTransaction[]>([]);
  const [exchangeType, setExchangeType] = useState<ExchangeType>(() => ExchangeType.BORROW);
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
      category: "loan",
      subcategory: exchangeType === ExchangeType.BORROW ? "borrow" : "lend",
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
          <button className="btn btn-primary" onClick={refreshLoans}>
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
              <strong>{item.exchangeType === ExchangeType.BORROW ? "Borrow" : "Lend"}</strong>
            </div>
            <div>
              Completion :: <strong>{getCompletion(item)}</strong>
            </div>
            <button className="btn" onClick={() => deleteLoan(item.id)}>
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
            <option key={1} value={ExchangeType.BORROW}>
              Borrow
            </option>
            <option key={4} value={ExchangeType.LEND}>
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
        <button className="btn btn-primary" onClick={createLoan}>
          Create Loan
        </button>
      </div>
    </div>
  );
}