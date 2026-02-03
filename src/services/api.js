import axios from 'axios';

const API_URL = 'http://localhost:5000/api/v1';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('adminToken');
  console.log('🔑 Token:', token ? 'Present' : 'Missing');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  console.log('📤 Request:', config.method.toUpperCase(), config.url, config.params);
  return config;
});

// Handle errors and log responses
api.interceptors.response.use(
  (response) => {
    console.log('📥 Response:', response.config.url, response.data);
    return response;
  },
  (error) => {
    console.error('❌ API Error:', error.response?.data || error.message);
    if (error.response?.status === 401) {
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminData');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);





export const adminAPI = {
  // Auth
  // 1
  login: (credentials) => api.post('/admin/login', credentials),

  // Dashboard
  // 2
  getDashboardStats: () => api.get('/admin/dashboard/stats'),
  // 3
  getCompleteDashboardStats: () => api.get('/admin/dashboard/complete-stats'),



  // Payments
  // 4
  getPendingPayments: (page = 1, limit = 20) => api.get(`/admin/payments/pending?page=${page}&limit=${limit}`),
  // 5
  approvePayment: (data) => api.post('/admin/payments/approve', data),
  // 6
  rejectPayment: (data) => api.post('/admin/payments/reject', data),



  // ✅ Withdrawals
  // 7
  getPendingWithdrawals: (page = 1, limit = 20) => api.get(`/admin/withdrawals/pending?page=${page}&limit=${limit}`),
  // 8
  approveWithdrawal: (data) => api.post('/admin/withdrawals/approve', data),
  // 9
  rejectWithdrawal: (data) => api.post('/admin/withdrawals/reject', data),

  // ✅ NEW: Get withdrawal statistics
  getWithdrawalStats: () => {
    return api.get('/admin/withdrawals/stats')
      .then(response => {
        // console.log('✅ getWithdrawalStats success:', response.data);
        return response;
      })
      .catch(error => {
        // console.error('❌ getWithdrawalStats error:', error.response?.data || error.message);
        throw error;
      });
  },

  // Transactions
  getAllTransactions: (params) => api.get('/admin/transactions', { params }),

  // ✅ User Management with detailed logging
  getAllUsers: (params) => {
    console.log('🔵 getAllUsers called with params:', params);
    return api.get('/admin/users', { params })
      .then(response => {
        console.log('✅ getAllUsers success:', response.data);
        return response;
      })
      .catch(error => {
        console.error('❌ getAllUsers error:', error.response?.data || error.message);
        throw error;
      });
  },
  getUserStats: () => api.get('/admin/users/stats'),
  getUserDetails: (userId) => api.get(`/admin/users/${userId}`),
  updateUserBalance: (data) => api.post('/admin/users/update-balance', data),


  // Get all stocks
  getAllStocks: (params) => {
    console.log('🔵 getAllStocks called with params:', params);
    return api.get('/admin/stocks', { params })
      .then(response => {
        console.log('✅ getAllStocks success:', response.data);
        return response;
      })
      .catch(error => {
        console.error('❌ getAllStocks error:', error.response?.data || error.message);
        throw error;
      });
  },

  // Create stock
  createStock: (data) => api.post('/admin/stocks', data),

  // Update stock
  updateStock: (stockId, data) => api.put(`/admin/stocks/${stockId}`, data),

  // Delete stock
  deleteStock: (stockId) => api.delete(`/admin/stocks/${stockId}`),

  // Get featured stocks
  getFeaturedStocks: () => api.get('/admin/stocks/featured'),


  // ============ INDICES MANAGEMENT ============

  // Get all indices
  getAllIndices: (params) => {
    console.log('🔵 getAllIndices called with params:', params);
    return api.get('/admin/indices', { params })
      .then(response => {
        console.log('✅ getAllIndices success:', response.data);
        return response;
      })
      .catch(error => {
        console.error('❌ getAllIndices error:', error.response?.data || error.message);
        throw error;
      });
  },

  // Create index
  createIndex: (data) => api.post('/admin/indices', data),

  // Update index
  updateIndex: (indexId, data) => api.put(`/admin/indices/${indexId}`, data),

  // Delete index
  deleteIndex: (indexId) => api.delete(`/admin/indices/${indexId}`),

  // Get featured indices
  getFeaturedIndices: () => api.get('/admin/indices/featured'),


  // ============ MARKET DATA STATS ============

  getMarketStats: () => api.get('/admin/market/stats'),
};

export default api;
