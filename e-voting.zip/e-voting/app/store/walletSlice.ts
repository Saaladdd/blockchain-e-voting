import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface WalletState {
  account: string | null;
  connected: boolean;
}

const initialState: WalletState = {
  account: null,
  connected: false,
};

const walletSlice = createSlice({
  name: "wallet",
  initialState,
  reducers: {
    connect: (state, action: PayloadAction<string>) => {
      state.account = action.payload;
      state.connected = true;
    },
    disconnect: (state) => {
      state.account = null;
      state.connected = false;
    },
  },
});

export const { connect, disconnect } = walletSlice.actions;
export default walletSlice.reducer;
