import { APP_NAME } from "@/appConstants";
import type { Wallet } from "@/model/db";
import { WalletOperations } from "@/model/walletOps";
import { useState } from "react";
import { useLoaderData, useNavigate } from "react-router-dom";
import EditWalletModal from "./EditWalletModal";
import WalletCard from "./WalletCard";
import type { LoaderData } from "./walletLoader";

export default function AccountSetup() {
  const navigate = useNavigate();
  const loaderData = useLoaderData() as LoaderData;
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
    <main className="flex h-[100svh] flex-col gap-5 px-5 py-6">
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

      <button onClick={completeSetup} className="btn btn-primary mt-auto w-full">
        Complete
      </button>
    </main>
  );
}
