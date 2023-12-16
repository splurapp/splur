import type { SplurTransaction } from "@/model/schema";
import { ExchangeType, type Wallet } from "@/model/schema";
import { TransactionOperations } from "@/model/transactionOps";
import { WalletOperations } from "@/model/walletOps";
import { useEffect, useState } from "react";
import type { z } from "zod";

interface Props {
  wallet: Wallet;
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

// const categories = [
//   "None",
//   "Food",
//   "Bills & Utilities",
//   "Shopping",
//   "Travel",
//   "Entertainment",
//   "Medical",
//   "Personal Care",
//   "Education",
//   "Invest",
//   "Grocery",
//   "Others",
// ];

const getExchangeType = (i: string) => {
  if (i === ExchangeType.enum.Borrow) return ExchangeType.enum.Borrow;
  if (i === ExchangeType.enum.Income) return ExchangeType.enum.Income;
  if (i === ExchangeType.enum.Expense) return ExchangeType.enum.Expense;
  if (i === ExchangeType.enum.Lend) return ExchangeType.enum.Lend;
  if (i === ExchangeType.enum.Borrow) return ExchangeType.enum.Borrow;
  return ExchangeType.enum.Transfer;
};

export default function AddTransaction({ wallet, refreshTransactions }: Props) {
  const [show, setShow] = useState(false);
  const [wallets, setWallets] = useState<Wallet[]>([]);

  const [transferTo, setTransferTo] = useState(0);
  const [exchangeType, setExchangeType] = useState<z.infer<typeof ExchangeType>>("Expense");
  const [amount, setAmount] = useState(() => 0);

  const addTransaction = async () => {
    if (!wallet.id) return;

    const newTransaction: SplurTransaction = {
      timestamp: new Date(),
      walletId: wallet.id,
      amount: amount,
      autoCategoryMap: true,
      // dismissed: undefined,
      exchanger: undefined,
      exchangeType: exchangeType,
      transferFrom: undefined,
      transferTo: undefined,
    };

    if (exchangeType === "Transfer" && (wallet.id === transferTo || transferTo === 0)) {
      return;
    }

    if (exchangeType !== "Transfer") {
      await TransactionOperations.add(newTransaction);
    } else {
      const myNewTransaction: SplurTransaction = {
        ...newTransaction,
        transferFrom: wallet.id,
        transferTo: transferTo,
        walletId: transferTo,
      };
      await TransactionOperations.add(myNewTransaction);
    }

    await refreshTransactions();
    setShow(false);
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
          <button className="btn" onClick={() => setShow(!show)}>
            Add Transaction
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
            <button className="btn btn-primary" onClick={() => void addTransaction()}>
              Add
            </button>
          </div>
        </div>
      )}
    </>
  );
}
