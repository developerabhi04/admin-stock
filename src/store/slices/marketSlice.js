import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { adminAPI } from '../../services/api';



const initialState = {
    // Stocks
    stocks: [],
    stockDetails: null,
    totalStocks: 0,

    // Indices
    indices: [],
    indexDetails: null,
    totalIndices: 0,

    // Loading states
    loading: false,
    actionLoading: false,
    error: null,

    // Filters
    filters: {
        category: '',
        featured: '',
        search: '',
    },
};

// ============ STOCKS ============

// Fetch all stocks
export const fetchStocks = createAsyncThunk(
    'market/fetchStocks',
    async ({ page = 1, limit = 50, category = '', featured = '', search = '' }, { rejectWithValue }) => {
        try {
            const params = { page, limit };
            if (category) params.category = category;
            if (featured !== '') params.featured = featured;
            if (search) params.search = search;

            const response = await adminAPI.getAllStocks(params);
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch stocks');
        }
    }
);

// Create stock
export const createStock = createAsyncThunk(
    'market/createStock',
    async (stockData, { rejectWithValue }) => {
        try {
            const response = await adminAPI.createStock(stockData);
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to create stock');
        }
    }
);

// Update stock
export const updateStock = createAsyncThunk(
    'market/updateStock',
    async ({ stockId, data }, { rejectWithValue }) => {
        try {
            const response = await adminAPI.updateStock(stockId, data);
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to update stock');
        }
    }
);

// Delete stock
export const deleteStock = createAsyncThunk(
    'market/deleteStock',
    async (stockId, { rejectWithValue }) => {
        try {
            await adminAPI.deleteStock(stockId);
            return stockId;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to delete stock');
        }
    }
);

// ============ INDICES ============

// Fetch all indices
export const fetchIndices = createAsyncThunk(
    'market/fetchIndices',
    async ({ page = 1, limit = 50, category = '', featured = '', search = '' }, { rejectWithValue }) => {
        try {
            const params = { page, limit };
            if (category) params.category = category;
            if (featured !== '') params.featured = featured;
            if (search) params.search = search;

            const response = await adminAPI.getAllIndices(params);
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch indices');
        }
    }
);

// Create index
export const createIndex = createAsyncThunk(
    'market/createIndex',
    async (indexData, { rejectWithValue }) => {
        try {
            const response = await adminAPI.createIndex(indexData);
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to create index');
        }
    }
);

// Update index
export const updateIndex = createAsyncThunk(
    'market/updateIndex',
    async ({ indexId, data }, { rejectWithValue }) => {
        try {
            const response = await adminAPI.updateIndex(indexId, data);
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to update index');
        }
    }
);

// Delete index
export const deleteIndex = createAsyncThunk(
    'market/deleteIndex',
    async (indexId, { rejectWithValue }) => {
        try {
            await adminAPI.deleteIndex(indexId);
            return indexId;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to delete index');
        }
    }
);

const marketSlice = createSlice({
    name: 'market',
    initialState,
    reducers: {
        setFilters: (state, action) => {
            state.filters = { ...state.filters, ...action.payload };
        },
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch stocks
            .addCase(fetchStocks.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchStocks.fulfilled, (state, action) => {
                state.loading = false;
                state.stocks = action.payload.stocks || [];
                state.totalStocks = action.payload.total || 0;
            })
            .addCase(fetchStocks.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Create stock
            .addCase(createStock.pending, (state) => {
                state.actionLoading = true;
            })
            .addCase(createStock.fulfilled, (state, action) => {
                state.actionLoading = false;
                state.stocks.unshift(action.payload.stock);
                state.totalStocks += 1;
            })
            .addCase(createStock.rejected, (state, action) => {
                state.actionLoading = false;
                state.error = action.payload;
            })

            // Update stock
            .addCase(updateStock.fulfilled, (state, action) => {
                const index = state.stocks.findIndex(s => s._id === action.payload.stock._id);
                if (index !== -1) {
                    state.stocks[index] = action.payload.stock;
                }
            })

            // Delete stock
            .addCase(deleteStock.fulfilled, (state, action) => {
                state.stocks = state.stocks.filter(s => s._id !== action.payload);
                state.totalStocks -= 1;
            })

            // Fetch indices
            .addCase(fetchIndices.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchIndices.fulfilled, (state, action) => {
                state.loading = false;
                state.indices = action.payload.indices || [];
                state.totalIndices = action.payload.total || 0;
            })
            .addCase(fetchIndices.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Create index
            .addCase(createIndex.pending, (state) => {
                state.actionLoading = true;
            })
            .addCase(createIndex.fulfilled, (state, action) => {
                state.actionLoading = false;
                state.indices.unshift(action.payload.index);
                state.totalIndices += 1;
            })
            .addCase(createIndex.rejected, (state, action) => {
                state.actionLoading = false;
                state.error = action.payload;
            })

            // Update index
            .addCase(updateIndex.fulfilled, (state, action) => {
                const index = state.indices.findIndex(i => i._id === action.payload.index._id);
                if (index !== -1) {
                    state.indices[index] = action.payload.index;
                }
            })

            // Delete index
            .addCase(deleteIndex.fulfilled, (state, action) => {
                state.indices = state.indices.filter(i => i._id !== action.payload);
                state.totalIndices -= 1;
            });
    },
});

export const { setFilters, clearError } = marketSlice.actions;
export default marketSlice.reducer;
