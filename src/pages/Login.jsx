import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { login, clearError } from '../store/slices/authSlice';
import { Lock, User, AlertCircle, Eye, EyeOff, TrendingUp } from 'lucide-react';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); // ✅ toggle state
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
        console.log('📍 Redirecting admin to first allowed route:', admin.allowedRoutes[0]);
        navigate(admin.allowedRoutes[0]);
      } else {
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

      if (adminData.role === 'super_admin') {
        console.log('📍 Redirecting super admin to /dashboard');
        navigate('/dashboard');
      } else if (adminData.allowedRoutes && adminData.allowedRoutes.length > 0) {
        console.log('📍 Redirecting admin to first allowed route:', adminData.allowedRoutes[0]);
        navigate(adminData.allowedRoutes[0]);
      } else {
        console.log('📍 Redirecting to fallback /dashboard/payment-manager');
        navigate('/dashboard/payment-manager');
      }
    }
  };

  // ✅ Toggle handler for password visibility
  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div className="min-h-screen bg-[#0e0f11] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 border border-gray-100">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="bg-[#00D09C] w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-[#00D09C]/30">
            <TrendingUp className="text-white" size={32} strokeWidth={2.5} />
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            Trade<span className="text-[#00D09C]">Hub</span>
          </h1>
          <p className="text-gray-500 mt-2 text-sm">Admin Management Portal</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6 flex items-center">
            <AlertCircle size={20} className="mr-2 flex-shrink-0" />
            <span className="text-sm">{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
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
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#00D09C] focus:border-transparent outline-none transition"
                placeholder="Enter username"
                required
                disabled={loading}
                autoComplete="username"
              />
            </div>
          </div>

          {/* Password with visibility toggle */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type={showPassword ? 'text' : 'password'} // ✅ toggles input type
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-11 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#00D09C] focus:border-transparent outline-none transition"
                placeholder="Enter password"
                required
                disabled={loading}
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                disabled={loading}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-[#00B386] transition-colors focus:outline-none disabled:opacity-50"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                aria-pressed={showPassword}
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#00D09C] hover:bg-[#00B386] text-white font-semibold py-3 rounded-xl transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-md shadow-[#00D09C]/30"
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
      </div>
    </div>
  );
};

export default Login;