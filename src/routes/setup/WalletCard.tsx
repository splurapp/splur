import { formatCurrency } from "@/lib/currency";
import type { Wallet } from "@/model/schema";
import { Button, Card, CardBody } from "@nextui-org/react";

interface WalletCardProps {
  wallet: Wallet;
  onEdit?: (wallet: Wallet) => void;
}

export default function WalletCard({ wallet, onEdit }: WalletCardProps) {
  return (
    <Card shadow="sm" isPressable as="div" fullWidth onPress={() => onEdit?.(wallet)}>
      <CardBody className="flex flex-row items-center justify-between">
        <div>
          <h2 className="text-lg font-medium">{wallet.name}</h2>
          <p>{formatCurrency(wallet.amount)}</p>
        </div>

        <Button isIconOnly isDisabled size="sm" variant="light">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={24} height={24}>
            <path
              d="M13.1717 12.0007L8.22192 7.05093L9.63614 5.63672L16.0001 12.0007L9.63614 18.3646L8.22192 16.9504L13.1717 12.0007Z"
              fill="currentColor"
            ></path>
          </svg>
        </Button>
      </CardBody>
    </Card>
  );
}
