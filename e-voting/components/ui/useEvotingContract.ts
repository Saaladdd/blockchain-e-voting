"use client";

import { useState, useEffect } from "react";
import { ethers, BrowserProvider, Signer, Contract } from "ethers";
import { evotingContractAddress, evotingContractABI } from "@/lib/contract-info";

// Desired network
const desiredChainId = "0x539"; // 1337 in hex

const hardhatNetwork = {
  chainId: desiredChainId,
  chainName: "Localhost 1337",
  nativeCurrency: {
    name: "ETH",
    symbol: "ETH",
    decimals: 18,
  },
  rpcUrls: ["http://127.0.0.1:8545"],
};

interface EVotingHook {
  contract: Contract | null;
  signer: Signer | null;
  address: string | null;
  connect: () => Promise<void>;
}

export function useEVotingContract(): EVotingHook {
  const [contract, setContract] = useState<Contract | null>(null);
  const [signer, setSigner] = useState<Signer | null>(null);
  const [address, setAddress] = useState<string | null>(null);

  const connect = async () => {
    if (typeof window.ethereum === "undefined") {
      console.error("MetaMask not installed!");
      return;
    }

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);

      // Request account connection
      await provider.send("eth_requestAccounts", []);

  
      
      // Get signer
      const signer = await provider.getSigner();
      const userAddress = await signer.getAddress();
      console.log("Connected signer:", signer);
      console.log("Connected address:", userAddress);

      // Create contract instance
      const contractInstance = new ethers.Contract(
        evotingContractAddress,
        evotingContractABI,
        signer
      );

      setSigner(signer);
      setContract(contractInstance);
      setAddress(userAddress);
    } catch (err: any) {
      console.error("Connection failed:", err);
    }
  };

  useEffect(() => {
    connect();

    // Reload if accounts or network changes
    const handleAccountsChanged = () => window.location.reload();
    const handleChainChanged = () => window.location.reload();

    window.ethereum?.on("accountsChanged", handleAccountsChanged);
    window.ethereum?.on("chainChanged", handleChainChanged);

    return () => {
      window.ethereum?.removeListener("accountsChanged", handleAccountsChanged);
      window.ethereum?.removeListener("chainChanged", handleChainChanged);
    };
  }, []);

  return { contract, signer, address, connect };
}
