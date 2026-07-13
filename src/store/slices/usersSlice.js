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
  totalBonusBalance: 0,
  totalWithdrawals: 0,
  pendingWithdrawals: 0,
  grandTotal: 0,
  loading: false,
  detailsLoading: false,
  error: null,
  filters: {
    search: '',
    sortBy: 'createdAt',
    sortOrder: 'desc',
  },
};

// Fetch all users
export const fetchUsers = createAsyncThunk(
  'users/fetchAll',
  async (
    { page = 1, limit = 20, search = '', sortBy = 'createdAt', sortOrder = 'desc' },
    { rejectWithValue }
  ) => {
    try {
      console.log('🟢 Redux: Fetching users...');

      const response = await adminAPI.getAllUsers({
        page,
        limit,
        search,
        sortBy,
        sortOrder,
      });

      const data = response?.data?.data;

      if (!data) {
        console.error('❌ Redux: No data in response!', response?.data);
        return rejectWithValue('No data received from server');
      }

      console.log('✅ Redux: Users fetched:', data.users?.length || 0);

      let withdrawalStats = {
        totalWithdrawals: 0,
        pendingAmount: 0,
      };

      try {
        const statsResponse = await adminAPI.getWithdrawalStats();
        withdrawalStats = statsResponse?.data?.data || {
          totalWithdrawals: 0,
          pendingAmount: 0,
        };
        console.log('✅ Redux: Withdrawal stats:', withdrawalStats);
      } catch (error) {
        console.warn(
          '⚠️ Redux: Failed to fetch withdrawal stats, using defaults:',
          error.message
        );
      }

      return {
        ...data,
        totalWithdrawals: withdrawalStats.totalWithdrawals || 0,
        pendingWithdrawals: withdrawalStats.pendingAmount || 0,
      };
    } catch (error) {
      console.error('🔴 Redux: Error:', error);
      console.error('🔴 Redux: Error response:', error.response?.data);
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch users');
    }
  }
);

// Fetch user stats
export const fetchUserStats = createAsyncThunk(
  'users/fetchStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await adminAPI.getUserStats();
      return response?.data?.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch stats');
    }
  }
);

// Fetch user details
export const fetchUserDetails = createAsyncThunk(
  'users/fetchDetails',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await adminAPI.getUserDetails(userId);
      return response?.data?.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch user details');
    }
  }
);

// Update user balance
export const updateUserBalance = createAsyncThunk(
  'users/updateBalance',
  async (data, { rejectWithValue }) => {
    try {
      const response = await adminAPI.updateUserBalance(data);
      return response?.data?.data;
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
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        console.log('✅ Redux: Users state updated');
        state.loading = false;
        state.users = action.payload?.users || [];
        state.totalPages = action.payload?.totalPages || 0;
        state.currentPage = action.payload?.currentPage || 1;
        state.totalUsers = action.payload?.totalUsers || 0;
        state.totalWalletBalance = action.payload?.totalWalletBalance || 0;
        state.totalBonusBalance = action.payload?.totalBonusBalance || 0;
        state.grandTotal = action.payload?.grandTotal || 0;
        state.totalWithdrawals = action.payload?.totalWithdrawals || 0;
        state.pendingWithdrawals = action.payload?.pendingWithdrawals || 0;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        console.error('❌ Redux: Users fetch failed');
        state.loading = false;
        state.error = action.payload;
        state.users = [];
      })

      .addCase(fetchUserStats.fulfilled, (state, action) => {
        state.stats = action.payload;
      })

      .addCase(fetchUserDetails.pending, (state) => {
        state.detailsLoading = true;
        state.error = null;
      })
      .addCase(fetchUserDetails.fulfilled, (state, action) => {
        state.detailsLoading = false;
        state.userDetails = action.payload;
      })
      .addCase(fetchUserDetails.rejected, (state, action) => {
        state.detailsLoading = false;
        state.error = action.payload;
      })

      .addCase(updateUserBalance.fulfilled, (state, action) => {
        const updatedUser = action.payload?.user;

        if (!updatedUser?.id) return;

        const index = state.users.findIndex((u) => u._id === updatedUser.id);

        if (index !== -1) {
          state.users[index].walletBalance = updatedUser.newWalletBalance;
          state.users[index].totalBalance = updatedUser.newTotalBalance;
        }

        if (state.userDetails?.user?._id === updatedUser.id) {
          state.userDetails.user.walletBalance = updatedUser.newWalletBalance;
          state.userDetails.user.totalBalance = updatedUser.newTotalBalance;
        }
      });
  },
});

export const { setFilters, clearError, clearUserDetails } = usersSlice.actions;
export default usersSlice.reducer;