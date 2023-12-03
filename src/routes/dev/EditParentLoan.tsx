import type { SplurTransaction } from "@/model/db";
import { LoanOperations } from "@/model/transactionOps";
import { useState } from "react";

interface Props {
  info: SplurTransaction;
  refresh: () => Promise<void>;
}

export default function EditParentLoan({ info, refresh }: Props) {
  const [show, setShow] = useState(false);
  const [loanAmount, setLoanAmount] = useState(() => info.amount);

  const editLoan = async () => {
    await LoanOperations.edit({ ...info, amount: loanAmount });
    await refresh();
    setShow(false);
  };

  return (
    <div>
      {!show && (
        <button className="btn" onClick={() => setShow(!show)}>
          Edit Loan
        </button>
      )}
      {show && (
        <div>
          <input
            type="number"
            placeholder="enter loan amount"
            value={loanAmount}
            onChange={e => setLoanAmount(parseInt(e.target.value))}
          ></input>
          <br></br>
          <button className="btn" onClick={() => setShow(!show)}>
            Cancel
          </button>
          <button className="btn btn-primary" onClick={() => void editLoan()}>
            Edit
          </button>
        </div>
      )}
    </div>
  );
}
