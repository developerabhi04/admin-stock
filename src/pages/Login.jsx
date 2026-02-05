import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { login, clearError } from '../store/slices/authSlice';
import { Lock, User, AlertCircle } from 'lucide-react';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error, isAuthenticated, admin } = useSelector((state) => state.auth);

  // ✅ Redirect based on role and allowedRoutes when already authenticated
  useEffect(() => {
    if (isAuthenticated && admin) {
      console.log('✅ Already authenticated:', {
        role: admin.role,
        allowedRoutes: admin.allowedRoutes
      });

      if (admin.role === 'super_admin') {
        console.log('📍 Redirecting super admin to /dashboard');
        navigate('/dashboard');
      } else if (admin.allowedRoutes && admin.allowedRoutes.length > 0) {
        // Redirect to first allowed route
        console.log('📍 Redirecting admin to first allowed route:', admin.allowedRoutes[0]);
        navigate(admin.allowedRoutes[0]);
      } else {
        // Fallback
        console.log('📍 Redirecting to fallback /dashboard/payment-manager');
        navigate('/dashboard/payment-manager');
      }
    }
  }, [isAuthenticated, admin, navigate]);

  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  // ✅ Handle login with allowedRoutes-based redirect
  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log('🔵 Attempting login for:', username);

    const result = await dispatch(login({ username, password }));

    if (login.fulfilled.match(result)) {
      const adminData = result.payload.admin;

      console.log('✅ Login successful:', {
        username: adminData.username,
        role: adminData.role,
        allowedRoutes: adminData.allowedRoutes
      });

      // ✅ Redirect based on role and allowedRoutes
      if (adminData.role === 'super_admin') {
        console.log('📍 Redirecting super admin to /dashboard');
        navigate('/dashboard');
      } else if (adminData.allowedRoutes && adminData.allowedRoutes.length > 0) {
        // Redirect to first allowed route
        console.log('📍 Redirecting admin to first allowed route:', adminData.allowedRoutes[0]);
        navigate(adminData.allowedRoutes[0]);
      } else {
        // Fallback for admins without allowedRoutes
        console.log('📍 Redirecting to fallback /dashboard/payment-manager');
        navigate('/dashboard/payment-manager');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="bg-blue-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="text-white" size={32} />
          </div>
          <h1 className="text-3xl font-bold text-gray-800">Admin Portal</h1>
          <p className="text-gray-500 mt-2">TradeHub Management</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6 flex items-center">
            <AlertCircle size={20} className="mr-2" />
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Username */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Username
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                placeholder="Enter username"
                required
                disabled={loading}
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                placeholder="Enter password"
                required
                disabled={loading}
              />
            </div>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                Signing in...
              </>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-6 text-center text-sm text-gray-500">
          <p className="mb-2 font-semibold">Test Credentials:</p>
          <div className="space-y-1 bg-gray-50 p-3 rounded-lg">
            <p><span className="font-medium">Super Admin:</span> superadmin / admin123</p>
            <p><span className="font-medium">Admin:</span> Create from admin panel</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
