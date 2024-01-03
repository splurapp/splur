import { formatCurrency } from "@/lib/currency";
import type { Wallet } from "@/model/schema";

interface WalletCardProps {
  wallet: Wallet;
  onEdit?: (wallet: Wallet) => void;
}

export default function WalletCard({ wallet, onEdit }: WalletCardProps) {
  return (
    <>
      <div className="card join-item bg-primary">
        <div className="card-body flex-row items-center justify-between">
          <div>
            <h2 className="card-title">{wallet.name}</h2>
            <p>{formatCurrency(wallet.amount)}</p>
          </div>
          {onEdit ? (
            <button className="btn btn-circle btn-ghost" onClick={() => onEdit(wallet)}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
                <path
                  fill="currentColor"
                  d="M12.8995 6.85431L17.1421 11.0969L7.24264 20.9964H3V16.7538L12.8995 6.85431ZM14.3137 5.44009L16.435 3.31877C16.8256 2.92825 17.4587 2.92825 17.8492 3.31877L20.6777 6.1472C21.0682 6.53772 21.0682 7.17089 20.6777 7.56141L18.5563 9.68273L14.3137 5.44009Z"
                ></path>
              </svg>
            </button>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={24} height={24}>
              <path
                d="M13.1717 12.0007L8.22192 7.05093L9.63614 5.63672L16.0001 12.0007L9.63614 18.3646L8.22192 16.9504L13.1717 12.0007Z"
                fill="currentColor"
              ></path>
            </svg>
          )}
        </div>
      </div>
    </>
  );
}
