import type { Category } from "@/model/schema";
import { ExchangeType } from "@/model/schema";
import { useMemo, useState } from "react";
import { useFetcher, useLoaderData } from "react-router-dom";
import type { z } from "zod";
import type { LoaderData } from "./track-loader";

export default function Track() {
  const fetcher = useFetcher<{ error?: string }>();
  const data = useLoaderData() as LoaderData;
  const [exchangeType, setExchangeType] = useState<z.infer<typeof ExchangeType>>(
    data?.transaction?.exchangeType ?? ExchangeType.enum.Expense,
  );
  const categories = useMemo<Category[]>(() => {
    return data.categories.filter(category =>
      category.types.includes(exchangeType === "Income" ? "Income" : "Expense"),
    );
  }, [exchangeType, data.categories]);

  const timestamp = data.transaction?.timestamp ?? new Date();

  return (
    <main>
      <h1 className="mb-4 text-2xl font-bold">{!data.transaction ? "Add" : "Edit"} transaction</h1>
      <div className="btm-nav btm-nav-sm relative mb-2">
        {[ExchangeType.enum.Income, ExchangeType.enum.Expense, ExchangeType.enum.Transfer].map(
          type => (
            <button
              disabled={
                data.transaction?.exchangeType === "Transfer" &&
                (type === "Expense" || type === "Income")
              }
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
      </div>

      <fetcher.Form method="post">
        <input type="hidden" name="exchangeType" value={exchangeType} />
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

        {exchangeType !== "Transfer" ? (
          <>
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
                {categories.map(category => (
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
          </>
        ) : (
          <>
            <div className="form-control mb-2 w-full">
              <label htmlFor="transferFrom" className="label">
                From
              </label>
              <select
                required
                name="transferFrom"
                id="transferFrom"
                className="select select-bordered"
                defaultValue={data.transaction?.transferFrom ?? ""}
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
            <div className="form-control mb-2 w-full">
              <label htmlFor="transferTo" className="label">
                To
              </label>
              <select
                required
                name="transferTo"
                id="transferTo"
                className="select select-bordered"
                defaultValue={data.transaction?.transferTo ?? ""}
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
          </>
        )}

        <button
          disabled={fetcher.state === "submitting"}
          type="submit"
          className="btn btn-primary w-full"
        >
          Submit
        </button>

        {fetcher.data && "error" in fetcher.data && (
          <p className="my-2 text-sm text-error">{fetcher.data.error}</p>
        )}
      </fetcher.Form>
    </main>
  );
}
