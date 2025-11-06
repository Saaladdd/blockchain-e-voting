"use client";

import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { evotingContractAddress, evotingContractABI } from "@/lib/contract-info";

const desiredChainId = "0x539"; // Hardhat = 1337 in hex
const rpcUrl = "http://127.0.0.1:8545";

interface EVotingHook {
  contract: ethers.Contract | null;
  readContract: ethers.Contract | null;
  signer: ethers.Signer | null;
  address: string | null;
  connect: () => Promise<void>;
}

export function useEVotingContract(): EVotingHook {
  const [contract, setContract] = useState<ethers.Contract | null>(null);
  const [readContract, setReadContract] = useState<ethers.Contract | null>(null);
  const [signer, setSigner] = useState<ethers.Signer | null>(null);
  const [address, setAddress] = useState<string | null>(null);

  const connect = async () => {
    if (!window.ethereum) {
      console.error("MetaMask not installed!");
      return;
    }

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();

      console.log("Connected wallet:", address);

      const writeContract = new ethers.Contract(
        evotingContractAddress,
        evotingContractABI,
        signer
      );

      // ✨ Read Contract — uses direct RPC (for eth_call stability)
      const rpcProvider = new ethers.JsonRpcProvider(rpcUrl);
      const readOnlyContract = new ethers.Contract(
        evotingContractAddress,
        evotingContractABI,
        rpcProvider
      );

      setSigner(signer);
      setAddress(address);
      setContract(writeContract);
      setReadContract(readOnlyContract);
    } catch (err) {
      console.error("Connection failed:", err);
    }
  };

  useEffect(() => {
    connect();

    const handleAccountsChanged = () => window.location.reload();
    const handleChainChanged = () => window.location.reload();

    window.ethereum?.on("accountsChanged", handleAccountsChanged);
    window.ethereum?.on("chainChanged", handleChainChanged);

    return () => {
      window.ethereum?.removeListener("accountsChanged", handleAccountsChanged);
      window.ethereum?.removeListener("chainChanged", handleChainChanged);
    };
  }, []);

  return { contract, readContract, signer, address, connect };
}
