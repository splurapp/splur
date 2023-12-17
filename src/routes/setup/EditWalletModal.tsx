import type { Wallet } from "@/model/schema";
import { useEffect } from "react";
import { useFetcher } from "react-router-dom";

interface EditWalletModalProps {
  wallet: Wallet | null;
  onClose: () => void;
}

export default function EditWalletModal({ wallet, onClose }: EditWalletModalProps) {
  const fetcher = useFetcher();

  useEffect(() => {
    if (fetcher.state === "idle" && fetcher.data) {
      onClose();
    }
  }, [fetcher.data, fetcher.state, onClose]);

  return (
    <dialog open={!!wallet} id="edit-wallet-modal" className="modal modal-bottom">
      <div className="modal-box border-2 border-primary">
        {wallet ? (
          <>
            <h1 className="text-lg">Edit Wallet</h1>
            <fetcher.Form method="put">
              <div className="form-control w-full">
                <label htmlFor="name" className="label">
                  <span className="label-text">Name</span>
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  placeholder="Enter wallet name"
                  className="input input-bordered input-primary"
                  defaultValue={wallet.name}
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
                  defaultValue={wallet.amount}
                />
              </div>

              <input type="hidden" name="id" value={wallet.id} />
              <input type="hidden" name="type" value={wallet.type} />

              <div className="modal-action">
                <button type="submit" className="btn btn-primary w-full">
                  Save
                </button>
              </div>
            </fetcher.Form>

            <button
              type="button"
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
          </>
        ) : null}
      </div>
    </dialog>
  );
}
