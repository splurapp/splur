import { ExchangeType } from "@/model/schema";
import { useState } from "react";
import { useFetcher, useLoaderData } from "react-router-dom";
import type { z } from "zod";
import type { LoaderData } from "./track-loader";

export default function Track() {
  const fetcher = useFetcher();
  const data = useLoaderData() as LoaderData;
  const [exchangeType, setExchangeType] = useState<z.infer<typeof ExchangeType>>(
    data?.transaction?.exchangeType ?? ExchangeType.enum.Expense,
  );

  const timestamp = data.transaction?.timestamp ?? new Date();

  return (
    <main>
      <h1 className="mb-4 text-2xl font-bold">{!data.transaction ? "Add" : "Edit"} transaction</h1>

      <fetcher.Form method="post">
        <div className="btm-nav btm-nav-sm relative mb-2">
          {[ExchangeType.enum.Income, ExchangeType.enum.Expense, ExchangeType.enum.Transfer].map(
            type => (
              <button
                type="button"
                key={type}
                className={`${
                  type === exchangeType ? "active bg-gradient-to-b from-base-300 to-base-200" : ""
                }`}
                onClick={() => setExchangeType(type)}
              >
                <span className="btm-nav-label">{type}</span>
              </button>
            ),
          )}
          <input type="hidden" name="exchangeType" value={exchangeType} />
        </div>

        <div className="form-control mb-2 w-full">
          <label htmlFor="title" className="label">
            Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            minLength={2}
            maxLength={50}
            className="input input-bordered"
            placeholder="Enter title"
            defaultValue={data.transaction?.title ?? ""}
          />
        </div>

        <div className="form-control mb-2 w-full">
          <label htmlFor="timestamp" className="label">
            Date
          </label>
          <input
            required
            type="datetime-local"
            id="timestamp"
            name="timestamp"
            className="input input-bordered w-full"
            placeholder="Select Date"
            defaultValue={`${timestamp.getFullYear()}-${
              timestamp.getMonth() + 1
            }-${timestamp.getDate()}T${timestamp.toTimeString().slice(0, 5)}`}
          />
        </div>

        <div className="form-control mb-2 w-full">
          <label htmlFor="amount" className="label">
            Amount
          </label>
          <input
            required
            type="number"
            id="amount"
            name="amount"
            min={0}
            className="input input-bordered"
            placeholder="Enter amount"
            defaultValue={data.transaction?.amount ?? 0}
          />
        </div>

        <div className="form-control mb-2 w-full">
          <label htmlFor="categoryId" className="label">
            Category
          </label>
          <select
            required
            name="categoryId"
            id="categoryId"
            className="select select-bordered"
            defaultValue={data.transaction?.categoryId ?? ""}
          >
            <option value="" disabled>
              Select category
            </option>
            {data.categories.map(category => (
              <option key={category.id} value={category.id}>
                {category.icon} {category.name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-control mb-2 w-full">
          <label htmlFor="walletId" className="label">
            Wallet
          </label>
          <select
            required
            name="walletId"
            id="walletId"
            className="select select-bordered"
            defaultValue={data.transaction?.walletId ?? ""}
          >
            <option value="" disabled>
              Select wallet
            </option>
            {data.wallets.map(wallet => (
              <option key={wallet.id} value={wallet.id}>
                {wallet.name}
              </option>
            ))}
          </select>
        </div>

        <button
          disabled={fetcher.state === "submitting"}
          type="submit"
          className="btn btn-primary w-full"
        >
          Submit
        </button>
      </fetcher.Form>
    </main>
  );
}
