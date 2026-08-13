import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchUsers,
  fetchUserStats,
  setFilters,
  deleteUser,
  resetDeleteStatus,
  clearDeleteError,
} from '../../store/slices/usersSlice';
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
  CheckCircle2,
  TrendingUp,
  CalendarDays,
  Phone,
  Trash2,
  ShieldAlert,
  ArrowUpDown,
  ChevronUp,
  ChevronDown,
  ShieldCheck,
} from 'lucide-react';
import Loading from '../../components/Loader';

const formatCurrency = (value) => `₹${Number(value || 0).toLocaleString('en-IN')}`;
const formatCompactLakh = (value) => `₹${(Number(value || 0) / 100000).toFixed(1)}L`;

const Users = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    users = [],
    listStatus,
    totalUsers = 0,
    totalWalletBalance = 0,
    stats,
    filters = {},
    error,
    deleteStatus,
    deleteError,
  } = useSelector((state) => state.users);

  const verifiedUsers = Number(stats?.verifiedUsers || 0);
  const totalInterestEarned = Number(stats?.totalInterestEarned || 0);
  const totalInvestedAmountAllUsers = Number(stats?.totalInvestedAmount || 0);

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

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [confirmText, setConfirmText] = useState('');
  const [deletingUserId, setDeletingUserId] = useState(null);

  useEffect(() => {
    dispatch(
      fetchUsers({
        page: 1,
        limit: 20,
        search: filters.search || '',
        sortBy: filters.sortBy || 'createdAt',
        sortOrder: filters.sortOrder || 'desc',
      })
    );
  }, [dispatch, filters.search, filters.sortBy, filters.sortOrder]);

  useEffect(() => {
    dispatch(fetchUserStats());
  }, [dispatch]);

  const handleSearch = (e) => {
    e.preventDefault();
    dispatch(setFilters({ search: searchTerm, sortBy: filters.sortBy, sortOrder: filters.sortOrder }));
  };

  const handleSort = (field) => {
    const newOrder =
      filters.sortBy === field && filters.sortOrder === 'desc' ? 'asc' : 'desc';
    dispatch(setFilters({ sortBy: field, sortOrder: newOrder, search: filters.search || '' }));
  };

  const handleRefresh = () => {
    dispatch(
      fetchUsers({
        page: 1,
        limit: 20,
        search: filters.search || '',
        sortBy: filters.sortBy || 'createdAt',
        sortOrder: filters.sortOrder || 'desc',
      })
    );
    dispatch(fetchUserStats());
  };

  const openNotificationModal = (user = null) => {
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
    setNotificationData({ title: '', message: '', type: 'general' });
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

  const openDeleteModal = (user) => {
    setUserToDelete(user);
    setConfirmText('');
    dispatch(clearDeleteError());
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setUserToDelete(null);
    setConfirmText('');
    setDeletingUserId(null);
    dispatch(resetDeleteStatus());
  };

  const handleConfirmDelete = async () => {
    if (!userToDelete?._id) return;

    const expected = (userToDelete.fullName || '').trim().toLowerCase();
    if (confirmText.trim().toLowerCase() !== expected) {
      alert('Name does not match. Please type the exact full name to confirm.');
      return;
    }

    try {
      setDeletingUserId(userToDelete._id);
      await dispatch(deleteUser(userToDelete._id)).unwrap();
      alert(`✅ ${userToDelete.fullName} and all related data deleted successfully.`);
      closeDeleteModal();
      dispatch(fetchUserStats());
    } catch (err) {
      alert(err || 'Failed to delete user');
    } finally {
      setDeletingUserId(null);
    }
  };

  const SortHeader = ({ field, label, className = '' }) => {
    const isActive = filters.sortBy === field;
    return (
      <th
        onClick={() => handleSort(field)}
        className={`cursor-pointer select-none px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 transition hover:text-gray-800 ${className}`}
      >
        <div className="flex items-center gap-1.5">
          {label}
          {isActive ? (
            filters.sortOrder === 'asc' ? (
              <ChevronUp size={13} className="text-blue-600" />
            ) : (
              <ChevronDown size={13} className="text-blue-600" />
            )
          ) : (
            <ArrowUpDown size={12} className="text-gray-300" />
          )}
        </div>
      </th>
    );
  };

  if (listStatus === 'loading') {
    return <Loading message="Loading all users..." />;
  }

  if (listStatus === 'failed') {
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
    <div className="min-h-screen bg-gray-50 p-3 sm:p-4 lg:p-6">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">Users Management</h1>
          <p className="mt-1 text-sm text-gray-600 sm:text-base">{totalUsers} registered users</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => openNotificationModal(null)}
            className="flex items-center gap-2 rounded-xl bg-purple-600 px-4 py-2.5 font-semibold text-white shadow-sm transition hover:bg-purple-700"
            type="button"
          >
            <Bell size={18} />
            Notify All
          </button>

          <button
            onClick={handleRefresh}
            disabled={listStatus === 'loading'}
            className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 font-semibold text-gray-700 transition hover:bg-gray-50 disabled:opacity-50"
            type="button"
          >
            <RefreshCw size={18} className={listStatus === 'loading' ? 'animate-spin' : ''} />
            Refresh
          </button>

          <button
            onClick={exportToCSV}
            className="flex items-center gap-2 rounded-xl bg-green-600 px-4 py-2.5 font-semibold text-white shadow-sm transition hover:bg-green-700"
            type="button"
          >
            <Download size={18} />
            Export
          </button>
        </div>
      </div>

      {/* Stat cards - clean, non-redundant */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-lg bg-blue-100">
            <UsersIcon className="text-blue-600" size={22} />
          </div>
          <p className="text-sm text-gray-600">Total Users</p>
          <p className="mt-1 text-2xl font-bold text-gray-900">{totalUsers}</p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-lg bg-emerald-100">
            <ShieldCheck className="text-emerald-600" size={22} />
          </div>
          <p className="text-sm text-gray-600">Verified Users</p>
          <p className="mt-1 text-2xl font-bold text-emerald-600">{verifiedUsers}</p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-lg bg-green-100">
            <Wallet className="text-green-600" size={22} />
          </div>
          <p className="text-sm text-gray-600">Total Wallet Balance</p>
          <p className="mt-1 text-2xl font-bold text-green-600">{formatCompactLakh(totalWalletBalance)}</p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-lg bg-indigo-100">
            <TrendingUp className="text-indigo-600" size={22} />
          </div>
          <p className="text-sm text-gray-600">Total Invested</p>
          <p className="mt-1 text-2xl font-bold text-indigo-600">
            {formatCompactLakh(totalInvestedAmountAllUsers)}
          </p>
        </div>
      </div>

      {/* Search + Filters */}
      <div className="mb-6 rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:p-6">
        <div className="flex flex-col gap-3 md:flex-row">
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
                placeholder="Search by name or phone..."
                className="w-full rounded-xl border border-gray-200 py-3 pl-12 pr-4 transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <button
              type="submit"
              className="whitespace-nowrap rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
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
            Sort
          </button>
        </div>

        {showFilters && (
          <div className="mt-6 border-t border-gray-200 pt-6">
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => handleSort('createdAt')}
                className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-2 font-medium transition hover:bg-gray-100"
                type="button"
              >
                📅 By Date
              </button>
              <button
                onClick={() => handleSort('walletBalance')}
                className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-2 font-medium transition hover:bg-gray-100"
                type="button"
              >
                💰 By Balance
              </button>
              <button
                onClick={() => handleSort('fullName')}
                className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-2 font-medium transition hover:bg-gray-100"
                type="button"
              >
                👤 By Name
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Users Table */}
      {!users || users.length === 0 ? (
        <div className="rounded-xl border border-gray-200 bg-white p-12 text-center shadow-sm">
          <UsersIcon className="mx-auto mb-4 text-gray-400" size={64} />
          <h3 className="mb-2 text-2xl font-bold text-gray-800">No Users Found</h3>
          <p className="mb-6 text-gray-500">
            {searchTerm ? 'Try adjusting your search criteria' : 'No users have signed up yet'}
          </p>

          {searchTerm && (
            <button
              onClick={() => {
                setSearchTerm('');
                dispatch(setFilters({ search: '', sortBy: filters.sortBy, sortOrder: filters.sortOrder }));
              }}
              className="rounded-xl bg-blue-500 px-6 py-3 font-semibold text-white transition hover:bg-blue-600"
              type="button"
            >
              Clear Search
            </button>
          )}
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-gray-200 bg-gray-50">
                <tr>
                  <SortHeader field="fullName" label="User" />
                  <SortHeader field="walletBalance" label="Wallet Balance" />
                  <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Invested
                  </th>
                  <SortHeader field="createdAt" label="Joined" />
                  <th className="px-6 py-3.5 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {users.map((user) => (
                  <tr key={user._id} className="transition hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">
                          {user.fullName?.charAt(0)?.toUpperCase() || 'U'}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <p className="truncate font-semibold text-gray-900">
                              {user.fullName || 'Unknown User'}
                            </p>
                            {user.isVerified && (
                              <CheckCircle2 size={14} className="shrink-0 text-emerald-500" />
                            )}
                          </div>
                          <p className="flex items-center gap-1 text-xs text-gray-500">
                            <Phone size={11} />
                            {user.countryCode || ''} {user.phoneNumber || '-'}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-semibold text-gray-900">
                        {formatCurrency(user.walletBalance || 0)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-medium text-indigo-600">
                        {formatCurrency(user.totalInvested || 0)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="flex items-center gap-1.5 text-sm text-gray-600">
                        <CalendarDays size={13} className="text-gray-400" />
                        {user.createdAt
                          ? new Date(user.createdAt).toLocaleDateString('en-IN', {
                            dateStyle: 'medium',
                          })
                          : '-'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => navigate(`/dashboard/users/${user._id}`)}
                          title="View"
                          className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600 transition hover:bg-blue-100"
                          type="button"
                        >
                          <Eye size={16} />
                        </button>

                        <button
                          onClick={() => openNotificationModal(user)}
                          title="Notify"
                          className="flex h-9 w-9 items-center justify-center rounded-lg bg-purple-50 text-purple-600 transition hover:bg-purple-100"
                          type="button"
                        >
                          <Send size={16} />
                        </button>

                        <button
                          onClick={() => openDeleteModal(user)}
                          disabled={deletingUserId === user._id}
                          title="Delete"
                          className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-50 text-red-600 transition hover:bg-red-100 disabled:opacity-50"
                          type="button"
                        >
                          {deletingUserId === user._id ? (
                            <Loader className="animate-spin" size={16} />
                          ) : (
                            <Trash2 size={16} />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between border-t border-gray-200 bg-gray-50 px-6 py-4">
            <p className="text-sm text-gray-600">
              Showing <span className="font-bold text-gray-900">{users.length}</span> of{' '}
              <span className="font-bold text-gray-900">{totalUsers}</span> users
            </p>
          </div>
        </div>
      )}

      {/* Notification Modal */}
      {showNotificationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-2 sm:p-4 backdrop-blur-sm">
          <div className="flex max-h-[92vh] w-full max-w-md flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-200 px-4 py-4 sm:px-6">
              <div className="min-w-0">
                <h3 className="flex items-center gap-2 text-lg font-bold text-gray-900 sm:text-xl">
                  {sendToAll ? (
                    <Bell className="text-purple-600" size={22} />
                  ) : (
                    <Send className="text-purple-600" size={22} />
                  )}
                  <span className="truncate">{sendToAll ? 'Broadcast to All' : 'Send Notification'}</span>
                </h3>
                <p className="mt-1 truncate text-sm text-gray-600">
                  {sendToAll ? `To: All ${totalUsers} users` : `To: ${selectedUser?.fullName}`}
                </p>
              </div>

              <button
                onClick={resetNotificationModal}
                className="rounded-lg p-1 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
                type="button"
                aria-label="Close modal"
              >
                <X size={22} />
              </button>
            </div>

            <form onSubmit={handleSubmitNotification} className="flex-1 overflow-y-auto px-4 py-4 sm:px-6">
              <div className="space-y-4">
                {!sendToAll && selectedUser && (
                  <div className="rounded-xl border border-blue-200 bg-blue-50 p-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-600 text-lg font-bold text-white">
                        {selectedUser.fullName?.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <p className="truncate font-bold text-gray-900">{selectedUser.fullName}</p>
                        <p className="truncate text-sm text-gray-600">{selectedUser.phoneNumber}</p>
                      </div>
                    </div>
                  </div>
                )}

                {sendToAll && (
                  <div className="flex items-start gap-3 rounded-xl border border-yellow-200 bg-yellow-50 p-4">
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
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 transition focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
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
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 transition focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
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
                    className="min-h-[120px] w-full resize-y rounded-xl border border-gray-200 px-4 py-3 transition focus:border-purple-500 focus:ring-2 focus:ring-purple-100 sm:min-h-[140px]"
                    rows="5"
                    placeholder="Enter notification message"
                    maxLength={200}
                    required
                  />
                  <p className="mt-1 text-xs text-gray-500">{notificationData.message.length}/200</p>
                </div>

                {(notificationData.title || notificationData.message) && (
                  <div className="rounded-xl border border-purple-200 bg-purple-50 p-4">
                    <p className="mb-3 text-sm font-medium text-purple-700">Preview:</p>
                    <div className="rounded-lg bg-white p-4 shadow-sm">
                      <div className="flex items-start gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-purple-100">
                          <Bell className="text-purple-600" size={18} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="mb-1 flex items-center gap-2">
                            <h4 className="truncate font-semibold text-gray-900">
                              {notificationData.title || 'Title'}
                            </h4>
                            <span className="text-lg">{getTypeIcon(notificationData.type)}</span>
                          </div>
                          <p className="break-words text-sm text-gray-600">
                            {notificationData.message || 'Message'}
                          </p>
                          <p className="mt-1 text-xs text-gray-400">Just now</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </form>

            <div className="border-t border-gray-200 bg-white px-4 py-4 sm:px-6">
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={resetNotificationModal}
                  className="flex-1 rounded-xl bg-gray-200 py-3 font-semibold text-gray-800 transition hover:bg-gray-300"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  form=""
                  disabled={sendingNotification}
                  onClick={handleSubmitNotification}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-purple-600 py-3 font-semibold text-white transition hover:bg-purple-700 disabled:opacity-50"
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
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && userToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-2 sm:p-4 backdrop-blur-sm">
          <div className="flex w-full max-w-md flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-200 px-4 py-4 sm:px-6">
              <div className="flex items-center gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
                  <ShieldAlert className="text-red-600" size={22} />
                </div>
                <h3 className="text-lg font-bold text-gray-900 sm:text-xl">Delete User</h3>
              </div>

              <button
                onClick={closeDeleteModal}
                className="rounded-lg p-1 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
                type="button"
                aria-label="Close modal"
              >
                <X size={22} />
              </button>
            </div>

            <div className="space-y-4 px-4 py-4 sm:px-6">
              <div className="flex items-center gap-3 rounded-xl border border-gray-200 bg-gray-50 p-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-600 text-lg font-bold text-white">
                  {userToDelete.fullName?.charAt(0)?.toUpperCase() || 'U'}
                </div>
                <div className="min-w-0">
                  <p className="truncate font-bold text-gray-900">{userToDelete.fullName}</p>
                  <p className="truncate text-sm text-gray-600">{userToDelete.phoneNumber}</p>
                  <p className="text-sm font-medium text-gray-700">
                    Wallet: {formatCurrency(userToDelete.walletBalance || 0)}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4">
                <AlertCircle className="mt-0.5 shrink-0 text-red-600" size={20} />
                <div>
                  <p className="font-bold text-red-900">This action is permanent</p>
                  <p className="mt-1 text-sm text-red-700">
                    Deleting this user will permanently remove their profile, bank accounts,
                    all deposits, withdrawals, transactions, and investment/order history.
                    This cannot be undone.
                  </p>
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Type <span className="font-bold text-gray-900">{userToDelete.fullName}</span> to confirm
                </label>
                <input
                  type="text"
                  value={confirmText}
                  onChange={(e) => setConfirmText(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 transition focus:border-red-500 focus:ring-2 focus:ring-red-100"
                  placeholder="Enter full name exactly"
                  autoFocus
                />
              </div>

              {deleteError && (
                <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                  {deleteError}
                </div>
              )}
            </div>

            <div className="border-t border-gray-200 bg-white px-4 py-4 sm:px-6">
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={closeDeleteModal}
                  className="flex-1 rounded-xl bg-gray-200 py-3 font-semibold text-gray-800 transition hover:bg-gray-300"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={handleConfirmDelete}
                  disabled={
                    deleteStatus === 'loading' ||
                    confirmText.trim().toLowerCase() !== (userToDelete.fullName || '').trim().toLowerCase()
                  }
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-red-600 py-3 font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {deleteStatus === 'loading' ? (
                    <>
                      <Loader className="animate-spin" size={18} />
                      Deleting...
                    </>
                  ) : (
                    <>
                      <Trash2 size={18} />
                      Delete Permanently
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;