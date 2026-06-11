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

  getWithdrawalStats: () => {
    return api
      .get('/admin/withdrawals/stats')
      .then((response) => response)
      .catch((error) => {
        throw error;
      });
  },

  // ================= TRANSACTIONS =================
  getAllTransactions: (params) => api.get('/admin/transactions', { params }),

  // ================= USERS =================
  getAllUsers: (params) => {
    console.log('🔵 getAllUsers called with params:', params);
    return api
      .get('/admin/users', { params })
      .then((response) => {
        console.log('✅ getAllUsers success:', response.data);
        return response;
      })
      .catch((error) => {
        console.error('❌ getAllUsers error:', error.response?.data || error.message);
        throw error;
      });
  },

  getUserStats: () => api.get('/admin/users/stats'),
  getUserDetails: (userId) => api.get(`/admin/users/${userId}`),
  updateUserBalance: (data) => api.post('/admin/users/update-balance', data),

  // ================= STOCKS =================
  getAllStocks: (params) => {
    console.log('🔵 getAllStocks called with params:', params);
    return api
      .get('/admin/stocks', { params })
      .then((response) => {
        console.log('✅ getAllStocks success:', response.data);
        return response;
      })
      .catch((error) => {
        console.error('❌ getAllStocks error:', error.response?.data || error.message);
        throw error;
      });
  },

  createStock: (data) => api.post('/admin/stocks', data),
  updateStock: (stockId, data) => api.put(`/admin/stocks/${stockId}`, data),
  deleteStock: (stockId) => api.delete(`/admin/stocks/${stockId}`),
  getFeaturedStocks: () => api.get('/admin/stocks/featured'),

  // ================= INDICES MANAGEMENT =================
  getAllIndices: (params) => {
    console.log('🔵 getAllIndices called with params:', params);
    return api
      .get('/admin/market/indices', { params })
      .then((response) => {
        console.log('✅ getAllIndices success:', response.data);
        return response;
      })
      .catch((error) => {
        console.error('❌ getAllIndices error:', error.response?.data || error.message);
        throw error;
      });
  },

  createIndex: (data) => api.post('/admin/market/indices', data),
  updateIndex: (indexId, data) => api.put(`/admin/market/indices/${indexId}`, data),
  deleteIndex: (indexId) => api.delete(`/admin/market/indices/${indexId}`),

  getFeaturedIndices: () =>
    api.get('/admin/market/indices', { params: { featured: true } }),

  // ================= MARKET STATS =================
  getMarketStats: () => api.get('/admin/market/stats'),

  // ================= BANNERS =================
  getAllBanners: () => {
    console.log('🔵 getAllBanners called');
    return api
      .get('/banners')
      .then((response) => {
        console.log('✅ getAllBanners response:', response.data);
        return response;
      })
      .catch((error) => {
        console.error('❌ getAllBanners error:', error.response?.data || error.message);
        throw error;
      });
  },

  uploadBanner: (formData) => {
    return api.post('/banners', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  deleteBanner: (bannerId) => api.delete(`/banners/${bannerId}`),
  toggleBannerStatus: (bannerId) => api.patch(`/banners/${bannerId}/toggle`),
  reorderBanners: (banners) => api.post('/banners/reorder', { banners }),

  // ================= PUSH NOTIFICATIONS =================
  sendNotificationToAll: (data) => {
    console.log('🔵 sendNotificationToAll called with:', data);
    return api.post('/notifications/admin/send-all', data);
  },

  sendNotificationToUser: (userId, data) => {
    console.log('🔵 sendNotificationToUser called:', userId, data);
    return api.post(`/notifications/admin/send/${userId}`, data);
  },

  getNotificationHistory: (params) => {
    return api.get('/notifications/admin/history', { params });
  },

  getUsersForNotification: () => {
    console.log('🔵 getUsersForNotification called');
    return api
      .get('/notifications/admin/users-list')
      .then((response) => {
        console.log('✅ getUsersForNotification success:', response.data);
        return response;
      })
      .catch((error) => {
        console.error(
          '❌ getUsersForNotification error:',
          error.response?.data || error.message
        );
        throw error;
      });
  },

  // ================= INDEX CATEGORIES =================
  getAllCategories: () => {
    console.log('🔵 getAllCategories called');
    return api.get('/admin/market/categories');
  },

  createCategory: (data) => api.post('/admin/market/categories', data),
  updateCategory: (categoryId, data) =>
    api.put(`/admin/market/categories/${categoryId}`, data),
  deleteCategory: (categoryId) =>
    api.delete(`/admin/market/categories/${categoryId}`),

  // ================= REPORTS =================
  getReports: (params) => {
    console.log('🔵 getReports called with params:', params);
    return api.get('/admin/reports', { params });
  },

  getTransactionReports: (params) =>
    api.get('/admin/reports/transactions', { params }),

  getUserGrowthReport: (params) =>
    api.get('/admin/reports/user-growth', { params }),

  getRevenueReport: (params) =>
    api.get('/admin/reports/revenue', { params }),

  // ================= ADMIN MANAGEMENT =================
  createAdmin: (data) => {
    console.log('🔵 createAdmin called with:', data);
    return api.post('/admin/admins/create', data);
  },

  getAllAdmins: () => {
    console.log('🔵 getAllAdmins called');
    return api.get('/admin/admins');
  },

  updateAdminRole: (adminId, role) => {
    console.log('🔵 updateAdminRole called:', adminId, role);
    return api.put(`/admin/admins/${adminId}/role`, { role });
  },

  deleteAdmin: (adminId) => {
    console.log('🔵 deleteAdmin called:', adminId);
    return api.delete(`/admin/admins/${adminId}`);
  },

  getAdminActivity: (adminId) => {
    console.log('🔵 getAdminActivity called:', adminId);
    return api.get(`/admin/admins/${adminId}/activity`);
  },

  // ================= BACKWARD COMPATIBILITY =================
  createPaymentManager: (data) => {
    return api.post('/admin/create-payment-manager', data);
  },
};

export const getReportsOverview = async () => {
  const response = await api.get('/admin/reports/overview');
  return response.data;
};

export default api;