import { Wallet } from "@/model/db";
import { WalletOperations } from "@/model/walletOps";
import { useState } from "react";

type EditWalletProps = {
  info: Wallet;
  refresh: () => Promise<void>;
};

const EditWallet: React.FC<EditWalletProps> = ({ info, refresh }) => {
  const [show, setShow] = useState(false);
  const [walletName, setWalletName] = useState(() => info.name);
  const [walletAmount, setWalletAmount] = useState(() => info.amount);

  const editWallet = async () => {
    await WalletOperations.edit({ ...info, name: walletName, amount: walletAmount });
    await refresh();
    setShow(false);
    setWalletName(info.name);
    setWalletAmount(info.amount);
  };

  return (
    <div>
      {!show && (
        <button className="btn" onClick={() => setShow(!show)}>
          Edit Wallet - {info.name}
        </button>
      )}
      {show && (
        <div>
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
            onChange={e => setWalletAmount(parseInt(e.target.value))}
          ></input>
          <br></br>
          <button className="btn" onClick={() => setShow(!show)}>
            Cancel
          </button>
          <button className="btn btn-primary" onClick={editWallet}>
            Edit
          </button>
        </div>
      )}
    </div>
  );
};

export default EditWallet;
