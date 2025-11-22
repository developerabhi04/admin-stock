import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loadAdmin } from './store/slices/authSlice';
import Login from './pages/Login';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import PendingPayments from './pages/PendingPayments';
import Transactions from './pages/Transactions';
import UserDetails from './pages/UserDetails';
import Users from './pages/User';
import PendingWithdrawals from './pages/PendingWithdrawals';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useSelector((state) => state.auth);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return isAuthenticated ? children : <Navigate to="/login" />;
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
          <Route index element={<Dashboard />} />
          <Route path="pending-payments" element={<PendingPayments />} />
          <Route path="pending-withdrawals" element={<PendingWithdrawals />} />
          <Route path="users" element={<Users />} /> 
          <Route path="users/:userId" element={<UserDetails />} /> 
          <Route path="transactions" element={<Transactions />} />


        </Route>
        <Route path="/" element={<Navigate to="/dashboard" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
