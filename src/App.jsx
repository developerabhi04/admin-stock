import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loadAdmin } from './store/slices/authSlice';
import Login from './pages/Login';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import PaymentManager from './pages/PaymentManager';
import Transactions from './pages/Transactions';
import UserDetails from './pages/user/UserDetails';
import Users from './pages/user/User';
import MarketOverview from './pages/MarketOverview';
import StocksManagement from './pages/StocksManagement';
import IndicesManagement from './pages/IndicesManagement';
import BannerManagement from './pages/BannerManagement';
import PushNotifications from './pages/PushNotifications';
import IndexCategories from './pages/IndexCategories';
import KYCManagement from './pages/KYCManagement';
import Reports from './pages/Reports';
import AdminManagement from './pages/AdminManagement';


/**
 * ✅ FIXED: Check if admin has access to current route (including sub-routes)
 */
const ProtectedRoute = ({ children, requireSuperAdmin = false }) => {
  const { isAuthenticated, loading, admin } = useSelector((state) => state.auth);
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  // ✅ Super admin has access to everything
  if (admin?.role === 'super_admin') {
    return children;
  }

  // ✅ If route requires super admin and user is not super admin
  if (requireSuperAdmin) {
    console.warn('❌ Access denied: Super admin required for this route');
    return <Navigate to="/dashboard/payment-manager" replace />;
  }

  // ✅ For regular admins, check if current path is in their allowedRoutes
  const currentPath = location.pathname;
  const allowedRoutes = admin?.allowedRoutes || [];

  console.log('🔐 Route Check:', {
    currentPath,
    allowedRoutes,
    hasAccess: allowedRoutes.includes(currentPath)
  });

  // ✅ NEW: Check both exact match AND parent route match
  const hasAccess = allowedRoutes.some(route => {
    // Exact match
    if (currentPath === route) return true;

    // Parent route match (e.g., /dashboard/market includes /dashboard/market/stocks)
    if (currentPath.startsWith(route + '/')) return true;

    return false;
  });

  console.log('🔐 Access check result:', hasAccess);

  // Check if admin has access to this specific route
  if (allowedRoutes.length > 0 && !hasAccess) {
    console.warn('❌ Access denied to:', currentPath);

    // Redirect to first allowed route
    if (allowedRoutes.length > 0) {
      return <Navigate to={allowedRoutes[0]} replace />;
    }

    return <Navigate to="/dashboard/payment-manager" replace />;
  }

  return children;
};


function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadAdmin());
  }, [dispatch]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          {/* ✅ Dashboard - Super Admin Only */}
          <Route
            index
            element={
              <ProtectedRoute requireSuperAdmin={true}>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          {/* ✅ User Management - Super Admin or Allowed Admins */}
          <Route
            path="users"
            element={
              <ProtectedRoute>
                <Users />
              </ProtectedRoute>
            }
          />
          <Route
            path="users/:userId"
            element={
              <ProtectedRoute>
                <UserDetails />
              </ProtectedRoute>
            }
          />

          {/* ✅ KYC Management - Super Admin or Allowed Admins */}
          <Route
            path="kyc"
            element={
              <ProtectedRoute>
                <KYCManagement />
              </ProtectedRoute>
            }
          />

          {/* ✅ Payment Manager - Super Admin or Allowed Admins */}
          <Route
            path="payment-manager"
            element={
              <ProtectedRoute>
                <PaymentManager />
              </ProtectedRoute>
            }
          />
          <Route
            path="payment-manager/payments"
            element={
              <ProtectedRoute>
                <PaymentManager defaultTab="payments" />
              </ProtectedRoute>
            }
          />
          <Route
            path="payment-manager/withdrawals"
            element={
              <ProtectedRoute>
                <PaymentManager defaultTab="withdrawals" />
              </ProtectedRoute>
            }
          />

          {/* ✅ Transactions - Super Admin or Allowed Admins */}
          <Route
            path="transactions"
            element={
              <ProtectedRoute>
                <Transactions />
              </ProtectedRoute>
            }
          />

          {/* ✅ Market Data - Super Admin or Allowed Admins */}
          <Route
            path="market"
            element={
              <ProtectedRoute>
                <MarketOverview />
              </ProtectedRoute>
            }
          />
          <Route
            path="market/stocks"
            element={
              <ProtectedRoute>
                <StocksManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="market/indices"
            element={
              <ProtectedRoute>
                <IndicesManagement />
              </ProtectedRoute>
            }
          />

          {/* ✅ Index Categories - Super Admin or Allowed Admins */}
          <Route
            path="index-categories"
            element={
              <ProtectedRoute>
                <IndexCategories />
              </ProtectedRoute>
            }
          />

          {/* ✅ Banner Management - Super Admin or Allowed Admins */}
          <Route
            path="banners"
            element={
              <ProtectedRoute>
                <BannerManagement />
              </ProtectedRoute>
            }
          />

          {/* ✅ Push Notifications - Super Admin or Allowed Admins */}
          <Route
            path="notifications"
            element={
              <ProtectedRoute>
                <PushNotifications />
              </ProtectedRoute>
            }
          />

          {/* ✅ Reports & Analytics - Super Admin or Allowed Admins */}
          <Route
            path="reports"
            element={
              <ProtectedRoute>
                <Reports />
              </ProtectedRoute>
            }
          />

          {/* ✅ Admin Management - Super Admin ONLY */}
          <Route
            path="admins"
            element={
              <ProtectedRoute requireSuperAdmin={true}>
                <AdminManagement />
              </ProtectedRoute>
            }
          />
        </Route>

        <Route path="/" element={<Navigate to="/dashboard" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
