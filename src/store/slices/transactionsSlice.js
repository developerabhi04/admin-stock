import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { adminAPI } from '../../services/api';

const initialState = {
  transactions: [],
  totalPages: 0,
  currentPage: 1,
  totalTransactions: 0,
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
  async ({ page = 1, limit = 50, status = '', category = '' }, { rejectWithValue }) => {
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
        state.transactions = action.payload.transactions;
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.currentPage;
        state.totalTransactions = action.payload.totalTransactions;
      })
      .addCase(fetchTransactions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setFilters, clearTransactionsError } = transactionsSlice.actions;
export default transactionsSlice.reducer;
