"use client";

import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/app/store";
import { connect, disconnect } from "@/app/store/walletSlice";

declare global {
  interface Window {
    ethereum?: any;
  }
}

export function WalletConnect() {
  const dispatch = useDispatch();
  const { account, connected } = useSelector((state: RootState) => state.wallet);

  const handleConnect = async () => {
    if (!window.ethereum) {
      alert("MetaMask not found!");
      return;
    }
    try {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      dispatch(connect(accounts[0]));
    } catch (err) {
      console.error("Wallet connection failed", err);
    }
  };

  const handleDisconnect = () => {
    dispatch(disconnect());
  };

  return (
    <div className="p-2">
      {connected ? (
        <div className="flex items-center gap-2">
          <span className="font-mono text-sm">
            {account?.slice(0, 6)}...{account?.slice(-4)}
          </span>
          <button
            onClick={handleDisconnect}
            className="px-3 py-1 rounded-xl bg-red-500 text-white hover:bg-red-600"
          >
            Disconnect
          </button>
        </div>
      ) : (
        <button
          onClick={handleConnect}
          className="px-3 py-1 rounded-xl bg-green-500 text-white hover:bg-green-600"
        >
          Connect Wallet
        </button>
      )}
    </div>
  );
}