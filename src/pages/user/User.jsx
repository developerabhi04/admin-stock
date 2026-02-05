import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsers, setFilters } from '../../store/slices/usersSlice';
import { useNavigate } from 'react-router-dom';
import { adminAPI } from '../../services/api';
import {
  Search,
  Users as UsersIcon,
  Wallet,
  Eye,
  RefreshCw,
  Filter,
  Download,
  AlertCircle,
  Send,
  X,
  Bell,
  Loader,
  CheckCircle,
  TrendingUp,
  TrendingDown,
  Target,
  ShoppingCart,
  DollarSign,
  Activity,
  PieChart,
  BarChart3,
  Award,
  Percent
} from 'lucide-react';
import Loading from '../../components/Loader';

const Users = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    users = [],
    loading,
    totalUsers,
    totalWalletBalance,
    totalBonusBalance,
    grandTotal,
    totalWithdrawals,
    pendingWithdrawals,
    filters,
    error
  } = useSelector((state) => state.users);

  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [sendToAll, setSendToAll] = useState(false);
  const [sendingNotification, setSendingNotification] = useState(false);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'table'
  const [notificationData, setNotificationData] = useState({
    title: '',
    message: '',
    type: 'general'
  });

  // Sample trading stats - Replace with real API
  const [tradingStats, setTradingStats] = useState({
    totalInvested: 12500000,
    totalCurrentValue: 13750000,
    totalPnL: 1250000,
    activeTraders: 456,
    totalHoldings: 1245,
    totalOrders: 3567,
    pendingOrders: 73
  });

  // Enhanced user data with trading info - This will come from backend
  const enhanceUserWithTradingData = (user) => {
    // Sample trading data - Replace with real API data
    const tradingData = {
      holdings: Math.floor(Math.random() * 10),
      invested: Math.floor(Math.random() * 500000),
      currentValue: Math.floor(Math.random() * 550000),
      pnl: Math.floor(Math.random() * 50000) - 10000,
      pendingOrders: Math.floor(Math.random() * 5),
      completedOrders: Math.floor(Math.random() * 50)
    };

    return {
      ...user,
      trading: tradingData
    };
  };

  useEffect(() => {
    dispatch(fetchUsers({
      page: 1,
      limit: 20,
      ...filters
    }));
  }, [dispatch, filters]);

  const handleSearch = (e) => {
    e.preventDefault();
    dispatch(setFilters({ search: searchTerm }));
  };

  const handleSort = (field) => {
    const newOrder = filters.sortBy === field && filters.sortOrder === 'desc' ? 'asc' : 'desc';
    dispatch(setFilters({ sortBy: field, sortOrder: newOrder }));
  };

  const handleRefresh = () => {
    dispatch(fetchUsers({
      page: 1,
      limit: 20,
      ...filters
    }));
  };

  const handleSendNotification = (user = null) => {
    if (user) {
      setSelectedUser(user);
      setSendToAll(false);
    } else {
      setSelectedUser(null);
      setSendToAll(true);
    }
    setShowNotificationModal(true);
  };

  const handleSubmitNotification = async (e) => {
    e.preventDefault();

    if (!notificationData.title.trim() || !notificationData.message.trim()) {
      alert('Please fill in all fields');
      return;
    }

    try {
      setSendingNotification(true);

      if (sendToAll) {
        await adminAPI.sendNotificationToAll(notificationData);
        alert(`✅ Notification sent to all ${totalUsers} users!`);
      } else {
        await adminAPI.sendNotificationToUser(selectedUser._id, notificationData);
        alert(`✅ Notification sent to ${selectedUser.fullName}!`);
      }

      setShowNotificationModal(false);
      setNotificationData({ title: '', message: '', type: 'general' });
      setSelectedUser(null);
      setSendToAll(false);
    } catch (error) {
      console.error('Error sending notification:', error);
      alert(error.response?.data?.message || 'Failed to send notification');
    } finally {
      setSendingNotification(false);
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'payment':
        return '💰';
      case 'withdrawal':
        return '💸';
      case 'promotion':
        return '🎁';
      case 'order':
        return '📦';
      default:
        return '📢';
    }
  };

  const exportToCSV = () => {
    // TODO: Implement CSV export
    alert('Export functionality coming soon!');
  };

  if (loading) {
    return <Loading message="Loading All Users..." />;
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen px-4">
        <div className="bg-red-50 rounded-full p-6 mb-6">
          <AlertCircle className="text-red-500" size={48} />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Failed to Load Users</h2>
        <p className="text-gray-600 mb-6 text-center max-w-md">{error}</p>
        <button
          onClick={handleRefresh}
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2.5 rounded-lg transition flex items-center gap-2"
        >
          <RefreshCw size={18} />
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Users Management
          </h1>
          <p className="text-gray-600 mt-1">{totalUsers} registered traders</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => handleSendNotification(null)}
            className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white px-4 py-2.5 rounded-xl transition flex items-center gap-2 shadow-lg font-semibold"
          >
            <Bell size={18} />
            Notify All
          </button>
          <button
            onClick={handleRefresh}
            disabled={loading}
            className="bg-white border-2 border-gray-200 hover:bg-gray-50 text-gray-700 px-4 py-2.5 rounded-xl transition flex items-center gap-2 disabled:opacity-50 font-semibold"
          >
            <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
            Refresh
          </button>
          <button
            onClick={exportToCSV}
            className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-4 py-2.5 rounded-xl transition flex items-center gap-2 font-semibold shadow-lg"
          >
            <Download size={18} />
            Export
          </button>
        </div>
      </div>

      {/* Enhanced Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total Users */}
        <div className="bg-white rounded-xl shadow-lg border-2 border-gray-100 p-6 hover:shadow-xl transition">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <UsersIcon className="text-blue-600" size={24} />
            </div>
            <TrendingUp className="text-blue-500" size={20} />
          </div>
          <p className="text-sm text-gray-600 mb-1">Total Users</p>
          <p className="text-3xl font-bold text-gray-900">{totalUsers || 0}</p>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-semibold">
              {tradingStats.activeTraders} Active
            </span>
          </div>
        </div>

        {/* Total Wallet Balance */}
        <div className="bg-white rounded-xl shadow-lg border-2 border-gray-100 p-6 hover:shadow-xl transition">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Wallet className="text-green-600" size={24} />
            </div>
            <TrendingUp className="text-green-500" size={20} />
          </div>
          <p className="text-sm text-gray-600 mb-1">Total Wallet</p>
          <p className="text-3xl font-bold text-green-600">
            ₹{((totalWalletBalance || 0) / 100000).toFixed(1)}L
          </p>
          <p className="text-xs text-gray-500 mt-2">
            ₹{(totalWalletBalance || 0).toLocaleString()}
          </p>
        </div>

        {/* Total Invested */}
        <div className="bg-white rounded-xl shadow-lg border-2 border-gray-100 p-6 hover:shadow-xl transition">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Target className="text-purple-600" size={24} />
            </div>
            <Activity className="text-purple-500" size={20} />
          </div>
          <p className="text-sm text-gray-600 mb-1">Total Invested</p>
          <p className="text-3xl font-bold text-purple-600">
            ₹{(tradingStats.totalInvested / 100000).toFixed(1)}L
          </p>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full font-semibold">
              {tradingStats.totalHoldings} Holdings
            </span>
          </div>
        </div>

        {/* Total P&L */}
        <div className="bg-white rounded-xl shadow-lg border-2 border-gray-100 p-6 hover:shadow-xl transition">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <DollarSign className="text-orange-600" size={24} />
            </div>
            <TrendingUp className="text-green-500" size={20} />
          </div>
          <p className="text-sm text-gray-600 mb-1">Total P&L</p>
          <p className="text-3xl font-bold text-green-600">
            +₹{(tradingStats.totalPnL / 100000).toFixed(1)}L
          </p>
          <p className="text-xs text-green-600 mt-2 font-semibold">
            +{((tradingStats.totalPnL / tradingStats.totalInvested) * 100).toFixed(2)}%
          </p>
        </div>
      </div>

      {/* Additional Stats Row */}
      <div className="bg-white rounded-xl shadow-lg border-2 border-gray-100 p-6 mb-8">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <BarChart3 className="text-blue-600" size={20} />
            </div>
            <p className="text-2xl font-bold text-gray-900">{tradingStats.totalOrders}</p>
            <p className="text-xs text-gray-500">Total Orders</p>
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <ShoppingCart className="text-yellow-600" size={20} />
            </div>
            <p className="text-2xl font-bold text-yellow-600">{tradingStats.pendingOrders}</p>
            <p className="text-xs text-gray-500">Pending Orders</p>
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <Award className="text-purple-600" size={20} />
            </div>
            <p className="text-2xl font-bold text-purple-600">
              ₹{((totalBonusBalance || 0) / 100000).toFixed(1)}L
            </p>
            <p className="text-xs text-gray-500">Bonus Balance</p>
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <TrendingDown className="text-red-600" size={20} />
            </div>
            <p className="text-2xl font-bold text-red-600">
              ₹{((totalWithdrawals || 0) / 100000).toFixed(1)}L
            </p>
            <p className="text-xs text-gray-500">Withdrawn</p>
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <AlertCircle className="text-orange-600" size={20} />
            </div>
            <p className="text-2xl font-bold text-orange-600">
              ₹{((pendingWithdrawals || 0) / 1000).toFixed(0)}K
            </p>
            <p className="text-xs text-gray-500">Pending W/D</p>
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <Wallet className="text-green-600" size={20} />
            </div>
            <p className="text-2xl font-bold text-green-600">
              ₹{((grandTotal || 0) / 100000).toFixed(1)}L
            </p>
            <p className="text-xs text-gray-500">Grand Total</p>
          </div>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="bg-white rounded-xl shadow-lg border-2 border-gray-100 p-6 mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          <form onSubmit={handleSearch} className="flex-1 flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by name, phone, or user ID..."
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
            </div>
            <button
              type="submit"
              className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6 py-3 rounded-xl transition font-semibold whitespace-nowrap"
            >
              Search
            </button>
          </form>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-xl transition flex items-center justify-center gap-2 font-semibold"
          >
            <Filter size={20} />
            Filters
          </button>
        </div>

        {showFilters && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => handleSort('createdAt')}
                className="bg-gray-50 hover:bg-gray-100 px-4 py-2 rounded-lg font-medium transition border-2 border-gray-200"
              >
                📅 By Date
              </button>
              <button
                onClick={() => handleSort('walletBalance')}
                className="bg-gray-50 hover:bg-gray-100 px-4 py-2 rounded-lg font-medium transition border-2 border-gray-200"
              >
                💰 By Balance
              </button>
              <button
                onClick={() => handleSort('fullName')}
                className="bg-gray-50 hover:bg-gray-100 px-4 py-2 rounded-lg font-medium transition border-2 border-gray-200"
              >
                👤 By Name
              </button>
              <button
                onClick={() => handleSort('invested')}
                className="bg-gray-50 hover:bg-gray-100 px-4 py-2 rounded-lg font-medium transition border-2 border-gray-200"
              >
                📊 By Investment
              </button>
              <button
                onClick={() => handleSort('pnl')}
                className="bg-gray-50 hover:bg-gray-100 px-4 py-2 rounded-lg font-medium transition border-2 border-gray-200"
              >
                📈 By P&L
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Users Grid/Table */}
      {!users || users.length === 0 ? (
        <div className="bg-white rounded-xl shadow-lg border-2 border-gray-100 p-12 text-center">
          <UsersIcon className="mx-auto text-gray-400 mb-4" size={64} />
          <h3 className="text-2xl font-bold text-gray-800 mb-2">No Users Found</h3>
          <p className="text-gray-500 mb-6">
            {searchTerm ? 'Try adjusting your search criteria' : 'No users have signed up yet'}
          </p>
          {searchTerm && (
            <button
              onClick={() => {
                setSearchTerm('');
                dispatch(setFilters({ search: '' }));
              }}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-xl transition font-semibold"
            >
              Clear Search
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
          {users.map((user) => {
            const enhancedUser = enhanceUserWithTradingData(user);
            const trading = enhancedUser.trading;
            const pnlPercent = trading.invested > 0
              ? ((trading.pnl / trading.invested) * 100).toFixed(2)
              : 0;

            return (
              <div
                key={user._id}
                className="bg-white rounded-xl shadow-lg border-2 border-gray-100 hover:shadow-2xl transition-all overflow-hidden transform hover:scale-105"
              >
                {/* User Header */}
                <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-4 text-white">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center font-bold text-lg ring-2 ring-white/30">
                      {user.fullName?.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold truncate">{user.fullName}</h3>
                      <p className="text-blue-100 text-sm">{user.phoneNumber}</p>
                    </div>
                    {user.isVerified && (
                      <CheckCircle className="text-green-300 flex-shrink-0" size={20} />
                    )}
                  </div>

                  {/* Quick Stats */}
                  <div className="flex gap-2">
                    <div className="flex-1 bg-white/20 backdrop-blur-sm rounded-lg p-2 text-center">
                      <p className="text-xs text-blue-100">Holdings</p>
                      <p className="font-bold text-lg">{trading.holdings}</p>
                    </div>
                    <div className="flex-1 bg-white/20 backdrop-blur-sm rounded-lg p-2 text-center">
                      <p className="text-xs text-blue-100">Orders</p>
                      <p className="font-bold text-lg">{trading.completedOrders}</p>
                    </div>
                  </div>
                </div>

                {/* Balance Info */}
                <div className="p-4 space-y-3">
                  {/* Wallet & Bonus */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-green-50 rounded-lg p-3 border border-green-200">
                      <p className="text-xs text-green-600 font-medium mb-1">Wallet</p>
                      <p className="font-bold text-green-600 text-lg">
                        ₹{((user.walletBalance || 0) / 1000).toFixed(0)}K
                      </p>
                    </div>
                    <div className="bg-purple-50 rounded-lg p-3 border border-purple-200">
                      <p className="text-xs text-purple-600 font-medium mb-1">Bonus</p>
                      <p className="font-bold text-purple-600 text-lg">
                        ₹{((user.bonusBalance || 0) / 1000).toFixed(0)}K
                      </p>
                    </div>
                  </div>

                  {/* Trading Stats */}
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-3 border border-blue-200">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-gray-600 font-medium">Invested</span>
                      <span className="font-bold text-blue-600">
                        ₹{(trading.invested / 1000).toFixed(0)}K
                      </span>
                    </div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-gray-600 font-medium">Current</span>
                      <span className="font-bold text-purple-600">
                        ₹{(trading.currentValue / 1000).toFixed(0)}K
                      </span>
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                      <span className="text-xs font-medium text-gray-900">P&L</span>
                      <div className="flex items-center gap-1">
                        {trading.pnl >= 0 ? (
                          <TrendingUp className="text-green-600" size={14} />
                        ) : (
                          <TrendingDown className="text-red-600" size={14} />
                        )}
                        <span className={`font-bold ${trading.pnl >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {trading.pnl >= 0 ? '+' : ''}₹{(trading.pnl / 1000).toFixed(1)}K
                        </span>
                        <span className={`text-xs font-semibold ${trading.pnl >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          ({trading.pnl >= 0 ? '+' : ''}{pnlPercent}%)
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Pending Orders Badge */}
                  {trading.pendingOrders > 0 && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-2 flex items-center justify-between">
                      <span className="text-xs text-yellow-700 font-medium">Pending Orders</span>
                      <span className="bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                        {trading.pendingOrders}
                      </span>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="p-3 bg-gray-50 flex gap-2 border-t border-gray-200">
                  <button
                    onClick={() => navigate(`/dashboard/users/${user._id}`)}
                    className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-3 py-2 rounded-lg font-medium transition flex items-center justify-center gap-2"
                  >
                    <Eye size={16} />
                    View
                  </button>
                  <button
                    onClick={() => handleSendNotification(user)}
                    className="flex-1 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white px-3 py-2 rounded-lg font-medium transition flex items-center justify-center gap-2"
                  >
                    <Send size={16} />
                    Notify
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {users && users.length > 0 && (
        <div className="bg-white rounded-xl shadow-lg border-2 border-gray-100 px-6 py-4 mt-8 flex items-center justify-between">
          <p className="text-sm text-gray-600">
            Showing <span className="font-bold text-gray-900">{users.length}</span> of{' '}
            <span className="font-bold text-gray-900">{totalUsers}</span> users
          </p>
          <div className="flex gap-2">
            {/* Add pagination buttons here if needed */}
          </div>
        </div>
      )}

      {/* Notification Modal */}
      {showNotificationModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md animate-scale-in">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div>
                <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  {sendToAll ? <Bell className="text-purple-600" size={24} /> : <Send className="text-purple-600" size={24} />}
                  {sendToAll ? 'Broadcast to All' : 'Send Notification'}
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  {sendToAll ? `To: All ${totalUsers} users` : `To: ${selectedUser?.fullName}`}
                </p>
              </div>
              <button
                onClick={() => {
                  setShowNotificationModal(false);
                  setSelectedUser(null);
                  setSendToAll(false);
                  setNotificationData({ title: '', message: '', type: 'general' });
                }}
                className="text-gray-400 hover:text-gray-600 transition"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmitNotification} className="p-6 space-y-4">
              {/* User Info (only for individual) */}
              {!sendToAll && selectedUser && (
                <div className="bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-blue-200 rounded-xl p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                      {selectedUser.fullName?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">{selectedUser.fullName}</p>
                      <p className="text-sm text-gray-600">{selectedUser.phoneNumber}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Broadcast Warning */}
              {sendToAll && (
                <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-4 flex items-start gap-3">
                  <AlertCircle className="text-yellow-600 flex-shrink-0 mt-0.5" size={20} />
                  <div>
                    <p className="font-bold text-yellow-900">Broadcasting to {totalUsers} users</p>
                    <p className="text-sm text-yellow-700 mt-1">This will send a notification to all registered users</p>
                  </div>
                </div>
              )}

              {/* Notification Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                <select
                  value={notificationData.type}
                  onChange={(e) => setNotificationData(prev => ({ ...prev, type: e.target.value }))}
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition"
                >
                  <option value="general">📢 General</option>
                  <option value="payment">💰 Payment</option>
                  <option value="withdrawal">💸 Withdrawal</option>
                  <option value="order">📦 Order Update</option>
                  <option value="promotion">🎁 Promotion</option>
                </select>
              </div>

              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                <input
                  type="text"
                  value={notificationData.title}
                  onChange={(e) => setNotificationData(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition"
                  placeholder="Enter notification title"
                  maxLength={50}
                  required
                />
                <p className="mt-1 text-xs text-gray-500">{notificationData.title.length}/50</p>
              </div>

              {/* Message */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                <textarea
                  value={notificationData.message}
                  onChange={(e) => setNotificationData(prev => ({ ...prev, message: e.target.value }))}
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition resize-none"
                  rows="4"
                  placeholder="Enter notification message"
                  maxLength={200}
                  required
                />
                <p className="mt-1 text-xs text-gray-500">{notificationData.message.length}/200</p>
              </div>

              {/* Preview */}
              {(notificationData.title || notificationData.message) && (
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 border-2 border-purple-200 rounded-xl p-4">
                  <p className="text-sm font-medium text-purple-700 mb-3">Preview:</p>
                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <Bell className="text-purple-600" size={18} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold text-gray-900">
                            {notificationData.title || 'Title'}
                          </h4>
                          <span className="text-lg">{getTypeIcon(notificationData.type)}</span>
                        </div>
                        <p className="text-sm text-gray-600">
                          {notificationData.message || 'Message'}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">Just now</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Footer */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowNotificationModal(false);
                    setSelectedUser(null);
                    setSendToAll(false);
                    setNotificationData({ title: '', message: '', type: 'general' });
                  }}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 rounded-xl transition font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={sendingNotification}
                  className="flex-1 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white py-3 rounded-xl transition disabled:opacity-50 font-semibold flex items-center justify-center gap-2"
                >
                  {sendingNotification ? (
                    <>
                      <Loader className="animate-spin" size={18} />
                      Sending...
                    </>
                  ) : (
                    <>
                      {sendToAll ? <Bell size={18} /> : <Send size={18} />}
                      {sendToAll ? 'Broadcast' : 'Send'}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;
