import { Wallet, WalletType } from "@/model/db";
import { WalletOperations } from "@/model/walletOps";
import { useState } from "react";
import EditWallet from "./EditWallet";
import Loan from "./Loan";
import Transactions from "./Transactions";

export default function Dev() {
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [walletName, setWalletName] = useState("");
  const [walletAmount, setWalletAmount] = useState(0);

  const refreshWallet = async () => {
    const retWallets = await WalletOperations.get();
    setWallets(retWallets);
  };

  const createWallet = async () => {
    const myWallet: Wallet = {
      name: walletName,
      type: WalletType.BANK,
      amount: walletAmount,
    };
    await WalletOperations.create(myWallet);
    await refreshWallet();
  };

  const deleteWallet = async (id: number | undefined) => {
    if (id) {
      await WalletOperations.remove(id);
      await refreshWallet();
    }
  };
  return (
    <div>
      <h1>/dev</h1>
      <hr></hr>

      <div>
        <h2>
          Wallets{" "}
          <button className="btn btn-primary" onClick={() => void refreshWallet()}>
            Refresh
          </button>
        </h2>
        {wallets.length === 0 && <div>No wallets</div>}
        {wallets.map((item, index) => (
          <div key={index}>
            <div>
              ID :: <strong>{item.id}</strong>
            </div>
            <div>
              Name :: <strong>{item.name}</strong>
            </div>
            <div>
              Amount :: <strong>{item.amount}</strong>
            </div>
            <button className="btn" onClick={() => void deleteWallet(item.id)}>
              Delete
            </button>
            <EditWallet info={item} refresh={refreshWallet} />
            <Transactions wallet={item} refresh={refreshWallet} />
          </div>
        ))}
      </div>
      <hr></hr>
      <h1>Create Wallet</h1>
      <input
        type="text"
        placeholder="wallet name"
        value={walletName}
        onChange={e => setWalletName(e.target.value)}
      ></input>
      <br></br>
      <input
        type="number"
        placeholder="initial amount"
        value={walletAmount}
        onChange={e => setWalletAmount(parseFloat(e.target.value))}
      ></input>
      <br></br>
      <br></br>
      <button className="btn btn-primary" onClick={() => void createWallet()}>
        Create Wallet
      </button>
      <Loan />
    </div>
  );
}
