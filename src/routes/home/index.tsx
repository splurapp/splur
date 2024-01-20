import { formatCurrency } from "@/lib/currency";
import type { SplurTransaction } from "@/model/schema";
import { Button, Card, CardBody } from "@nextui-org/react";
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
        <Card fullWidth>
          <CardBody className="flex flex-row items-center">
            <div className="flex-1">
              <div>Income</div>
              <div className="text-2xl text-success">{formatCurrency(totalIncome)}</div>
            </div>
            <div className="flex-1">
              <div>Expenses</div>
              <div className="text-2xl text-danger">{formatCurrency(totalExpense)}</div>
            </div>
          </CardBody>
        </Card>
      </Link>

      <section>
        <h1 className="mb-2">Recent Transactions</h1>
        <div className="flex flex-col gap-2">
          {transactions.map(transaction => (
            <TransactionsCard key={transaction.id} data={transaction} />
          ))}
        </div>
      </section>

      <Button
        as={Link}
        to="track"
        isIconOnly
        color="primary"
        size="lg"
        variant="shadow"
        className="fixed bottom-20 right-3 h-16 w-16"
        title="Add transaction icon"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-8 w-8"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M11 11V5H13V11H19V13H13V19H11V13H5V11H11Z"></path>
        </svg>
      </Button>
    </main>
  );
}
