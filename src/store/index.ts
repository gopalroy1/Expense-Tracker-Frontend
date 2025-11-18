import { configureStore } from "@reduxjs/toolkit";
import accountReducer from "./accountSlice";
import authReducer from "./authSlice";


export const store = configureStore({
  reducer: {
    auth: authReducer,
    account: accountReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
