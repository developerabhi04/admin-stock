import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  fetchUsers,
  fetchUserStats,
  setFilters,
  setPage,
  setPageSize,
  deleteUser,
  resetDeleteStatus,
  clearDeleteError,
} from '../../store/slices/usersSlice';
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
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react';
import Loading from '../../components/Loader';

const formatCurrency = (value) =>
  `₹${Number(value || 0).toLocaleString('en-IN')}`;

const formatCompactLakh = (value) =>
  `₹${(Number(value || 0) / 100000).toFixed(1)}L`;

const formatDate = (value) => {
  if (!value) return '-';

  return new Date(value).toLocaleDateString('en-IN', {
    dateStyle: 'medium',
  });
};

const Users = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    users = [],
    listStatus,
    totalUsers = 0,
    totalWalletBalance = 0,
    totalPages = 0,
    currentPage = 1,
    pageSize = 20,
    stats,
    filters = {},
    error,
    deleteStatus,
    deleteError,
  } = useSelector((state) => state.users);

  const verifiedUsers = Number(stats?.verifiedUsers || 0);
  const totalInvested = Number(
    stats?.totalInvested ?? stats?.totalInvestedAmount ?? 0
  );

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
        page: currentPage,
        limit: pageSize,
        search: filters.search || '',
        sortBy: filters.sortBy || 'createdAt',
        sortOrder: filters.sortOrder || 'desc',
      })
    );
  }, [
    dispatch,
    currentPage,
    pageSize,
    filters.search,
    filters.sortBy,
    filters.sortOrder,
  ]);

  useEffect(() => {
    dispatch(fetchUserStats());
  }, [dispatch]);

  const pageNumbers = useMemo(() => {
    const maxVisiblePages = 5;
    const pages = [];

    let start = Math.max(
      1,
      currentPage - Math.floor(maxVisiblePages / 2)
    );

    let end = Math.min(
      totalPages,
      start + maxVisiblePages - 1
    );

    if (end - start + 1 < maxVisiblePages) {
      start = Math.max(1, end - maxVisiblePages + 1);
    }

    for (let page = start; page <= end; page += 1) {
      pages.push(page);
    }

    return pages;
  }, [currentPage, totalPages]);

  const handleSearch = (event) => {
    event.preventDefault();

    dispatch(
      setFilters({
        search: searchTerm.trim(),
        sortBy: filters.sortBy || 'createdAt',
        sortOrder: filters.sortOrder || 'desc',
      })
    );
  };

  const clearSearch = () => {
    setSearchTerm('');
    dispatch(
      setFilters({
        search: '',
        sortBy: filters.sortBy || 'createdAt',
        sortOrder: filters.sortOrder || 'desc',
      })
    );
  };

  const handleSort = (field) => {
    const newOrder =
      filters.sortBy === field && filters.sortOrder === 'desc'
        ? 'asc'
        : 'desc';

    dispatch(
      setFilters({
        search: filters.search || '',
        sortBy: field,
        sortOrder: newOrder,
      })
    );
  };

  const handlePageChange = (page) => {
    if (
      page < 1 ||
      page > totalPages ||
      page === currentPage
    ) {
      return;
    }

    dispatch(setPage(page));
  };

  const handlePageSizeChange = (event) => {
    dispatch(setPageSize(Number(event.target.value)));
  };

  const handleRefresh = () => {
    dispatch(
      fetchUsers({
        page: currentPage,
        limit: pageSize,
        search: filters.search || '',
        sortBy: filters.sortBy || 'createdAt',
        sortOrder: filters.sortOrder || 'desc',
      })
    );

    dispatch(fetchUserStats());
  };

  const exportToCSV = () => {
    if (!users.length) {
      alert('There are no users to export on this page.');
      return;
    }

    const headers = [
      'Name',
      'Phone',
      'Wallet Balance',
      'Invested',
      'Joined',
      'Verified',
    ];

    const rows = users.map((user) => [
      user.fullName || '',
      `${user.countryCode || ''} ${user.phoneNumber || ''}`.trim(),
      user.walletBalance || 0,
      user.totalInvested || 0,
      user.createdAt || '',
      user.isVerified ? 'Yes' : 'No',
    ]);

    const csv = [headers, ...rows]
      .map((row) =>
        row
          .map((value) => `"${String(value).replace(/"/g, '""')}"`)
          .join(',')
      )
      .join('\n');

    const blob = new Blob([csv], {
      type: 'text/csv;charset=utf-8;',
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `users-page-${currentPage}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const openNotificationModal = (user = null) => {
    setSelectedUser(user);
    setSendToAll(!user);
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

  const handleSubmitNotification = async (event) => {
    event.preventDefault();

    if (
      !notificationData.title.trim() ||
      !notificationData.message.trim()
    ) {
      alert('Please fill in all notification fields.');
      return;
    }

    try {
      setSendingNotification(true);

      if (sendToAll) {
        await adminAPI.sendNotificationToAll(notificationData);
        alert(`Notification sent to all ${totalUsers} users.`);
      } else if (selectedUser?._id) {
        await adminAPI.sendNotificationToUser(
          selectedUser._id,
          notificationData
        );
        alert(`Notification sent to ${selectedUser.fullName}.`);
      }

      resetNotificationModal();
    } catch (requestError) {
      alert(
        requestError.response?.data?.message ||
        'Failed to send notification.'
      );
    } finally {
      setSendingNotification(false);
    }
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

    const expectedName = (userToDelete.fullName || '')
      .trim()
      .toLowerCase();

    if (confirmText.trim().toLowerCase() !== expectedName) {
      return;
    }

    try {
      setDeletingUserId(userToDelete._id);
      await dispatch(deleteUser(userToDelete._id)).unwrap();

      closeDeleteModal();
      dispatch(fetchUserStats());

      // If the deleted user was the only user on the last page,
      // load the previous page.
      if (users.length === 1 && currentPage > 1) {
        dispatch(setPage(currentPage - 1));
      }
    } catch {
      // deleteError is displayed inside the modal from Redux state.
    } finally {
      setDeletingUserId(null);
    }
  };

  const SortHeader = ({ field, label }) => {
    const active = filters.sortBy === field;

    return (
      <th
        onClick={() => handleSort(field)}
        className="cursor-pointer select-none px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 hover:text-gray-800"
      >
        <div className="flex items-center gap-1.5">
          {label}
          {active ? (
            filters.sortOrder === 'asc' ? (
              <ChevronUp size={14} className="text-blue-600" />
            ) : (
              <ChevronDown size={14} className="text-blue-600" />
            )
          ) : (
            <ArrowUpDown size={13} className="text-gray-300" />
          )}
        </div>
      </th>
    );
  };

  if (listStatus === 'loading' && users.length === 0) {
    return <Loading message="Loading all users..." />;
  }

  if (listStatus === 'failed' && users.length === 0) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center px-4">
        <div className="mb-5 rounded-full bg-red-50 p-5">
          <AlertCircle className="text-red-500" size={46} />
        </div>
        <h2 className="mb-2 text-2xl font-bold text-gray-800">
          Failed to Load Users
        </h2>
        <p className="mb-5 max-w-md text-center text-gray-600">
          {error || 'Unable to load users.'}
        </p>
        <button
          onClick={handleRefresh}
          className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 font-semibold text-white hover:bg-blue-700"
          type="button"
        >
          <RefreshCw size={18} />
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-3 sm:p-5 lg:p-7">
      <div className="mb-6 flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
            Users Management
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage active users, balances and account actions
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => openNotificationModal()}
            className="flex items-center gap-2 rounded-xl bg-purple-600 px-4 py-2.5 font-semibold text-white hover:bg-purple-700"
            type="button"
          >
            <Bell size={18} />
            Notify All
          </button>

          <button
            onClick={handleRefresh}
            disabled={listStatus === 'loading'}
            className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            type="button"
          >
            <RefreshCw
              size={18}
              className={listStatus === 'loading' ? 'animate-spin' : ''}
            />
            Refresh
          </button>

          <button
            onClick={exportToCSV}
            className="flex items-center gap-2 rounded-xl bg-green-600 px-4 py-2.5 font-semibold text-white hover:bg-green-700"
            type="button"
          >
            <Download size={18} />
            Export Page
          </button>
        </div>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          icon={<UsersIcon size={22} />}
          label="Total Users"
          value={totalUsers}
          color="blue"
        />
        <StatCard
          icon={<ShieldCheck size={22} />}
          label="Verified Users"
          value={verifiedUsers}
          color="emerald"
        />
        <StatCard
          icon={<Wallet size={22} />}
          label="Total Wallet Balance"
          value={formatCompactLakh(totalWalletBalance)}
          color="green"
        />
        <StatCard
          icon={<TrendingUp size={22} />}
          label="Total Invested"
          value={formatCompactLakh(totalInvested)}
          color="indigo"
        />
      </div>

      <div className="mb-6 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:p-5">
        <div className="flex flex-col gap-3 md:flex-row">
          <form onSubmit={handleSearch} className="flex flex-1 gap-3">
            <div className="relative flex-1">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                size={19}
              />
              <input
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search by name or phone..."
                className="w-full rounded-xl border border-gray-200 py-3 pl-12 pr-4 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <button
              className="rounded-xl bg-blue-600 px-6 font-semibold text-white hover:bg-blue-700"
              type="submit"
            >
              Search
            </button>
          </form>

          <button
            onClick={() => setShowFilters((value) => !value)}
            className="flex items-center justify-center gap-2 rounded-xl bg-gray-100 px-5 py-3 font-semibold text-gray-700 hover:bg-gray-200"
            type="button"
          >
            <Filter size={18} />
            Sort
          </button>
        </div>

        {showFilters && (
          <div className="mt-4 flex flex-wrap gap-2 border-t border-gray-200 pt-4">
            <SortButton
              label="Date"
              onClick={() => handleSort('createdAt')}
            />
            <SortButton
              label="Name"
              onClick={() => handleSort('fullName')}
            />
            <SortButton
              label="Balance"
              onClick={() => handleSort('walletBalance')}
            />

            {filters.search && (
              <button
                onClick={clearSearch}
                className="flex items-center gap-1 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-600"
                type="button"
              >
                <X size={14} />
                Clear Search
              </button>
            )}
          </div>
        )}
      </div>

      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="flex flex-col justify-between gap-3 border-b border-gray-200 px-5 py-4 sm:flex-row sm:items-center">
          <div>
            <h2 className="font-bold text-gray-900">All Active Users</h2>
            <p className="text-sm text-gray-500">
              {totalUsers.toLocaleString('en-IN')} active users found
            </p>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span>Rows per page</span>
            <select
              value={pageSize}
              onChange={handlePageSizeChange}
              className="rounded-lg border border-gray-300 bg-white px-2 py-1.5 outline-none focus:border-blue-500"
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </div>
        </div>

        {users.length === 0 ? (
          <div className="p-12 text-center">
            <UsersIcon className="mx-auto mb-4 text-gray-300" size={58} />
            <h3 className="mb-2 text-xl font-bold text-gray-800">
              No Users Found
            </h3>
            <p className="text-gray-500">
              {filters.search
                ? 'Try adjusting your search criteria.'
                : 'No active users are available.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[850px]">
              <thead className="border-b border-gray-200 bg-gray-50">
                <tr>
                  <SortHeader field="fullName" label="User" />
                  <SortHeader
                    field="walletBalance"
                    label="Wallet Balance"
                  />
                  <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Invested
                  </th>
                  <SortHeader field="createdAt" label="Joined" />
                  <th className="px-5 py-3.5 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {users.map((user) => (
                  <tr key={user._id} className="transition hover:bg-gray-50">
                    <td className="px-5 py-4">
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
                              <CheckCircle2
                                size={14}
                                className="shrink-0 text-emerald-500"
                              />
                            )}
                          </div>
                          <p className="flex items-center gap-1 text-xs text-gray-500">
                            <Phone size={11} />
                            {user.countryCode || ''}{' '}
                            {user.phoneNumber || '-'}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-4 font-semibold text-gray-900">
                      {formatCurrency(user.walletBalance)}
                    </td>

                    <td className="px-5 py-4 font-semibold text-indigo-600">
                      {formatCurrency(user.totalInvested)}
                    </td>

                    <td className="px-5 py-4 text-sm text-gray-600">
                      <span className="flex items-center gap-1.5">
                        <CalendarDays size={14} className="text-gray-400" />
                        {formatDate(user.createdAt)}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <ActionButton
                          title="View user"
                          color="blue"
                          onClick={() =>
                            navigate(`/dashboard/users/${user._id}`)
                          }
                        >
                          <Eye size={16} />
                        </ActionButton>

                        <ActionButton
                          title="Send notification"
                          color="purple"
                          onClick={() => openNotificationModal(user)}
                        >
                          <Send size={16} />
                        </ActionButton>

                        <ActionButton
                          title="Delete user"
                          color="red"
                          disabled={deletingUserId === user._id}
                          onClick={() => openDeleteModal(user)}
                        >
                          {deletingUserId === user._id ? (
                            <Loader className="animate-spin" size={16} />
                          ) : (
                            <Trash2 size={16} />
                          )}
                        </ActionButton>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="flex flex-col items-center justify-between gap-4 border-t border-gray-200 bg-gray-50 px-5 py-4 sm:flex-row">
          <p className="text-sm text-gray-600">
            Showing{' '}
            <span className="font-bold text-gray-900">
              {users.length}
            </span>{' '}
            users on page{' '}
            <span className="font-bold text-gray-900">
              {currentPage}
            </span>{' '}
            of{' '}
            <span className="font-bold text-gray-900">
              {totalPages || 1}
            </span>{' '}
            — {totalUsers.toLocaleString('en-IN')} total users
          </p>

          <div className="flex items-center gap-1.5">
            <PageButton
              disabled={currentPage === 1}
              onClick={() => handlePageChange(1)}
              label="First page"
            >
              <ChevronsLeft size={16} />
            </PageButton>

            <PageButton
              disabled={currentPage === 1}
              onClick={() => handlePageChange(currentPage - 1)}
              label="Previous page"
            >
              <ChevronLeft size={16} />
            </PageButton>

            {pageNumbers[0] > 1 && (
              <span className="px-1 text-gray-400">...</span>
            )}

            {pageNumbers.map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`h-9 w-9 rounded-lg text-sm font-semibold transition ${page === currentPage
                  ? 'bg-blue-600 text-white'
                  : 'border border-gray-200 bg-white text-gray-700 hover:bg-gray-100'
                  }`}
                type="button"
              >
                {page}
              </button>
            ))}

            {pageNumbers[pageNumbers.length - 1] < totalPages && (
              <span className="px-1 text-gray-400">...</span>
            )}

            <PageButton
              disabled={currentPage >= totalPages || totalPages === 0}
              onClick={() => handlePageChange(currentPage + 1)}
              label="Next page"
            >
              <ChevronRight size={16} />
            </PageButton>

            <PageButton
              disabled={currentPage >= totalPages || totalPages === 0}
              onClick={() => handlePageChange(totalPages)}
              label="Last page"
            >
              <ChevronsRight size={16} />
            </PageButton>
          </div>
        </div>
      </div>

      {showNotificationModal && (
        <Modal
          title={sendToAll ? 'Broadcast to All Users' : 'Send Notification'}
          onClose={resetNotificationModal}
        >
          <form onSubmit={handleSubmitNotification} className="space-y-4">
            <div className="rounded-xl border border-purple-200 bg-purple-50 p-3 text-sm text-purple-800">
              {sendToAll
                ? `This notification will be sent to all ${totalUsers} active users.`
                : `Recipient: ${selectedUser?.fullName || '-'}`}
            </div>

            <select
              value={notificationData.type}
              onChange={(event) =>
                setNotificationData((previous) => ({
                  ...previous,
                  type: event.target.value,
                }))
              }
              className="w-full rounded-xl border border-gray-200 px-4 py-3"
            >
              <option value="general">General</option>
              <option value="payment">Payment</option>
              <option value="withdrawal">Withdrawal</option>
              <option value="order">Order Update</option>
              <option value="promotion">Promotion</option>
            </select>

            <input
              required
              maxLength={50}
              value={notificationData.title}
              onChange={(event) =>
                setNotificationData((previous) => ({
                  ...previous,
                  title: event.target.value,
                }))
              }
              placeholder="Notification title"
              className="w-full rounded-xl border border-gray-200 px-4 py-3"
            />

            <textarea
              required
              maxLength={200}
              rows={5}
              value={notificationData.message}
              onChange={(event) =>
                setNotificationData((previous) => ({
                  ...previous,
                  message: event.target.value,
                }))
              }
              placeholder="Notification message"
              className="w-full resize-none rounded-xl border border-gray-200 px-4 py-3"
            />

            <div className="flex gap-3">
              <button
                type="button"
                onClick={resetNotificationModal}
                className="flex-1 rounded-xl bg-gray-200 py-3 font-semibold text-gray-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={sendingNotification}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-purple-600 py-3 font-semibold text-white disabled:opacity-50"
              >
                {sendingNotification && (
                  <Loader className="animate-spin" size={17} />
                )}
                {sendingNotification ? 'Sending...' : 'Send Notification'}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {showDeleteModal && userToDelete && (
        <Modal title="Delete User Permanently" onClose={closeDeleteModal}>
          <div className="space-y-4">
            <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
              <p className="font-bold text-gray-900">
                {userToDelete.fullName}
              </p>
              <p className="text-sm text-gray-500">
                {userToDelete.phoneNumber}
              </p>
              <p className="mt-1 text-sm font-semibold text-gray-700">
                Wallet: {formatCurrency(userToDelete.walletBalance)}
              </p>
            </div>

            <div className="flex gap-2 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              <ShieldAlert size={18} className="shrink-0" />
              <span>
                This permanently deletes the profile, bank accounts,
                deposits, withdrawals, transactions and investments.
              </span>
            </div>

            <label className="block text-sm font-medium text-gray-700">
              Type{' '}
              <span className="font-bold text-gray-900">
                {userToDelete.fullName}
              </span>{' '}
              to confirm.
              <input
                autoFocus
                value={confirmText}
                onChange={(event) => setConfirmText(event.target.value)}
                placeholder="Enter full name exactly"
                className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3"
              />
            </label>

            {deleteError && (
              <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                {deleteError}
              </div>
            )}

            <div className="flex gap-3">
              <button
                type="button"
                onClick={closeDeleteModal}
                className="flex-1 rounded-xl bg-gray-200 py-3 font-semibold text-gray-800"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={
                  deleteStatus === 'loading' ||
                  confirmText.trim().toLowerCase() !==
                  userToDelete.fullName.trim().toLowerCase()
                }
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-red-600 py-3 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
              >
                {deleteStatus === 'loading' ? (
                  <Loader className="animate-spin" size={18} />
                ) : (
                  <>
                    <Trash2 size={17} />
                    Delete Permanently
                  </>
                )}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

const StatCard = ({ icon, label, value, color }) => {
  const colors = {
    blue: {
      box: 'bg-blue-100 text-blue-600',
      value: 'text-blue-600',
    },
    emerald: {
      box: 'bg-emerald-100 text-emerald-600',
      value: 'text-emerald-600',
    },
    green: {
      box: 'bg-green-100 text-green-600',
      value: 'text-green-600',
    },
    indigo: {
      box: 'bg-indigo-100 text-indigo-600',
      value: 'text-indigo-600',
    },
  };

  const style = colors[color] || colors.blue;

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <div
        className={`mb-3 flex h-11 w-11 items-center justify-center rounded-xl ${style.box}`}
      >
        {icon}
      </div>
      <p className="text-sm text-gray-500">{label}</p>
      <p className={`mt-1 text-2xl font-bold ${style.value}`}>
        {value}
      </p>
    </div>
  );
};

const SortButton = ({ label, onClick }) => (
  <button
    onClick={onClick}
    className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
    type="button"
  >
    Sort by {label}
  </button>
);

const ActionButton = ({ children, title, color, onClick, disabled }) => {
  const colors = {
    blue: 'bg-blue-50 text-blue-600 hover:bg-blue-100',
    purple: 'bg-purple-50 text-purple-600 hover:bg-purple-100',
    red: 'bg-red-50 text-red-600 hover:bg-red-100',
  };

  return (
    <button
      title={title}
      onClick={onClick}
      disabled={disabled}
      className={`flex h-9 w-9 items-center justify-center rounded-lg transition disabled:opacity-50 ${colors[color]}`}
      type="button"
    >
      {children}
    </button>
  );
};

const PageButton = ({ children, onClick, disabled, label }) => (
  <button
    type="button"
    aria-label={label}
    onClick={onClick}
    disabled={disabled}
    className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
  >
    {children}
  </button>
);

const Modal = ({ title, onClose, children }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
    <div className="flex max-h-[92vh] w-full max-w-md flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
      <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
        <h3 className="text-lg font-bold text-gray-900">{title}</h3>
        <button
          onClick={onClose}
          type="button"
          className="rounded-lg p-1 text-gray-400 hover:bg-gray-100"
          aria-label="Close modal"
        >
          <X size={21} />
        </button>
      </div>
      <div className="overflow-y-auto p-5">{children}</div>
    </div>
  </div>
);

export default Users;