import { APP_NAME } from "@/appConstants";
import { CategoryOperations } from "@/model/categoryOps";
import type { Wallet } from "@/model/schema";
import { Button } from "@nextui-org/react";
import { useCallback, useState } from "react";
import { Form, useLoaderData, useNavigate } from "react-router-dom";
import EditWalletModal from "./EditWalletModal";
import SuggestionsChip from "./SuggestionsChip";
import WalletCard from "./WalletCard";
import type { LoaderData } from "./account-setup.service";
import defaultCategories from "./default-categories";

export default function AccountSetup() {
  const navigate = useNavigate();
  const loaderData = useLoaderData() as LoaderData;
  const [walletToEdit, setWalletToEdit] = useState<Wallet | null>(null);

  const handleClose = useCallback(() => setWalletToEdit(null), []);

  const handleEdit = useCallback<(wallet: Wallet) => void>(wallet => {
    setWalletToEdit(wallet);
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
        <div className="space-y-2">
          {loaderData.wallets.map(wallet => (
            <WalletCard key={wallet.id} wallet={wallet} onEdit={handleEdit} />
          ))}
        </div>

        <EditWalletModal onClose={handleClose} wallet={walletToEdit} />

        {!!loaderData.defaultWallets.length && (
          <>
            <h1 className="text-lg">Suggestions</h1>
            <Form method="post">
              <div className="flex flex-row flex-wrap gap-3">
                {loaderData.defaultWallets.map(wallet => (
                  <SuggestionsChip key={wallet.name} walletName={wallet.name} />
                ))}
              </div>
            </Form>
          </>
        )}
      </section>

      <Button
        color="primary"
        size="lg"
        variant="shadow"
        onClick={() => void completeSetup()}
        className="mt-auto"
      >
        Complete
      </Button>
    </main>
  );
}
