import { Chip } from "@nextui-org/react";

export default function SuggestionsChip({ walletName }: { walletName: string }) {
  return (
    <Chip
      startContent={
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20">
          <path d="M11 11V5H13V11H19V13H13V19H11V13H5V11H11Z" fill="currentColor"></path>
        </svg>
      }
      size="lg"
      variant="flat"
      as="button"
      radius="md"
      type="submit"
      name="wallet"
      value={walletName}
      className="h-10"
    >
      {walletName}
    </Chip>
  );
}
