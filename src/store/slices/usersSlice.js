import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { adminAPI } from '../../services/api';

const initialState = {
  users: [],
  userDetails: null,
  stats: null,

  totalPages: 0,
  currentPage: 1,
  totalUsers: 0,
  totalWalletBalance: 0,
  totalWithdrawals: 0,
  pendingWithdrawals: 0,

  listStatus: 'idle',
  detailsStatus: 'idle',
  statsStatus: 'idle',
  balanceUpdateStatus: 'idle',

  error: null,
  filters: {
    search: '',
    sortBy: 'createdAt',
    sortOrder: 'desc',
  },
};

const normalizeUser = (user = {}) => {
  const walletBalance = Number(user.walletBalance || 0);

  return {
    ...user,
    _id: user._id || user.id || '',
    id: user.id || user._id || '',
    walletBalance,
  };
};

const normalizeUserDetails = (payload = {}) => {
  const normalizedUser = normalizeUser(payload.user || {});
  const recentTransactions = Array.isArray(payload.recentTransactions)
    ? payload.recentTransactions
    : Array.isArray(payload.transactions)
      ? payload.transactions
      : [];

  const investments = Array.isArray(payload.investments) ? payload.investments : [];

  return {
    ...payload,
    user: normalizedUser,
    recentTransactions,
    investments,
    portfolioSummary: payload.portfolioSummary || {},
    investmentOrders: payload.investmentOrders || {
      pending: [],
      active: [],
      unlocked: [],
      completed: [],
      cancelled: [],
      all: [],
    },
  };
};

export const fetchUsers = createAsyncThunk(
  'users/fetchAll',
  async (
    { page = 1, limit = 20, search = '', sortBy = 'createdAt', sortOrder = 'desc' } = {},
    { rejectWithValue }
  ) => {
    try {
      const response = await adminAPI.getAllUsers({
        page,
        limit,
        search,
        sortBy,
        sortOrder,
      });

      const data = response?.data?.data;

      if (!data) {
        return rejectWithValue('No data received from server');
      }

      let withdrawalStats = {
        totalWithdrawals: 0,
        pendingAmount: 0,
      };

      try {
        const statsResponse = await adminAPI.getWithdrawalStats();
        withdrawalStats = statsResponse?.data?.data || withdrawalStats;
      } catch (error) {
        console.warn('Withdrawal stats fetch failed:', error?.message);
      }

      return {
        users: Array.isArray(data.users) ? data.users.map(normalizeUser) : [],
        totalPages: Number(data.totalPages || 0),
        currentPage: Number(data.currentPage || page),
        totalUsers: Number(data.totalUsers || 0),
        totalWalletBalance: Number(data.totalWalletBalance || 0),
        totalWithdrawals: Number(withdrawalStats.totalWithdrawals || 0),
        pendingWithdrawals: Number(withdrawalStats.pendingAmount || 0),
      };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch users');
    }
  }
);

export const fetchUserStats = createAsyncThunk(
  'users/fetchStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await adminAPI.getUserStats();
      return response?.data?.data || {};
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch stats');
    }
  }
);

export const fetchUserDetails = createAsyncThunk(
  'users/fetchDetails',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await adminAPI.getUserDetails(userId);
      return normalizeUserDetails(response?.data?.data || {});
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch user details');
    }
  }
);

export const updateUserBalance = createAsyncThunk(
  'users/updateBalance',
  async (data, { rejectWithValue }) => {
    try {
      const response = await adminAPI.updateUserBalance(data);
      return response?.data?.data || {};
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update balance');
    }
  }
);

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearError: (state) => {
      state.error = null;
    },
    clearUserDetails: (state) => {
      state.userDetails = null;
      state.detailsStatus = 'idle';
    },
    resetBalanceUpdateStatus: (state) => {
      state.balanceUpdateStatus = 'idle';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.listStatus = 'loading';
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.listStatus = 'succeeded';
        state.users = action.payload.users;
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.currentPage;
        state.totalUsers = action.payload.totalUsers;
        state.totalWalletBalance = action.payload.totalWalletBalance;
        state.totalWithdrawals = action.payload.totalWithdrawals;
        state.pendingWithdrawals = action.payload.pendingWithdrawals;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.listStatus = 'failed';
        state.error = action.payload;
        state.users = [];
      })

      .addCase(fetchUserStats.pending, (state) => {
        state.statsStatus = 'loading';
      })
      .addCase(fetchUserStats.fulfilled, (state, action) => {
        state.statsStatus = 'succeeded';
        state.stats = action.payload;
      })
      .addCase(fetchUserStats.rejected, (state, action) => {
        state.statsStatus = 'failed';
        state.error = action.payload;
      })

      .addCase(fetchUserDetails.pending, (state) => {
        state.detailsStatus = 'loading';
        state.error = null;
      })
      .addCase(fetchUserDetails.fulfilled, (state, action) => {
        state.detailsStatus = 'succeeded';
        state.userDetails = action.payload;
      })
      .addCase(fetchUserDetails.rejected, (state, action) => {
        state.detailsStatus = 'failed';
        state.error = action.payload;
      })

      .addCase(updateUserBalance.pending, (state) => {
        state.balanceUpdateStatus = 'loading';
        state.error = null;
      })
      .addCase(updateUserBalance.fulfilled, (state, action) => {
        state.balanceUpdateStatus = 'succeeded';

        const updatedUser = action.payload?.user || {};
        const userId = updatedUser._id || updatedUser.id;

        if (!userId) return;

        const newWalletBalance = Number(
          updatedUser.newWalletBalance ?? updatedUser.walletBalance ?? 0
        );

        const index = state.users.findIndex((u) => (u._id || u.id) === userId);

        if (index !== -1) {
          state.users[index].walletBalance = newWalletBalance;
        }

        if ((state.userDetails?.user?._id || state.userDetails?.user?.id) === userId) {
          state.userDetails.user.walletBalance = newWalletBalance;
        }
      })
      .addCase(updateUserBalance.rejected, (state, action) => {
        state.balanceUpdateStatus = 'failed';
        state.error = action.payload;
      });
  },
});

export const {
  setFilters,
  clearError,
  clearUserDetails,
  resetBalanceUpdateStatus,
} = usersSlice.actions;

export default usersSlice.reducer;