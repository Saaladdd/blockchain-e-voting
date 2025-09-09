"use client";

import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/app/store";
import { connect, disconnect } from "@/app/store/walletSlice";
import { useState } from "react";

declare global {
  interface Window {
    ethereum?: any;
  }
}

export function WalletConnect() {
  const dispatch = useDispatch();
  const { account, connected } = useSelector((state: RootState) => state.wallet);
  const [isConnecting, setIsConnecting] = useState(false);

  const handleConnect = async () => {
    setIsConnecting(true);
    if (!window.ethereum) {
      // fallback mock connection
      console.warn("MetaMask not found. Using mock wallet connection...");
      await new Promise((resolve) => setTimeout(resolve, 2000)); // mock delay
      const mockAccount = "0x1234...abcd";
      dispatch(connect(mockAccount));
      setIsConnecting(false);
      return;
    }

    try {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      dispatch(connect(accounts[0]));
    } catch (err) {
      console.error("Wallet connection failed", err);
    } finally {
      setIsConnecting(false);
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
          disabled={isConnecting}
          className={`px-3 py-1 rounded-xl text-white ${
            isConnecting
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-green-500 hover:bg-green-600"
          }`}
        >
          {isConnecting ? "Connecting..." : "Connect Wallet"}
        </button>
      )}
    </div>
  );
}
