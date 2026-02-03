import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../store/slices/authSlice';
import {
  LayoutDashboard,
  Wallet,
  List,
  LogOut,
  User,
  Users,
  TrendingUp
} from 'lucide-react';

const Layout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { admin } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  // ✅ Define all nav items with role restrictions
  const allNavItems = [
    {
      path: '/dashboard',
      icon: LayoutDashboard,
      label: 'Dashboard',
      roles: ['super_admin'] // Only super admin
    },
    {
      path: '/dashboard/users',
      icon: Users,
      label: 'User Management',
      roles: ['super_admin'] // Only super admin
    },
    {
      path: '/dashboard/payment-manager',
      icon: Wallet,
      label: 'Payment Manager',
      roles: ['super_admin', 'payment_manager'] // Both can access
    },
    {
      path: '/dashboard/market',
      icon: TrendingUp,
      label: 'Market Data',
      roles: ['super_admin'] // Only super admin
    },
    {
      path: '/dashboard/transactions',
      icon: List,
      label: 'All Transactions',
      roles: ['super_admin'] // Only super admin
    },
  ];

  // ✅ Filter nav items based on admin role
  const navItems = allNavItems.filter(item =>
    item.roles.includes(admin?.role)
  );

  // ✅ Get role display name
  const getRoleDisplay = (role) => {
    switch (role) {
      case 'super_admin':
        return 'Super Admin';
      case 'payment_manager':
        return 'Payment Manager';
      default:
        return 'Admin';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-white shadow-lg z-50">
        {/* Logo */}
        <div className="p-6 border-b">
          <h1 className="text-2xl font-bold text-blue-600">TradeHub</h1>
          <p className="text-sm text-gray-500">Admin Panel</p>
          {/* ✅ Role Badge */}
          <div className="mt-2">
            <span className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${admin?.role === 'super_admin'
              ? 'bg-blue-100 text-blue-700'
              : 'bg-purple-100 text-purple-700'
              }`}>
              {getRoleDisplay(admin?.role)}
            </span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center space-x-3 px-4 py-3 rounded-lg transition ${isActive
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-700 hover:bg-gray-100'
                }`
              }
            >
              <item.icon size={20} />
              <span className="font-medium">{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Admin Info */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                <User className="text-white" size={20} />
              </div>
              <div>
                <p className="font-medium text-gray-800">{admin?.fullName}</p>
                <p className="text-xs text-gray-500">{getRoleDisplay(admin?.role)}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="p-2 hover:bg-red-100 rounded-lg transition"
              title="Logout"
            >
              <LogOut className="text-red-500" size={20} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-64 min-h-screen">
        <div className="p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;
