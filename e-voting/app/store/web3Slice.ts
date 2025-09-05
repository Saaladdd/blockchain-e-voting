import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ethers } from "ethers";

interface Web3State {
  provider: ethers.BrowserProvider | null;
  chainId: number | null;
  account: string | null;
}

const initialState: Web3State = {
  provider: null,
  chainId: null,
  account: null,
};

const web3Slice = createSlice({
  name: "web3",
  initialState,
  reducers: {
    setProvider: (state, action: PayloadAction<ethers.BrowserProvider>) => {
      state.provider = action.payload;
    },
    setChainId: (state, action: PayloadAction<number>) => {
      state.chainId = action.payload;
    },
    setAccount: (state, action: PayloadAction<string>) => {
      state.account = action.payload;
    },
  },
});

export const { setProvider, setChainId, setAccount } = web3Slice.actions;
export default web3Slice.reducer;
