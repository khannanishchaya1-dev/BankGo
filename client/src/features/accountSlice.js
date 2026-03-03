import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = `${import.meta.env.VITE_BASE_API_URL}`;

/* ================= FETCH ACCOUNTS ================= */

export const fetchAccounts = createAsyncThunk(
  "account/fetchAccounts",
  async (_, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token;

      const response = await axios.get(
        `${API_URL}/api/auth/get-user-accounts`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data.account || [];
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch accounts"
      );
    }
  }
);

/* ================= CREATE ACCOUNT ================= */

export const createAccount = createAsyncThunk(
  "account/create",
  async (accountData, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token;

      const response = await axios.post(
        `${API_URL}/api/accounts/create`,
        accountData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // assuming backend returns { account: {...} }
      return response.data.account;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Account creation failed"
      );
    }
  }
);

/* ================= INITIAL STATE ================= */

const initialState = {
  accounts: [],
  activeAccount: null,
  loading: false,
  error: null,
};

/* ================= SLICE ================= */

const accountSlice = createSlice({
  name: "account",
  initialState,

  reducers: {
    setActiveAccount: (state, action) => {
      state.activeAccount = action.payload;
    },

    clearAccounts: (state) => {
      state.accounts = [];
      state.activeAccount = null;
      state.error = null;
    },

    updateBalance: (state, action) => {
      const { accountId, balance } = action.payload;

      const account = state.accounts.find(
        (acc) => acc._id === accountId
      );

      if (account) {
        account.balance = balance;

        if (state.activeAccount?._id === accountId) {
          state.activeAccount.balance = balance;
        }
      }
    },

    optimisticDebit: (state, action) => {
      const { accountId, amount } = action.payload;

      const account = state.accounts.find(
        (acc) => acc._id === accountId
      );

      if (account) {
        account.balance =
          Number(account.balance) - Number(amount);

        if (state.activeAccount?._id === accountId) {
          state.activeAccount.balance =
            Number(state.activeAccount.balance) -
            Number(amount);
        }
      }
    },

    rollbackDebit: (state, action) => {
      const { accountId, amount } = action.payload;

      const account = state.accounts.find(
        (acc) => acc._id === accountId
      );

      if (account) {
        account.balance =
          Number(account.balance) + Number(amount);

        if (state.activeAccount?._id === accountId) {
          state.activeAccount.balance =
            Number(state.activeAccount.balance) +
            Number(amount);
        }
      }
    },
  },   // 👈 CLOSE reducers here properly

  extraReducers: (builder) => {
    builder
      .addCase(fetchAccounts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAccounts.fulfilled, (state, action) => {
        state.loading = false;
        state.accounts = action.payload;
        state.activeAccount =
          action.payload.length > 0 ? action.payload[0] : null;
      })
      .addCase(fetchAccounts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(createAccount.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createAccount.fulfilled, (state, action) => {
        state.loading = false;

        if (action.payload) {
          state.accounts.push(action.payload);
          state.activeAccount = action.payload;
        }
      })
      .addCase(createAccount.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  setActiveAccount,
  clearAccounts,
  updateBalance,
  optimisticDebit,
  rollbackDebit,
} = accountSlice.actions;

export default accountSlice.reducer;