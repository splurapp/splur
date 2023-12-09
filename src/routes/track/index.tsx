import { ExchangeType } from "@/model/db";
import React, { useState } from "react";
import { useLoaderData } from "react-router-dom";
import type { LoaderData } from "./track-loader";

// TODO: setup categories
export function Component() {
  const data = useLoaderData() as LoaderData;

  const [date, setDate] = useState(data.transaction?.timestamp ?? new Date());
  const [amount, setAmount] = useState(data.transaction?.amount ?? 0);
  const [category, setCategory] = useState(data.transaction?.category?.name ?? "");
  const [wallet, setWallet] = useState(data.transaction?.assignedToWallet?.name ?? "");
  const [exchangeType, setExchangeType] = useState<ExchangeType>(
    data?.transaction?.exchangeType ?? ExchangeType.DEBIT,
  );

  function handleSubmit(e: React.SyntheticEvent) {
    e.preventDefault();
    console.log({
      date,
      amount,
      category,
      wallet,
      exchangeType,
    });
  }

  return (
    <main>
      <h1 className="mb-4 text-2xl font-bold">{!data.transaction ? "Add" : "Edit"} transaction</h1>

      <div className="btm-nav btm-nav-sm relative mb-2">
        {[ExchangeType.CREDIT, ExchangeType.DEBIT, ExchangeType.TRANSFER].map(type => (
          <button
            key={type}
            className={`${
              type === exchangeType ? "active bg-gradient-to-b from-base-300 to-base-200" : ""
            }`}
            onClick={() => setExchangeType(type)}
          >
            <span className="btm-nav-label">{type}</span>
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-control mb-4 w-full">
          <label htmlFor="date" className="label">
            Date
          </label>
          <input
            type="datetime-local"
            id="date"
            name="date"
            className="input input-bordered w-full"
            placeholder="Select Date"
            value={date.toISOString().slice(0, 11) + date.toTimeString().slice(0, 5)}
            onChange={e => setDate(new Date(e.target.value || new Date()))}
          />
        </div>

        <div className="form-control mb-4 w-full">
          <label htmlFor="amount" className="label">
            Amount
          </label>
          <input
            type="number"
            id="amount"
            name="amount"
            min={0}
            className="input input-bordered"
            placeholder="Enter amount"
            value={amount}
            onChange={e => setAmount(Number(e.target.value))}
          />
        </div>

        <div className="form-control mb-4 w-full">
          <label htmlFor="category" className="label">
            Category
          </label>
          <select
            name="category"
            id="category"
            className="select select-bordered"
            value={category}
            onChange={e => setCategory(e.target.value)}
          >
            <option value="" disabled>
              Select category
            </option>
            <option value="Income">Food</option>
            <option value="Expense">Travel</option>
          </select>
        </div>

        <div className="form-control mb-4 w-full">
          <label htmlFor="wallet" className="label">
            Wallet
          </label>
          <select
            name="wallet"
            id="wallet"
            className="select select-bordered"
            value={wallet}
            onChange={e => setWallet(e.target.value)}
          >
            <option value="" disabled>
              Select wallet
            </option>
            {data.wallets.map(wallet => (
              <option key={wallet.name} value={wallet.name}>
                {wallet.name}
              </option>
            ))}
          </select>
        </div>

        <button type="submit" className="btn btn-primary w-full">
          Submit
        </button>
      </form>
    </main>
  );
}

Component.displayName = "Track";
