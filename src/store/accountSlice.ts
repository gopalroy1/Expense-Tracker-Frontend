// src/store/accountSlice.ts
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface AccountName {
  id: string;
  name: string;
  accountTypeId: string;
}

interface AccountType {
  id: string;
  type: string;
  userId: string;
  accountNames: AccountName[];
}

interface AccountState {
  accountTypes: AccountType[];
  loading: boolean;
}

const initialState: AccountState = {
  accountTypes: [],
  loading: false,
};

export const accountSlice = createSlice({
  name: "accounts",
  initialState,
  reducers: {
    setAccounts: (state, action: PayloadAction<AccountType[]>) => {
      state.accountTypes = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
  },
});

export const { setAccounts, setLoading } = accountSlice.actions;
export default accountSlice.reducer;
