import type { Wallet } from "@/model/db";
import { useState } from "react";

interface EditWalletModalProps {
  wallet: Wallet;
  isOpen: boolean;
  onSave: (editedWallet: Wallet) => void;
  onClose: () => void;
}

export default function EditWalletModal({ isOpen, onSave, wallet, onClose }: EditWalletModalProps) {
  const [editedName, setEditedName] = useState(wallet.name);
  const [editedAmount, setEditedAmount] = useState(wallet.amount);

  return (
    <dialog id="edit-wallet-modal" className="modal modal-bottom" open={isOpen}>
      <div className="modal-box border-2 border-primary">
        <h1 className="text-lg">Edit Wallet</h1>

        <div className="form-control w-full">
          <label htmlFor="wallet" className="label">
            <span className="label-text">Name</span>
          </label>
          <input
            type="text"
            name="wallet"
            id="wallet"
            placeholder="Enter wallet name"
            className="input input-bordered input-primary"
            value={editedName}
            onChange={e => setEditedName(e.target.value)}
          />
        </div>

        <div className="form-control w-full">
          <label htmlFor="amount" className="label">
            <span className="label-text">Amount</span>
          </label>
          <input
            // eslint-disable-next-line jsx-a11y/no-autofocus
            autoFocus
            type="number"
            min={0}
            name="amount"
            id="amount"
            placeholder="Enter amount"
            className="input input-bordered input-primary"
            value={editedAmount}
            onChange={e => setEditedAmount(Number(e.target.value))}
          />
        </div>

        <div className="modal-action">
          <button
            className="btn btn-primary w-full"
            onClick={() => onSave({ ...wallet, amount: editedAmount, name: editedName })}
          >
            Save
          </button>
        </div>

        <button
          className="btn btn-circle btn-ghost btn-sm absolute right-2 top-2"
          onClick={onClose}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
            <path
              fill="currentColor"
              d="M12.0007 10.5865L16.9504 5.63672L18.3646 7.05093L13.4149 12.0007L18.3646 16.9504L16.9504 18.3646L12.0007 13.4149L7.05093 18.3646L5.63672 16.9504L10.5865 12.0007L5.63672 7.05093L7.05093 5.63672L12.0007 10.5865Z"
            ></path>
          </svg>
        </button>
      </div>
    </dialog>
  );
}
