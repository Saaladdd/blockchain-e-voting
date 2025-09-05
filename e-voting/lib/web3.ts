import { ethers } from "ethers";
import { AppDispatch } from "@/app/store";
import { setProvider, setChainId, setAccount } from "@/app/store/web3Slice";

// Load Ethereum provider
export const loadProvider = (dispatch: AppDispatch) => {
  if (typeof window !== "undefined" && (window as any).ethereum) {
    const provider = new ethers.BrowserProvider((window as any).ethereum);
    dispatch(setProvider(provider));
    return provider;
  } else {
    console.error("No Ethereum wallet detected. Install MetaMask.");
    return null;
  }
};

// Detect network
export const loadNetwork = async (provider: ethers.BrowserProvider | null, dispatch: AppDispatch) => {
  if (!provider) return null;
  try {
    const network = await provider.getNetwork();
    const chainId = Number(network.chainId.toString());
    dispatch(setChainId(chainId));
    return chainId;
  } catch (error) {
    console.error("Failed to load network:", error);
    return null;
  }
};

// Connect wallet
export const connectWallet = async (dispatch: AppDispatch) => {
  if (typeof window !== "undefined" && (window as any).ethereum) {
    try {
      const accounts = await (window as any).ethereum.request({
        method: "eth_requestAccounts",
      });
      const account = ethers.getAddress(accounts[0]);
      dispatch(setAccount(account));
      return account;
    } catch (error) {
      console.error("Wallet connection failed:", error);
      return null;
    }
  } else {
    console.error("MetaMask not installed.");
    return null;
  }
};
