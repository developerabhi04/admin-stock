import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '/api/v1';
console.log('🌐 API_URL:', API_URL);

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

  console.log(
    '📤 Request:',
    config.method?.toUpperCase(),
    `${config.baseURL}${config.url}`,
    config.params || ''
  );

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
  // ================= AUTH =================
  login: (credentials) => api.post('/admin/login', credentials),

  // ================= DASHBOARD =================
  getDashboardStats: () => api.get('/admin/dashboard/stats'),
  getCompleteDashboardStats: () => api.get('/admin/dashboard/complete-stats'),

  // ================= PAYMENTS =================
  getPendingPayments: (page = 1, limit = 20) =>
    api.get(`/admin/payments/pending?page=${page}&limit=${limit}`),
  approvePayment: (data) => api.post('/admin/payments/approve', data),
  rejectPayment: (data) => api.post('/admin/payments/reject', data),

  // ================= WITHDRAWALS =================
  getPendingWithdrawals: (page = 1, limit = 20) =>
    api.get(`/admin/withdrawals/pending?page=${page}&limit=${limit}`),
  approveWithdrawal: (data) => api.post('/admin/withdrawals/approve', data),
  rejectWithdrawal: (data) => api.post('/admin/withdrawals/reject', data),
  getWithdrawalStats: () => api.get('/admin/withdrawals/stats'),

  // ================= TRANSACTIONS =================
  getAllTransactions: (params) => api.get('/admin/transactions', { params }),

  // ================= USERS =================
  getAllUsers: (params) => {
    console.log('🔵 getAllUsers called with params:', params);
    return api.get('/admin/users', { params });
  },
  getUserStats: () => api.get('/admin/users/stats'),
  getUserDetails: (userId) => api.get(`/admin/users/${userId}`),
  updateUserBalance: (data) => api.post('/admin/users/update-balance', data),

  // ================= STOCKS =================
  getAllStocks: (params) => api.get('/admin/stocks', { params }),
  createStock: (data) => api.post('/admin/stocks', data),
  updateStock: (stockId, data) => api.put(`/admin/stocks/${stockId}`, data),
  deleteStock: (stockId) => api.delete(`/admin/stocks/${stockId}`),
  getFeaturedStocks: () => api.get('/admin/stocks/featured'),

  // ================= INDICES MANAGEMENT =================
  getAllIndices: (params) => api.get('/admin/market/indices', { params }),
  createIndex: (data) => api.post('/admin/market/indices', data),
  updateIndex: (indexId, data) => api.put(`/admin/market/indices/${indexId}`, data),
  deleteIndex: (indexId) => api.delete(`/admin/market/indices/${indexId}`),
  getFeaturedIndices: () =>
    api.get('/admin/market/indices', { params: { featured: true } }),

  // ================= MARKET STATS =================
  getMarketStats: () => api.get('/admin/market/stats'),

  // ================= BANNERS =================
  getAllBanners: () => api.get('/banners'),
  uploadBanner: (formData) =>
    api.post('/banners', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  deleteBanner: (bannerId) => api.delete(`/banners/${bannerId}`),
  toggleBannerStatus: (bannerId) => api.patch(`/banners/${bannerId}/toggle`),
  reorderBanners: (banners) => api.post('/banners/reorder', { banners }),

  // ================= PUSH NOTIFICATIONS =================
  sendNotificationToAll: (data) => api.post('/notifications/admin/send-all', data),
  sendNotificationToUser: (userId, data) =>
    api.post(`/notifications/admin/send/${userId}`, data),
  getNotificationHistory: (params) =>
    api.get('/notifications/admin/history', { params }),
  getUsersForNotification: () => api.get('/notifications/admin/users-list'),

  // ================= INDEX CATEGORIES =================
  getAllCategories: () => api.get('/admin/market/categories'),
  createCategory: (data) => api.post('/admin/market/categories', data),
  updateCategory: (categoryId, data) =>
    api.put(`/admin/market/categories/${categoryId}`, data),
  deleteCategory: (categoryId) =>
    api.delete(`/admin/market/categories/${categoryId}`),

  // ================= REPORTS =================
  getReports: (params) => api.get('/admin/reports', { params }),
  getTransactionReports: (params) =>
    api.get('/admin/reports/transactions', { params }),
  getUserGrowthReport: (params) =>
    api.get('/admin/reports/user-growth', { params }),
  getRevenueReport: (params) => api.get('/admin/reports/revenue', { params }),

  // ================= ADMIN MANAGEMENT =================
  createAdmin: (data) => api.post('/admin/admins/create', data),
  getAllAdmins: () => api.get('/admin/admins'),
  updateAdminRole: (adminId, role) =>
    api.put(`/admin/admins/${adminId}/role`, { role }),
  deleteAdmin: (adminId) => api.delete(`/admin/admins/${adminId}`),
  getAdminActivity: (adminId) => api.get(`/admin/admins/${adminId}/activity`),

  // ================= BACKWARD COMPATIBILITY =================
  createPaymentManager: (data) => api.post('/admin/create-payment-manager', data),

  // ================= PAYMENT CONFIG =================
  getPaymentConfig: () => {
    console.log('🔵 getPaymentConfig called');
    return api.get('/admin/payment-config');
  },
  updateFullPaymentConfig: (data) => {
    console.log('🔵 updateFullPaymentConfig called with:', data);
    return api.put('/admin/payment-config', data);
  },
  updateUpiConfig: (data) => {
    console.log('🔵 updateUpiConfig called with:', data);
    return api.put('/admin/payment-config/upi', data);
  },
  updateBankConfig: (data) => {
    console.log('🔵 updateBankConfig called with:', data);
    return api.put('/admin/payment-config/bank', data);
  },
};

export const getReportsOverview = async () => {
  const response = await api.get('/admin/reports/overview');
  return response.data;
};

export default api;