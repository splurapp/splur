import { ExchangeType, SplurTransaction, Wallet } from "@/model/db";
import { TransactionOperations } from "@/model/transactionOps";
import { WalletOperations } from "@/model/walletOps";
import { useEffect, useState } from "react";

type Props = {
  transaction: SplurTransaction;
  refreshTransactions: () => Promise<void>;
};

interface SubCategories {
  [category: string]: string[];
}

const subCategories: SubCategories = {
  None: ["None"],
  Food: ["None"],
  "Bills & Utilities": [
    "Credit Card Bill",
    "Mobile Recharge",
    "Electricity",
    "Rent",
    "Water",
    "Gas",
    "Tax",
  ],
  Shopping: ["None"],
  Travel: ["None"],
  Entertainment: ["None"],
  Medical: ["None"],
  "Personal Care": ["None"],
  Education: ["None"],
  Invest: ["SIP", "FD", "Stocks", "Insurance"],
  Grocery: ["None"],
  Others: ["None"],
};

const categories = [
  "None",
  "Food",
  "Bills & Utilities",
  "Shopping",
  "Travel",
  "Entertainment",
  "Medical",
  "Personal Care",
  "Education",
  "Invest",
  "Grocery",
  "Others",
];

const getExchangeType = (i: string) => {
  if (ExchangeType.BORROW.toString() === i) return ExchangeType.BORROW;
  if (ExchangeType.CREDIT.toString() === i) return ExchangeType.CREDIT;
  if (ExchangeType.DEBIT.toString() === i) return ExchangeType.DEBIT;
  if (ExchangeType.LEND.toString() === i) return ExchangeType.LEND;
  return ExchangeType.TRANSFER;
};

export default function EditTransaction({ transaction, refreshTransactions }: Props) {
  const [show, setShow] = useState(false);
  const [wallets, setWallets] = useState<Wallet[]>([]);

  const [transferTo, setTransferTo] = useState(0);
  const [category, setCategory] = useState<string>(() =>
    transaction?.category ? transaction.category : "None",
  );
  const [subCategory, setSubCategory] = useState<string>(() =>
    transaction?.subcategory ? transaction.subcategory : "None",
  );
  const [exchangeType, setExchangeType] = useState<ExchangeType>(transaction.exchangeType);
  const [amount, setAmount] = useState(() => transaction.amount);

  const updateTransaction = async () => {
    if (
      exchangeType === ExchangeType.TRANSFER &&
      (transaction.assignedTo === transferTo || transferTo === 0)
    ) {
      return;
    }

    if (exchangeType !== ExchangeType.TRANSFER) {
      const myNewTransaction: SplurTransaction = {
        ...transaction,
        amount: amount,
        exchangeType: exchangeType,
      };

      await TransactionOperations.edit(myNewTransaction);
    } else {
      const myNewTransaction: SplurTransaction = {
        ...transaction,
        amount: amount,
        exchangeType: exchangeType,
        transferFrom: transaction.assignedTo,
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
    WalletOperations.get().then(ret => setWallets(ret));
  }, []);

  return (
    <>
      {!show && (
        <>
          <button className="btn" onClick={() => setShow(!show)}>
            Edit
          </button>
          <button
            className="btn"
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
                <option key={2} value={ExchangeType.CREDIT}>
                  Income
                </option>
                <option key={3} value={ExchangeType.DEBIT}>
                  Expense
                </option>
                <option key={4} value={ExchangeType.LEND}>
                  Lend
                </option>
                <option key={5} value={ExchangeType.TRANSFER}>
                  Transfer
                </option>
              </select>
            </label>

            {exchangeType === ExchangeType.TRANSFER && (
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
            <button className="btn btn-primary" onClick={updateTransaction}>
              Update
            </button>
          </div>
        </div>
      )}
    </>
  );
}
