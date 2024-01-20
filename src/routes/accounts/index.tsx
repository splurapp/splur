import { formatCurrency } from "@/lib/currency";
import { Link, useLoaderData } from "react-router-dom";
import WalletCard from "../setup/WalletCard";
import type { loader } from "./account.service";

export default function Accounts() {
  const wallets = useLoaderData() as Awaited<ReturnType<typeof loader>>;
  const totalBalance = wallets.reduce((balance, cur) => balance + cur.amount, 0);

  return (
    <main className="flex h-full flex-col justify-between gap-2">
      <div className="card card-compact bg-gradient-to-r from-indigo-200 to-pink-200">
        <div className="card-body items-center text-center">
          <p>Account Balance</p>
          <h2 className="card-title text-3xl">{formatCurrency(totalBalance)}</h2>
        </div>
      </div>

      <section className="join join-vertical w-full gap-1">
        {wallets?.map(wallet => (
          <Link key={wallet.id} to={String(wallet.id ?? "")}>
            <WalletCard wallet={wallet} />
          </Link>
        ))}
      </section>

      <Link to="add" className="mt-auto">
        <button className="btn btn-primary w-full">Add new account</button>
      </Link>
    </main>
  );
}
