import type { SplurTransaction, Wallet } from "@/model/schema";
import { ExchangeType } from "@/model/schema";
import { TransactionOperations } from "@/model/transactionOps";
import { WalletOperations } from "@/model/walletOps";
import { useEffect, useState } from "react";
import type { z } from "zod";

interface Props {
  wallet: Wallet;
  disabled: boolean;
  transaction: SplurTransaction;
  refreshTransactions: () => Promise<void>;
}

// type SubCategories = Record<string, string[]>;

// const subCategories: SubCategories = {
//   None: ["None"],
//   Food: ["None"],
//   "Bills & Utilities": [
//     "Credit Card Bill",
//     "Mobile Recharge",
//     "Electricity",
//     "Rent",
//     "Water",
//     "Gas",
//     "Tax",
//   ],
//   Shopping: ["None"],
//   Travel: ["None"],
//   Entertainment: ["None"],
//   Medical: ["None"],
//   "Personal Care": ["None"],
//   Education: ["None"],
//   Invest: ["SIP", "FD", "Stocks", "Insurance"],
//   Grocery: ["None"],
//   Others: ["None"],
// };

const getExchangeType = (i: string) => {
  if (i === ExchangeType.enum.Borrow) return ExchangeType.enum.Borrow;
  if (i === ExchangeType.enum.Income) return ExchangeType.enum.Income;
  if (i === ExchangeType.enum.Expense) return ExchangeType.enum.Expense;
  if (i === ExchangeType.enum.Lend) return ExchangeType.enum.Lend;
  if (i === ExchangeType.enum.Borrow) return ExchangeType.enum.Borrow;
  return ExchangeType.enum.Transfer;
};

export default function EditTransaction({
  wallet,
  disabled,
  transaction,
  refreshTransactions,
}: Props) {
  const [show, setShow] = useState(false);
  const [wallets, setWallets] = useState<Wallet[]>([]);

  const [transferTo, setTransferTo] = useState(() =>
    transaction.transferTo ? transaction.transferTo : 0,
  );
  const [exchangeType, setExchangeType] = useState<z.infer<typeof ExchangeType>>(
    transaction.exchangeType,
  );
  const [amount, setAmount] = useState(() => transaction.amount);

  const updateTransaction = async () => {
    if (
      exchangeType === ExchangeType.enum.Transfer &&
      (wallet.id === transferTo || transferTo === 0)
    ) {
      return;
    }

    if (exchangeType !== ExchangeType.enum.Transfer) {
      const myNewTransaction: SplurTransaction = {
        ...transaction,
        amount: amount,
        exchangeType: exchangeType,
      };

      if (transaction.exchangeType === ExchangeType.enum.Transfer) {
        myNewTransaction.assignedTo = transaction.transferFrom;
      }

      console.log(myNewTransaction);

      await TransactionOperations.edit(myNewTransaction);
    } else {
      const myNewTransaction: SplurTransaction = {
        ...transaction,
        amount: amount,
        exchangeType: exchangeType,
        transferFrom: wallet.id,
        transferTo: transferTo,
        assignedTo: transferTo,
      };
      await TransactionOperations.edit(myNewTransaction);
    }

    await refreshTransactions();
    setShow(false);
  };

  const deleteTransaction = async (id: number | undefined) => {
    if (id) await TransactionOperations.delete(id);
    await refreshTransactions();
  };

  useEffect(() => {
    WalletOperations.get()
      .then(ret => setWallets(ret))
      .catch(reason => console.error(reason));
  }, []);

  return (
    <>
      {!show && (
        <>
          <button className={`btn ${disabled && "disabled"}`} onClick={() => setShow(!show)}>
            Edit
          </button>
          <button
            className={`btn ${disabled && "disabled"}`}
            onClick={() => void deleteTransaction(transaction.id)}
          >
            Delete
          </button>
        </>
      )}

      {show && (
        <div>
          <div>
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
                <option key={2} value={ExchangeType.enum.Income}>
                  Income
                </option>
                <option key={3} value={ExchangeType.enum.Expense}>
                  Expense
                </option>
                <option key={4} value={ExchangeType.enum.Lend}>
                  Lend
                </option>
                <option key={5} value={ExchangeType.enum.Transfer}>
                  Transfer
                </option>
              </select>
            </label>

            {exchangeType === ExchangeType.enum.Transfer && (
              <label>
                Transfer To:
                <select
                  name="wallets"
                  value={transferTo}
                  onChange={e => setTransferTo(parseInt(e.target.value))}
                >
                  <option key="default" value={0}>
                    None
                  </option>
                  {wallets.map((item, index) => (
                    <option key={index} value={item.id}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </label>
            )}
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
            <button className="btn btn-primary" onClick={() => void updateTransaction()}>
              Update
            </button>
          </div>
        </div>
      )}
    </>
  );
}
