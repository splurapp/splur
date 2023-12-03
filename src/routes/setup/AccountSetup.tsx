import { APP_NAME } from "@/appConstants";
import type { Wallet } from "@/model/db";
import { WalletOperations } from "@/model/walletOps";
import type { AsyncReturnType } from "@/types/utils";
import { useState } from "react";
import { useLoaderData, useNavigate } from "react-router-dom";
import type { loader } from "./walletLoader";

interface EditWalletModalProps {
  wallet: Wallet;
  isOpen: boolean;
  onSave: (editedWallet: Wallet) => void;
  onClose: () => void;
}

function EditWalletModal({ isOpen, onSave, wallet, onClose }: EditWalletModalProps) {
  const [editedName, setEditedName] = useState(wallet.name);
  const [editedAmount, setEditedAmount] = useState(wallet.amount);

  return (
    <dialog id="edit-wallet-modal" className="modal modal-bottom" open={isOpen}>
      <div className="modal-box border-2 border-primary">
        <h1 className="text-lg">Edit Wallet</h1>

        <div className="form-control w-full">
          <label className="label">
            <span className="label-text">Name</span>
          </label>
          <input
            autoFocus
            type="text"
            placeholder="your wallet name"
            className="input input-bordered input-primary"
            value={editedName}
            onChange={e => setEditedName(e.target.value)}
          />
        </div>

        <div className="form-control w-full">
          <label className="label">
            <span className="label-text">Amount</span>
          </label>
          <input
            type="number"
            placeholder="wallet amount"
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

function WalletCard({ wallet, onEdit }: { wallet: Wallet; onEdit: (wallet: Wallet) => void }) {
  return (
    <>
      <div className="card join-item bg-primary text-primary-content">
        <div className="card-body flex-row justify-between">
          <div>
            <h2 className="card-title">{wallet.name}</h2>
            <p>{wallet.amount.toLocaleString("en-IN", { style: "currency", currency: "INR" })}</p>
          </div>
          <button className="btn btn-circle btn-ghost" onClick={() => onEdit(wallet)}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
              <path
                fill="currentColor"
                d="M12.8995 6.85431L17.1421 11.0969L7.24264 20.9964H3V16.7538L12.8995 6.85431ZM14.3137 5.44009L16.435 3.31877C16.8256 2.92825 17.4587 2.92825 17.8492 3.31877L20.6777 6.1472C21.0682 6.53772 21.0682 7.17089 20.6777 7.56141L18.5563 9.68273L14.3137 5.44009Z"
              ></path>
            </svg>
          </button>
        </div>
      </div>
    </>
  );
}

export default function AccountSetup() {
  const navigate = useNavigate();
  const loaderData = useLoaderData() as AsyncReturnType<typeof loader>;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [wallets, setWallets] = useState<Wallet[]>(loaderData.wallets);
  const [defaultWallets, setDefaultWallets] = useState<Wallet[]>(loaderData.defaultWallets);
  const [currentWallet, setCurrentWallet] = useState<Wallet | null>(null);

  async function createWallet(newWallet: Wallet) {
    const res = await WalletOperations.create(newWallet); // TODO: error handle
    if (!res) return;
    setDefaultWallets(prevWallets => prevWallets.filter(wallet => wallet.name !== newWallet.name));
    setWallets([...wallets, res]);
  }

  function handleEdit(editWallet: Wallet) {
    setCurrentWallet(editWallet);
    setIsModalOpen(true);
  }

  async function handleUpdate(updatedWallet: Wallet) {
    const res = await WalletOperations.edit(updatedWallet); // TODO: make these updates adjustments, instead of creating transactions maybe??
    if (!res) return;
    setWallets(prevWallets =>
      prevWallets.map(wallet => (wallet.id == updatedWallet.id ? updatedWallet : wallet)),
    ); // TODO: use returned updated wallet to replace
    setCurrentWallet(null);
    setIsModalOpen(false);
  }

  function completeSetup() {
    localStorage.setItem(APP_NAME + "__initialSetupCompleted", "true");
    navigate("/");
  }

  return (
    <main className="flex h-[100dvh] flex-col gap-5 px-5 py-6">
      <section>
        <h1 className="text-4xl font-medium">Let's setup your account!</h1>
        <p>Account can be your bank, credit card or your wallet</p>
      </section>

      <section className="flex flex-col gap-2">
        <div className="join join-vertical gap-1">
          {wallets.map(wallet => (
            <WalletCard key={wallet.id} wallet={wallet} onEdit={handleEdit} />
          ))}
        </div>

        {currentWallet && (
          <EditWalletModal
            isOpen={isModalOpen}
            onSave={editedWallet => void handleUpdate(editedWallet)}
            onClose={() => {
              setCurrentWallet(null);
              setIsModalOpen(false);
            }}
            wallet={currentWallet}
          />
        )}

        {!!defaultWallets?.length && (
          <>
            <h1 className="text-lg">Suggestions</h1>
            <div className="flex flex-row flex-wrap gap-3">
              {defaultWallets.map(wallet => (
                <button
                  key={wallet.name}
                  className="btn btn-neutral btn-outline"
                  onClick={() => void createWallet(wallet)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    width="20"
                    height="20"
                  >
                    <path d="M11 11V5H13V11H19V13H13V19H11V13H5V11H11Z" fill="currentColor"></path>
                  </svg>
                  {wallet.name}
                </button>
              ))}
            </div>
          </>
        )}
      </section>

      <section className="join join-vertical mt-auto">
        <button onClick={completeSetup} className="btn btn-primary join-item w-full">
          Complete
        </button>
      </section>
    </main>
  );
}
