import { formatCurrency } from "@/lib/currency";
import { dateFormatter } from "@/lib/date";
import { ExchangeType, type SplurTransactionWithData } from "@/model/schema";
import { Button, Card, CardBody } from "@nextui-org/react";
import { Link } from "react-router-dom";

export default function TransactionsCard({ data }: { data: SplurTransactionWithData }) {
  return (
    <Link to={`track/${data.id}`}>
      <Card fullWidth>
        <CardBody className="flex-row items-center gap-3">
          <Button variant="flat" size="lg" isIconOnly className="text-xl">
            {data.category?.icon ?? "❓"}
          </Button>

          <div>
            <h3 className="text-lg font-medium">{data.title ?? "No title"}</h3>
            <p>{data.desc ?? "No description"}</p>
          </div>

          <div className="ml-auto text-right">
            <h3
              className={`text-lg font-medium ${
                data.exchangeType === ExchangeType.enum.Income ? "text-success" : "text-danger"
              }`}
            >
              {formatCurrency(data.amount)}
            </h3>
            <p>{dateFormatter.format(data.timestamp)}</p>
          </div>
        </CardBody>
      </Card>
    </Link>
  );
}
