import type { SplurTransaction } from "@/model/schema";
import { Link, useLoaderData } from "react-router-dom";
import TransactionsCard from "./TransactionsCard";

export default function Home() {
  const transactions = useLoaderData() as SplurTransaction[];

  return (
    <main>
      <section>
        <h1 className="text-xl">Recent transactions</h1>
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
