"use client";

import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/app/store";
import { connect, disconnect } from "@/app/store/walletSlice";
import { ethers } from "ethers";

export default function WalletConnectButton() {
  const dispatch = useDispatch();
  const { account, connected } = useSelector((state: RootState) => state.wallet);

  const handleConnect = async () => {
    if (typeof window.ethereum === "undefined") {
      alert("MetaMask not found!");
      return;
    }

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.send("eth_requestAccounts", []);
      dispatch(connect(accounts[0]));
    } catch (err) {
      console.error(err);
    }
  };

  const handleDisconnect = () => {
    dispatch(disconnect());
  };

  return (
    <button
      onClick={connected ? handleDisconnect : handleConnect}
      className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
    >
      {connected ? `Disconnect (${account?.slice(0, 6)}...)` : "Connect Wallet"}
    </button>
  );
}
