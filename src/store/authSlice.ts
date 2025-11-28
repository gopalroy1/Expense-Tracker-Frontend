import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthState {
  user: User | null;
}

// Load from localStorage on refresh
const initialState: AuthState = {
  user: localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user")!)
    : null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess: (
      state,
      action: PayloadAction<{ user: User }>
    ) => {
      state.user = action.payload.user;
    },

    setUser: (state, action: PayloadAction<User | null>) => {
      state.user = action.payload;
    },

    logout: (state) => {
      state.user = null;
    },
  },
});


// ✅ Export actions for components
export const { loginSuccess, logout,setUser } = authSlice.actions;

// ✅ Export reducer (this is the `authReducer`)
export default authSlice.reducer;
