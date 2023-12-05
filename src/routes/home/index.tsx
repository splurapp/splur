import { formatCurrency } from "@/lib/currency";
import { dateFormatter } from "@/lib/date";
import { ExchangeType, type SplurTransaction } from "@/model/db";
import type { AsyncReturnType } from "@/types/utils";
import { Link, useLoaderData } from "react-router-dom";
import type { loader } from "./transaction-loader";

function TransactionsCard({ data }: { data: SplurTransaction }) {
  return (
    <div className="card-compact card card-bordered join-item shadow-lg">
      <div className="card-body flex-row gap-3">
        <div className="rounded-lg bg-primary p-5">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M18.0049 7H21.0049C21.5572 7 22.0049 7.44772 22.0049 8V20C22.0049 20.5523 21.5572 21 21.0049 21H3.00488C2.4526 21 2.00488 20.5523 2.00488 20V4C2.00488 3.44772 2.4526 3 3.00488 3H18.0049V7ZM4.00488 9V19H20.0049V9H4.00488ZM4.00488 5V7H16.0049V5H4.00488ZM15.0049 13H18.0049V15H15.0049V13Z"></path>
          </svg>
        </div>

        <div>
          <h3 className="card-title text-lg">Category</h3>
          <p>no description</p>
        </div>

        <div className="ml-auto text-end">
          <h1
            className={`card-title ml-auto ${
              data.exchangeType === ExchangeType.CREDIT ? "text-success" : "text-error"
            }`}
          >
            {formatCurrency(data.amount)}
          </h1>
          <p>{dateFormatter.format(data.timestamp)}</p>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const transactions = useLoaderData() as AsyncReturnType<typeof loader>;

  return (
    <main className="p-3">
      <section>
        <h1 className="text-xl">Recent transactions</h1>
        <div className="join join-vertical w-full gap-2 rounded-md">
          {transactions.map(transaction => (
            <TransactionsCard key={transaction.id} data={transaction} />
          ))}
        </div>
      </section>
      <Link to="track">
        <button className="btn btn-circle btn-primary btn-lg fixed bottom-20 right-3">
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
