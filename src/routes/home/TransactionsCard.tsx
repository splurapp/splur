import { formatCurrency } from "@/lib/currency";
import { dateFormatter } from "@/lib/date";
import type { SplurTransactionWithData } from "@/model/schema";
import { ExchangeType } from "@/model/schema";
import { Link } from "react-router-dom";

export default function TransactionsCard({ data }: { data: SplurTransactionWithData }) {
  return (
    <Link to={`track/${data.id}`}>
      <div className="card join-item card-bordered card-compact border border-primary shadow-lg">
        <div className="card-body flex-row gap-3">
          <div className="rounded-lg bg-primary bg-opacity-50 p-3 text-2xl">
            {data.category?.icon ?? "❓"}
          </div>

          <div>
            <h3 className="card-title text-lg">{data.title ?? "No title"}</h3>
            <p>{data.desc ?? "No description"}</p>
          </div>

          <div className="ml-auto">
            <h1
              className={`card-title justify-end ${
                data.exchangeType === ExchangeType.enum.Income ? "text-success" : "text-error"
              }`}
            >
              {formatCurrency(data.amount)}
            </h1>
            <p>{dateFormatter.format(data.timestamp)}</p>
          </div>
        </div>
      </div>
    </Link>
  );
}
