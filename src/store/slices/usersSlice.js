import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { adminAPI } from '../../services/api';

const initialState = {
  users: [], // ✅ Initialize as empty array
  userDetails: null,
  stats: null,
  totalPages: 0,
  currentPage: 1,
  totalUsers: 0,
  totalWalletBalance: 0,
  totalBonusBalance: 0,
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
  async ({ page = 1, limit = 20, search = '', sortBy = 'createdAt', sortOrder = 'desc' }, { rejectWithValue }) => {
    try {
      // console.log('🟢 Redux: Fetching users...');
      const response = await adminAPI.getAllUsers({ page, limit, search, sortBy, sortOrder });
      
      // console.log('🟢 Redux: Full response:', response);
      // console.log('🟢 Redux: response.data:', response.data);
      // console.log('🟢 Redux: response.data.data:', response.data.data);
      
      // ✅ Extract data based on your ApiResponse structure
      const data = response.data.data;
      
      if (!data) {
        console.error('❌ Redux: No data in response!');
        return rejectWithValue('No data received from server');
      }
      
      // console.log('✅ Redux: Extracted data:', data);
      // console.log('✅ Redux: Users array:', data.users);
      // console.log('✅ Redux: Total users:', data.totalUsers);
      
      return data;
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
      return response.data.data;
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
      return response.data.data;
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
      return response.data.data;
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
      // Fetch users
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        console.log('✅ Users fetched successfully:', action.payload);
        state.loading = false;
        state.users = action.payload.users || []; // ✅ Ensure array
        state.totalPages = action.payload.totalPages || 0;
        state.currentPage = action.payload.currentPage || 1;
        state.totalUsers = action.payload.totalUsers || 0;
        state.totalWalletBalance = action.payload.totalWalletBalance || 0;
        state.totalBonusBalance = action.payload.totalBonusBalance || 0;
        state.grandTotal = action.payload.grandTotal || 0;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        console.error('❌ Users fetch failed:', action.payload);
        state.loading = false;
        state.error = action.payload;
        state.users = []; // ✅ Reset to empty array on error
      })
      
      // Fetch stats
      .addCase(fetchUserStats.fulfilled, (state, action) => {
        state.stats = action.payload;
      })
      
      // Fetch user details
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
      
      // Update balance
      .addCase(updateUserBalance.fulfilled, (state, action) => {
        const index = state.users.findIndex(u => u._id === action.payload.user.id);
        if (index !== -1) {
          state.users[index].walletBalance = action.payload.user.newWalletBalance;
          state.users[index].totalBalance = action.payload.user.newTotalBalance;
        }
      });
  },
});

export const { setFilters, clearError, clearUserDetails } = usersSlice.actions;
export default usersSlice.reducer;
