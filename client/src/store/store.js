import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/authSlice";
import accountReducer from "../features/accountSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    account: accountReducer,
  },
});