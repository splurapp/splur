import { formatCurrency } from "@/lib/currency";
import type { SplurTransaction } from "@/model/schema";
import { Link, useLoaderData } from "react-router-dom";
import TransactionsCard from "./TransactionsCard";
import type { loader } from "./home.service";

function getAmounts(transactions: SplurTransaction[]) {
  let totalIncome = 0,
    totalExpense = 0;

  for (const transaction of transactions) {
    if (transaction.exchangeType === "Income") totalIncome += transaction.amount;
    if (transaction.exchangeType === "Expense") totalExpense += transaction.amount;
  }

  return { totalIncome, totalExpense };
}

export default function Home() {
  const transactions = useLoaderData() as Awaited<ReturnType<typeof loader>>;
  const { totalExpense, totalIncome } = getAmounts(transactions);

  return (
    <main className="flex flex-col gap-3">
      <Link to="accounts">
        <div>
          <div className="stats w-full border border-primary bg-primary bg-opacity-30 text-primary-content">
            <div className="stat">
              <div className="stat-title">Income</div>
              <div className="stat-value text-success">{formatCurrency(totalIncome)}</div>
            </div>

            <div className="stat">
              <div className="stat-title">Expenses</div>
              <div className="stat-value text-error">{formatCurrency(totalExpense)}</div>
            </div>
          </div>
        </div>
      </Link>

      <section>
        <h1 className="mb-1">Recent Transactions</h1>
        <div className="join join-vertical w-full gap-2 rounded-md">
          {transactions.map(transaction => (
            <TransactionsCard key={transaction.id} data={transaction} />
          ))}
        </div>
      </section>

      <Link to="track" title="Add transaction icon">
        <button className="btn btn-circle btn-primary btn-lg absolute bottom-20 right-3">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M11 11V5H13V11H19V13H13V19H11V13H5V11H11Z"></path>
          </svg>
        </button>
      </Link>
    </main>
  );
}
