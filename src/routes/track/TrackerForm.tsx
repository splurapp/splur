import type { Category } from "@/model/schema";
import { Button, Input, Select, SelectItem } from "@nextui-org/react";
import dayjs from "dayjs";
import { useMemo } from "react";
import { useFetcher } from "react-router-dom";
import type { LoaderData as TrackLoaderData } from "./track.service";

interface Props {
  exchangeType: string;
  data: TrackLoaderData;
}

export default function TrackerForm({ exchangeType, data }: Props) {
  const fetcher = useFetcher<{ error?: string }>();
  const timestamp = data.transaction?.timestamp ?? new Date();

  const categories = useMemo<Category[]>(() => {
    return data.categories.filter(category =>
      category.types.includes(exchangeType === "Income" ? "Income" : "Expense"),
    );
  }, [exchangeType, data.categories]);

  return (
    <fetcher.Form method="post" className="space-y-2">
      <input type="hidden" name="exchangeType" value={exchangeType} />
      <Input
        type="text"
        id="title"
        name="title"
        defaultValue={data.transaction?.title ?? ""}
        placeholder="enter title"
        variant="faded"
        minLength={2}
        maxLength={50}
      />

      <Input
        isRequired
        type="datetime-local"
        id="timestamp"
        name="timestamp"
        defaultValue={dayjs(timestamp).format().split("+")[0]}
        variant="faded"
      />

      <Input
        isRequired
        id="amount"
        name="amount"
        type="number"
        min={0}
        placeholder="enter amount"
        defaultValue={data?.transaction?.amount === 0 ? "" : data.transaction?.amount.toString()}
        variant="faded"
      />

      {exchangeType !== "Transfer" ? (
        <>
          <Select
            aria-label="category"
            isRequired
            name="categoryId"
            id="categoryId"
            variant="faded"
            placeholder="select category"
            defaultSelectedKeys={
              data.transaction?.category?.id
                ? [data.transaction?.category?.id.toString()]
                : undefined
            }
          >
            {categories.map(category => (
              <SelectItem
                key={category.id!}
                value={category.id}
                textValue={`${category.icon} ${category.name}`}
              >
                {category.icon} {category.name}
              </SelectItem>
            ))}
          </Select>

          <Select
            aria-label="Wallet selection"
            isRequired
            name="walletId"
            id="walletId"
            placeholder="select wallet"
            variant="faded"
            defaultSelectedKeys={
              data.transaction?.walletId ? [data.transaction.walletId.toString()] : undefined
            }
          >
            {data.wallets.map(wallet => (
              <SelectItem key={wallet.id!} value={wallet.id}>
                {wallet.name}
              </SelectItem>
            ))}
          </Select>
        </>
      ) : (
        <>
          <Select
            aria-label="Transfer from wallet"
            isRequired
            name="transferFrom"
            id="transferFrom"
            placeholder="from wallet"
            variant="faded"
            defaultSelectedKeys={
              data.transaction?.transferFrom
                ? [data.transaction?.transferFrom.toString()]
                : undefined
            }
          >
            {data.wallets.map(wallet => (
              <SelectItem key={wallet.id ?? 0} value={wallet.id}>
                {wallet.name}
              </SelectItem>
            ))}
          </Select>
          <Select
            aria-label="Transfer to wallet"
            isRequired
            name="transferTo"
            id="transferTo"
            placeholder="to wallet"
            variant="faded"
            defaultSelectedKeys={
              data.transaction?.transferTo ? [data.transaction?.transferTo.toString()] : undefined
            }
          >
            {data.wallets.map(wallet => (
              <SelectItem key={wallet.id ?? 0} value={wallet.id}>
                {wallet.name}
              </SelectItem>
            ))}
          </Select>
        </>
      )}

      {fetcher.data && "error" in fetcher.data && (
        <p className="my-2 text-sm text-danger">{fetcher.data.error}</p>
      )}

      <Button
        fullWidth
        size="lg"
        isDisabled={fetcher.state === "submitting"}
        color="primary"
        type="submit"
      >
        Submit
      </Button>
    </fetcher.Form>
  );
}
