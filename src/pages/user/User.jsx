import { useEffect, useMemo, useState } from 'react';
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
  Award,
  TrendingDown,
  Activity,
  CalendarDays,
  Phone,
  UserCircle2,
} from 'lucide-react';
import Loading from '../../components/Loader';

const formatCurrency = (value) => `₹${Number(value || 0).toLocaleString('en-IN')}`;
const formatCompactLakh = (value) => `₹${(Number(value || 0) / 100000).toFixed(1)}L`;

const Users = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    users = [],
    loading,
    totalUsers = 0,
    totalWalletBalance = 0,
    totalBonusBalance = 0,
    grandTotal = 0,
    totalWithdrawals = 0,
    pendingWithdrawals = 0,
    filters = {},
    error,
  } = useSelector((state) => state.users);

  const [searchTerm, setSearchTerm] = useState(filters.search || '');
  const [showFilters, setShowFilters] = useState(false);
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [sendToAll, setSendToAll] = useState(false);
  const [sendingNotification, setSendingNotification] = useState(false);
  const [notificationData, setNotificationData] = useState({
    title: '',
    message: '',
    type: 'general',
  });

  useEffect(() => {
    dispatch(
      fetchUsers({
        page: 1,
        limit: 20,
        ...filters,
      })
    );
  }, [dispatch, filters]);

  const verifiedUsers = useMemo(
    () => users.filter((user) => user.isVerified).length,
    [users]
  );

  const activeUsers = useMemo(
    () => users.filter((user) => user.isActive !== false).length,
    [users]
  );

  const handleSearch = (e) => {
    e.preventDefault();
    dispatch(setFilters({ search: searchTerm, page: 1 }));
  };

  const handleSort = (field) => {
    const newOrder =
      filters.sortBy === field && filters.sortOrder === 'desc' ? 'asc' : 'desc';

    dispatch(setFilters({ sortBy: field, sortOrder: newOrder, page: 1 }));
  };

  const handleRefresh = () => {
    dispatch(
      fetchUsers({
        page: 1,
        limit: 20,
        ...filters,
      })
    );
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

  const resetNotificationModal = () => {
    setShowNotificationModal(false);
    setSelectedUser(null);
    setSendToAll(false);
    setNotificationData({
      title: '',
      message: '',
      type: 'general',
    });
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
      } else if (selectedUser?._id) {
        await adminAPI.sendNotificationToUser(selectedUser._id, notificationData);
        alert(`✅ Notification sent to ${selectedUser.fullName}!`);
      }

      resetNotificationModal();
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
    alert('Export functionality coming soon!');
  };

  if (loading) {
    return <Loading message="Loading all users..." />;
  }

  if (error) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center px-4">
        <div className="mb-6 rounded-full bg-red-50 p-6">
          <AlertCircle className="text-red-500" size={48} />
        </div>
        <h2 className="mb-2 text-2xl font-bold text-gray-800">Failed to Load Users</h2>
        <p className="mb-6 max-w-md text-center text-gray-600">{error}</p>
        <button
          onClick={handleRefresh}
          className="flex items-center gap-2 rounded-lg bg-blue-500 px-6 py-2.5 text-white transition hover:bg-blue-600"
          type="button"
        >
          <RefreshCw size={18} />
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-3xl font-bold text-transparent">
            Users Management
          </h1>
          <p className="mt-1 text-gray-600">{totalUsers} registered users</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => handleSendNotification(null)}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-500 to-purple-600 px-4 py-2.5 font-semibold text-white shadow-lg transition hover:from-purple-600 hover:to-purple-700"
            type="button"
          >
            <Bell size={18} />
            Notify All
          </button>

          <button
            onClick={handleRefresh}
            disabled={loading}
            className="flex items-center gap-2 rounded-xl border-2 border-gray-200 bg-white px-4 py-2.5 font-semibold text-gray-700 transition hover:bg-gray-50 disabled:opacity-50"
            type="button"
          >
            <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
            Refresh
          </button>

          <button
            onClick={exportToCSV}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-green-500 to-green-600 px-4 py-2.5 font-semibold text-white shadow-lg transition hover:from-green-600 hover:to-green-700"
            type="button"
          >
            <Download size={18} />
            Export
          </button>
        </div>
      </div>

      <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border-2 border-gray-100 bg-white p-6 shadow-lg transition hover:shadow-xl">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
              <UsersIcon className="text-blue-600" size={24} />
            </div>
            <Activity className="text-blue-500" size={20} />
          </div>
          <p className="mb-1 text-sm text-gray-600">Total Users</p>
          <p className="text-3xl font-bold text-gray-900">{totalUsers}</p>
          <p className="mt-2 text-xs text-gray-500">{activeUsers} active in current page data</p>
        </div>

        <div className="rounded-xl border-2 border-gray-100 bg-white p-6 shadow-lg transition hover:shadow-xl">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100">
              <Wallet className="text-green-600" size={24} />
            </div>
            <Wallet className="text-green-500" size={20} />
          </div>
          <p className="mb-1 text-sm text-gray-600">Total Wallet Balance</p>
          <p className="text-3xl font-bold text-green-600">{formatCompactLakh(totalWalletBalance)}</p>
          <p className="mt-2 text-xs text-gray-500">{formatCurrency(totalWalletBalance)}</p>
        </div>

        <div className="rounded-xl border-2 border-gray-100 bg-white p-6 shadow-lg transition hover:shadow-xl">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100">
              <Award className="text-purple-600" size={24} />
            </div>
            <CheckCircle className="text-purple-500" size={20} />
          </div>
          <p className="mb-1 text-sm text-gray-600">Bonus Balance</p>
          <p className="text-3xl font-bold text-purple-600">{formatCompactLakh(totalBonusBalance)}</p>
          <p className="mt-2 text-xs text-gray-500">{verifiedUsers} verified in current page data</p>
        </div>

        <div className="rounded-xl border-2 border-gray-100 bg-white p-6 shadow-lg transition hover:shadow-xl">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-orange-100">
              <TrendingDown className="text-orange-600" size={24} />
            </div>
            <AlertCircle className="text-orange-500" size={20} />
          </div>
          <p className="mb-1 text-sm text-gray-600">Pending Withdrawals</p>
          <p className="text-3xl font-bold text-orange-600">{formatCompactLakh(pendingWithdrawals)}</p>
          <p className="mt-2 text-xs text-gray-500">Total withdrawn: {formatCompactLakh(totalWithdrawals)}</p>
        </div>
      </div>

      <div className="mb-8 rounded-xl border-2 border-gray-100 bg-white p-6 shadow-lg">
        <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">{formatCompactLakh(grandTotal)}</p>
            <p className="text-xs text-gray-500">Grand Total</p>
          </div>

          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">{formatCompactLakh(totalWalletBalance)}</p>
            <p className="text-xs text-gray-500">Wallet Pool</p>
          </div>

          <div className="text-center">
            <p className="text-2xl font-bold text-purple-600">{formatCompactLakh(totalBonusBalance)}</p>
            <p className="text-xs text-gray-500">Bonus Pool</p>
          </div>

          <div className="text-center">
            <p className="text-2xl font-bold text-red-600">{formatCompactLakh(totalWithdrawals)}</p>
            <p className="text-xs text-gray-500">Total Withdrawn</p>
          </div>
        </div>
      </div>

      <div className="mb-8 rounded-xl border-2 border-gray-100 bg-white p-6 shadow-lg">
        <div className="flex flex-col gap-4 md:flex-row">
          <form onSubmit={handleSearch} className="flex flex-1 gap-3">
            <div className="relative flex-1">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 transform text-gray-400"
                size={20}
              />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by name, phone, or user ID..."
                className="w-full rounded-xl border-2 border-gray-200 py-3 pl-12 pr-4 transition focus:border-transparent focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button
              type="submit"
              className="whitespace-nowrap rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-3 font-semibold text-white transition hover:from-blue-600 hover:to-blue-700"
            >
              Search
            </button>
          </form>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center justify-center gap-2 rounded-xl bg-gray-100 px-6 py-3 font-semibold text-gray-700 transition hover:bg-gray-200"
            type="button"
          >
            <Filter size={20} />
            Filters
          </button>
        </div>

        {showFilters && (
          <div className="mt-6 border-t border-gray-200 pt-6">
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => handleSort('createdAt')}
                className="rounded-lg border-2 border-gray-200 bg-gray-50 px-4 py-2 font-medium transition hover:bg-gray-100"
                type="button"
              >
                📅 By Date
              </button>

              <button
                onClick={() => handleSort('walletBalance')}
                className="rounded-lg border-2 border-gray-200 bg-gray-50 px-4 py-2 font-medium transition hover:bg-gray-100"
                type="button"
              >
                💰 By Balance
              </button>

              <button
                onClick={() => handleSort('fullName')}
                className="rounded-lg border-2 border-gray-200 bg-gray-50 px-4 py-2 font-medium transition hover:bg-gray-100"
                type="button"
              >
                👤 By Name
              </button>

              <button
                onClick={() => handleSort('isVerified')}
                className="rounded-lg border-2 border-gray-200 bg-gray-50 px-4 py-2 font-medium transition hover:bg-gray-100"
                type="button"
              >
                ✅ By Verification
              </button>
            </div>
          </div>
        )}
      </div>

      {!users || users.length === 0 ? (
        <div className="rounded-xl border-2 border-gray-100 bg-white p-12 text-center shadow-lg">
          <UsersIcon className="mx-auto mb-4 text-gray-400" size={64} />
          <h3 className="mb-2 text-2xl font-bold text-gray-800">No Users Found</h3>
          <p className="mb-6 text-gray-500">
            {searchTerm ? 'Try adjusting your search criteria' : 'No users have signed up yet'}
          </p>

          {searchTerm && (
            <button
              onClick={() => {
                setSearchTerm('');
                dispatch(setFilters({ search: '', page: 1 }));
              }}
              className="rounded-xl bg-blue-500 px-6 py-3 font-semibold text-white transition hover:bg-blue-600"
              type="button"
            >
              Clear Search
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
          {users.map((user) => (
            <div
              key={user._id}
              className="overflow-hidden rounded-xl border-2 border-gray-100 bg-white shadow-lg transition-all hover:shadow-2xl"
            >
              <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-4 text-white">
                <div className="mb-3 flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20 text-lg font-bold ring-2 ring-white/30 backdrop-blur-sm">
                    {user.fullName?.charAt(0)?.toUpperCase() || 'U'}
                  </div>

                  <div className="min-w-0 flex-1">
                    <h3 className="truncate font-bold">{user.fullName || 'Unknown User'}</h3>
                    <p className="text-sm text-blue-100">{user.phoneNumber || '-'}</p>
                  </div>

                  {user.isVerified && (
                    <CheckCircle className="shrink-0 text-green-300" size={20} />
                  )}
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="rounded-lg bg-white/20 p-2 text-center backdrop-blur-sm">
                    <p className="text-xs text-blue-100">Wallet</p>
                    <p className="font-bold">{formatCompactLakh(user.walletBalance || 0)}</p>
                  </div>

                  <div className="rounded-lg bg-white/20 p-2 text-center backdrop-blur-sm">
                    <p className="text-xs text-blue-100">Bonus</p>
                    <p className="font-bold">{formatCompactLakh(user.bonusBalance || 0)}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-3 p-4">
                <div className="grid grid-cols-1 gap-3">
                  <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">
                    <div className="mb-2 flex items-center gap-2 text-gray-700">
                      <Phone size={16} />
                      <span className="text-xs font-medium">Phone</span>
                    </div>
                    <p className="font-semibold text-gray-900">{user.phoneNumber || '-'}</p>
                  </div>

                  <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">
                    <div className="mb-2 flex items-center gap-2 text-gray-700">
                      <UserCircle2 size={16} />
                      <span className="text-xs font-medium">User ID</span>
                    </div>
                    <p className="break-all font-semibold text-gray-900">{user._id}</p>
                  </div>

                  <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">
                    <div className="mb-2 flex items-center gap-2 text-gray-700">
                      <CalendarDays size={16} />
                      <span className="text-xs font-medium">Joined</span>
                    </div>
                    <p className="font-semibold text-gray-900">
                      {user.createdAt
                        ? new Date(user.createdAt).toLocaleDateString('en-IN', {
                          dateStyle: 'medium',
                        })
                        : '-'}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${user.isVerified
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'bg-amber-100 text-amber-700'
                      }`}
                  >
                    {user.isVerified ? 'Verified' : 'Unverified'}
                  </span>

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${user.isActive !== false
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-red-100 text-red-700'
                      }`}
                  >
                    {user.isActive !== false ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>

              <div className="flex gap-2 border-t border-gray-200 bg-gray-50 p-3">
                <button
                  onClick={() => navigate(`/dashboard/users/${user._id}`)}
                  className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 px-3 py-2 font-medium text-white transition hover:from-blue-600 hover:to-blue-700"
                  type="button"
                >
                  <Eye size={16} />
                  View
                </button>

                <button
                  onClick={() => handleSendNotification(user)}
                  className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-purple-500 to-purple-600 px-3 py-2 font-medium text-white transition hover:from-purple-600 hover:to-purple-700"
                  type="button"
                >
                  <Send size={16} />
                  Notify
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {users && users.length > 0 && (
        <div className="mt-8 flex items-center justify-between rounded-xl border-2 border-gray-100 bg-white px-6 py-4 shadow-lg">
          <p className="text-sm text-gray-600">
            Showing <span className="font-bold text-gray-900">{users.length}</span> of{' '}
            <span className="font-bold text-gray-900">{totalUsers}</span> users
          </p>
          <div className="flex gap-2" />
        </div>
      )}

      {showNotificationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-200 p-6">
              <div>
                <h3 className="flex items-center gap-2 text-xl font-bold text-gray-900">
                  {sendToAll ? (
                    <Bell className="text-purple-600" size={24} />
                  ) : (
                    <Send className="text-purple-600" size={24} />
                  )}
                  {sendToAll ? 'Broadcast to All' : 'Send Notification'}
                </h3>
                <p className="mt-1 text-sm text-gray-600">
                  {sendToAll ? `To: All ${totalUsers} users` : `To: ${selectedUser?.fullName}`}
                </p>
              </div>

              <button
                onClick={resetNotificationModal}
                className="text-gray-400 transition hover:text-gray-600"
                type="button"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmitNotification} className="space-y-4 p-6">
              {!sendToAll && selectedUser && (
                <div className="rounded-xl border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-purple-50 p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-lg font-bold text-white">
                      {selectedUser.fullName?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">{selectedUser.fullName}</p>
                      <p className="text-sm text-gray-600">{selectedUser.phoneNumber}</p>
                    </div>
                  </div>
                </div>
              )}

              {sendToAll && (
                <div className="flex items-start gap-3 rounded-xl border-2 border-yellow-200 bg-yellow-50 p-4">
                  <AlertCircle className="mt-0.5 shrink-0 text-yellow-600" size={20} />
                  <div>
                    <p className="font-bold text-yellow-900">Broadcasting to {totalUsers} users</p>
                    <p className="mt-1 text-sm text-yellow-700">
                      This will send a notification to all registered users
                    </p>
                  </div>
                </div>
              )}

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">Type</label>
                <select
                  value={notificationData.type}
                  onChange={(e) =>
                    setNotificationData((prev) => ({ ...prev, type: e.target.value }))
                  }
                  className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 transition focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
                >
                  <option value="general">📢 General</option>
                  <option value="payment">💰 Payment</option>
                  <option value="withdrawal">💸 Withdrawal</option>
                  <option value="order">📦 Order Update</option>
                  <option value="promotion">🎁 Promotion</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">Title</label>
                <input
                  type="text"
                  value={notificationData.title}
                  onChange={(e) =>
                    setNotificationData((prev) => ({ ...prev, title: e.target.value }))
                  }
                  className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 transition focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
                  placeholder="Enter notification title"
                  maxLength={50}
                  required
                />
                <p className="mt-1 text-xs text-gray-500">{notificationData.title.length}/50</p>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">Message</label>
                <textarea
                  value={notificationData.message}
                  onChange={(e) =>
                    setNotificationData((prev) => ({ ...prev, message: e.target.value }))
                  }
                  className="w-full resize-none rounded-xl border-2 border-gray-200 px-4 py-3 transition focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
                  rows="4"
                  placeholder="Enter notification message"
                  maxLength={200}
                  required
                />
                <p className="mt-1 text-xs text-gray-500">{notificationData.message.length}/200</p>
              </div>

              {(notificationData.title || notificationData.message) && (
                <div className="rounded-xl border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-purple-100 p-4">
                  <p className="mb-3 text-sm font-medium text-purple-700">Preview:</p>
                  <div className="rounded-lg bg-white p-4 shadow-sm">
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-purple-100">
                        <Bell className="text-purple-600" size={18} />
                      </div>
                      <div className="flex-1">
                        <div className="mb-1 flex items-center gap-2">
                          <h4 className="font-semibold text-gray-900">
                            {notificationData.title || 'Title'}
                          </h4>
                          <span className="text-lg">{getTypeIcon(notificationData.type)}</span>
                        </div>
                        <p className="text-sm text-gray-600">
                          {notificationData.message || 'Message'}
                        </p>
                        <p className="mt-1 text-xs text-gray-400">Just now</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={resetNotificationModal}
                  className="flex-1 rounded-xl bg-gray-200 py-3 font-semibold text-gray-800 transition hover:bg-gray-300"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={sendingNotification}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-500 to-purple-600 py-3 font-semibold text-white transition hover:from-purple-600 hover:to-purple-700 disabled:opacity-50"
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