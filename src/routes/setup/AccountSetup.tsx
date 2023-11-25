import { Wallet, WalletType } from "@/model/db";
import { WalletOperations } from "@/model/walletOps";
import { useEffect, useState } from "react";

type EditWalletModalProps = {
  wallet: Wallet;
  isOpen: boolean;
  onSave: (editedWallet: Wallet) => void;
};

function EditWalletModal({ isOpen, onSave, wallet }: EditWalletModalProps) {
  const [editedName, setEditedName] = useState(wallet.name);
  const [editedAmount, setEditedAmount] = useState(wallet.amount);

  return (
    <dialog id="edit-wallet-modal" className="modal" open={isOpen}>
      <div className="modal-box border-2 border-primary">
        <h1 className="text-lg">Edit Wallet</h1>
        <div className="form-control w-full max-w-xs">
          <label className="label">
            <span className="label-text">Name</span>
          </label>
          <input
            type="text"
            placeholder="your wallet name"
            className="input input-bordered input-primary w-full max-w-xs"
            value={editedName}
            onChange={e => setEditedName(e.target.value)}
          />
        </div>
        <div className="form-control w-full max-w-xs">
          <label className="label">
            <span className="label-text">Amount</span>
          </label>
          <input
            type="number"
            placeholder="wallet amount"
            className="input input-bordered input-primary w-full max-w-xs"
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
      </div>
    </dialog>
  );
}

function WalletCard({ wallet, onEdit }: { wallet: Wallet; onEdit: (wallet: Wallet) => void }) {
  return (
    <>
      <div className="card card-compact text-primary-content bg-primary join-item">
        <div className="card-body flex-row justify-between">
          <div>
            <h2 className="card-title">{wallet.name}</h2>
            <p>{wallet.amount.toLocaleString("en-IN", { style: "currency", currency: "INR" })}</p>
          </div>
          <button className="btn btn-circle btn-ghost" onClick={() => onEdit(wallet)}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
              <path d="M12.8995 6.85431L17.1421 11.0969L7.24264 20.9964H3V16.7538L12.8995 6.85431ZM14.3137 5.44009L16.435 3.31877C16.8256 2.92825 17.4587 2.92825 17.8492 3.31877L20.6777 6.1472C21.0682 6.53772 21.0682 7.17089 20.6777 7.56141L18.5563 9.68273L14.3137 5.44009Z"></path>
            </svg>
          </button>
        </div>
      </div>
    </>
  );
}

const DEFAULT_WALLETS: Wallet[] = [
  {
    name: "Bank",
    type: WalletType.BANK,
    amount: 0,
  },
  {
    name: "Credit Card",
    type: WalletType.CREDITCARD,
    amount: 0,
  },
  {
    name: "Cash",
    type: WalletType.CASH,
    amount: 0,
  },
];

export default function AccountSetup() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [defaultWallets, setDefaultWallets] = useState<Wallet[] | null>(null);
  const [currentWallet, setCurrentWallet] = useState<Wallet | null>(null);

  async function createWallet(newWallet: Wallet) {
    const res = await WalletOperations.create(newWallet); // TODO: error handle
    if (!res) return;
    setDefaultWallets(prevWallets => prevWallets!.filter(wallet => wallet.name !== newWallet.name));
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

  useEffect(() => {
    (async () => {
      const wallets = await WalletOperations.get();
      if (!!wallets?.length) {
        setWallets(wallets);
        setDefaultWallets(null);
      } else {
        setDefaultWallets(DEFAULT_WALLETS);
      }
    })();
  }, []);

  return (
    <main className="p-3 flex flex-col gap-5 h-screen py-6 px-5">
      <section>
        <h1 className="text-4xl font-medium">Let's setup your account!</h1>
        <p>Account can be your bank, credit card or your wallet</p>
      </section>

      <section className="flex flex-col gap-2">
        <div className="join join-vertical w-full gap-1">
          {wallets.map(wallet => (
            <WalletCard key={wallet.id} wallet={wallet} onEdit={handleEdit} />
          ))}
        </div>
        {currentWallet && (
          <EditWalletModal isOpen={isModalOpen} onSave={handleUpdate} wallet={currentWallet} />
        )}

        {!!defaultWallets?.length && (
          <>
            <h1 className="text-xl">Suggestions</h1>
            <div className="flex flex-row flex-wrap gap-3">
              {defaultWallets.map(wallet => (
                <button
                  key={wallet.name}
                  className="btn btn-neutral btn-outline"
                  onClick={() => createWallet(wallet)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    width="20"
                    height="20"
                  >
                    <path
                      d="M11 11V5H13V11H19V13H13V19H11V13H5V11H11Z"
                      fill="rgba(255,255,255,1)"
                    ></path>
                  </svg>
                  {wallet.name}
                </button>
              ))}
            </div>
          </>
        )}
      </section>

      <section className="mt-auto join join-vertical">
        <button className="btn btn-primary w-full join-item">Next</button>
      </section>
    </main>
  );
}
