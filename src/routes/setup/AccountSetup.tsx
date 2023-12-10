import { APP_NAME } from "@/appConstants";
import { CategoryOperations } from "@/model/categoryOps";
import type { Wallet } from "@/model/schema";
import { useCallback, useState } from "react";
import { Form, useLoaderData, useNavigate } from "react-router-dom";
import EditWalletModal from "./EditWalletModal";
import WalletCard from "./WalletCard";
import defaultCategories from "./default-categories";
import type { LoaderData } from "./walletLoader";

export default function AccountSetup() {
  const navigate = useNavigate();
  const loaderData = useLoaderData() as LoaderData;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentWallet, setCurrentWallet] = useState<Wallet | null>(null);

  const handleClose = useCallback(() => {
    setCurrentWallet(null);
    setIsModalOpen(false);
  }, []);

  const handleEdit = useCallback<(editedWallet: Wallet) => void>(editedWallet => {
    setCurrentWallet(editedWallet);
    setIsModalOpen(true);
  }, []);

  async function completeSetup() {
    await CategoryOperations.bulkAdd(defaultCategories);
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
          {loaderData.wallets.map(wallet => (
            <WalletCard key={wallet.id} wallet={wallet} onEdit={handleEdit} />
          ))}
        </div>

        {currentWallet && (
          <EditWalletModal isOpen={isModalOpen} onClose={handleClose} wallet={currentWallet} />
        )}

        {!!loaderData.defaultWallets.length && (
          <>
            <h1 className="text-lg">Suggestions</h1>
            <Form method="post">
              <div className="flex flex-row flex-wrap gap-3">
                {loaderData.defaultWallets.map(wallet => (
                  <button
                    key={wallet.name}
                    type="submit"
                    name="wallet"
                    value={wallet.name}
                    className="btn btn-neutral btn-outline"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      width="20"
                      height="20"
                    >
                      <path
                        d="M11 11V5H13V11H19V13H13V19H11V13H5V11H11Z"
                        fill="currentColor"
                      ></path>
                    </svg>
                    {wallet.name}
                  </button>
                ))}
              </div>
            </Form>
          </>
        )}
      </section>

      <button onClick={() => void completeSetup()} className="btn btn-primary mt-auto w-full">
        Complete
      </button>
    </main>
  );
}
