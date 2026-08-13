import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { adminAPI } from '../../services/api';

const initialState = {
  transactions: [],
  totalPages: 0,
  currentPage: 1,
  totalTransactions: 0,
  limit: 20,
  filters: {
    status: '',
    category: '',
  },
  loading: false,
  error: null,
};

// Fetch all transactions
export const fetchTransactions = createAsyncThunk(
  'transactions/fetchAll',
  async ({ page = 1, limit = 20, status = '', category = '' }, { rejectWithValue }) => {
    try {
      const params = { page, limit };
      if (status) params.status = status;
      if (category) params.category = category;

      const response = await adminAPI.getAllTransactions(params);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch transactions'
      );
    }
  }
);

const transactionsSlice = createSlice({
  name: 'transactions',
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
      // Reset to first page whenever filters change
      state.currentPage = 1;
    },
    setPage: (state, action) => {
      state.currentPage = action.payload;
    },
    setLimit: (state, action) => {
      state.limit = action.payload;
      state.currentPage = 1;
    },
    clearTransactionsError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTransactions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTransactions.fulfilled, (state, action) => {
        state.loading = false;
        state.transactions = action.payload.transactions || [];
        state.totalPages = Number(action.payload.totalPages || 0);
        state.currentPage = Number(action.payload.currentPage || 1);
        state.totalTransactions = Number(action.payload.totalTransactions || 0);
      })
      .addCase(fetchTransactions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.transactions = [];
      });
  },
});

export const { setFilters, setPage, setLimit, clearTransactionsError } = transactionsSlice.actions;
export default transactionsSlice.reducer;