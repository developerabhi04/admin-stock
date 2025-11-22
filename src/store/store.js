import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import dashboardReducer from './slices/dashboardSlice';
import paymentsReducer from './slices/paymentsSlice';
import transactionsReducer from './slices/transactionsSlice';
import usersReducer from './slices/usersSlice';
import withdrawalsReducer from './slices/withdrawalsSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    dashboard: dashboardReducer,
    payments: paymentsReducer,
    transactions: transactionsReducer,
    users: usersReducer,
    withdrawals: withdrawalsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;
