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
  login: (credentials) => api.post('/admin/login', credentials),

  // Dashboard
  getDashboardStats: () => api.get('/admin/dashboard/stats'),

  // Payments
  getPendingPayments: (page = 1, limit = 20) =>
    api.get(`/admin/payments/pending?page=${page}&limit=${limit}`),
  approvePayment: (data) => api.post('/admin/payments/approve', data),
  rejectPayment: (data) => api.post('/admin/payments/reject', data),

  // ✅ Withdrawals
  getPendingWithdrawals: (page = 1, limit = 20) =>
    api.get(`/admin/withdrawals/pending?page=${page}&limit=${limit}`),
  approveWithdrawal: (data) => api.post('/admin/withdrawals/approve', data),
  rejectWithdrawal: (data) => api.post('/admin/withdrawals/reject', data),
  
  // ✅ NEW: Get withdrawal statistics
  getWithdrawalStats: () => {
    console.log('🔵 getWithdrawalStats called');
    return api.get('/admin/withdrawals/stats')
      .then(response => {
        console.log('✅ getWithdrawalStats success:', response.data);
        return response;
      })
      .catch(error => {
        console.error('❌ getWithdrawalStats error:', error.response?.data || error.message);
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
};

export default api;
