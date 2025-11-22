import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsers, setFilters } from '../store/slices/usersSlice';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Users as UsersIcon,
  Wallet,
  TrendingUp,
  Eye,
  RefreshCw,
  Filter,
  Download,
  AlertCircle,
  ArrowUpDown
} from 'lucide-react';

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
    filters,
    error
  } = useSelector((state) => state.users);

  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    console.log('📊 Loading users...');
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

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="relative">
          <div className="w-20 h-20 border-4 border-blue-200 rounded-full"></div>
          <div className="w-20 h-20 border-4 border-blue-500 rounded-full animate-spin border-t-transparent absolute top-0"></div>
        </div>
        <p className="mt-6 text-gray-600 font-medium animate-pulse">Loading users...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen px-4">
        <div className="bg-red-50 rounded-full p-6 mb-6">
          <AlertCircle className="text-red-500" size={64} />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Failed to Load Users</h2>
        <p className="text-gray-600 mb-6 text-center max-w-md">{error}</p>
        <button
          onClick={handleRefresh}
          className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-xl font-medium transition flex items-center space-x-2"
        >
          <RefreshCw size={20} />
          <span>Try Again</span>
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-500 mt-2">Monitor and manage all user accounts</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={handleRefresh}
            className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg transition flex items-center space-x-2"
          >
            <RefreshCw size={18} />
            <span>Refresh</span>
          </button>
          <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition flex items-center space-x-2">
            <Download size={18} />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Stats Cards with Gradient */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-xl p-6 text-white transform hover:scale-105 transition duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium mb-1">Total Users</p>
              <p className="text-4xl font-bold">{totalUsers || 0}</p>
              <p className="text-blue-100 text-xs mt-2">Active accounts</p>
            </div>
            <div className="bg-white bg-opacity-20 w-14 h-14 rounded-xl flex items-center justify-center">
              <UsersIcon size={28} />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl shadow-xl p-6 text-white transform hover:scale-105 transition duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm font-medium mb-1">Wallet Balance</p>
              <p className="text-3xl font-bold">₹{(totalWalletBalance || 0).toLocaleString()}</p>
              <p className="text-green-100 text-xs mt-2">Withdrawable</p>
            </div>
            <div className="bg-white bg-opacity-20 w-14 h-14 rounded-xl flex items-center justify-center">
              <Wallet size={28} />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl shadow-xl p-6 text-white transform hover:scale-105 transition duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm font-medium mb-1">Bonus Balance</p>
              <p className="text-3xl font-bold">₹{(totalBonusBalance || 0).toLocaleString()}</p>
              <p className="text-purple-100 text-xs mt-2">Non-withdrawable</p>
            </div>
            <div className="bg-white bg-opacity-20 w-14 h-14 rounded-xl flex items-center justify-center">
              <TrendingUp size={28} />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl shadow-xl p-6 text-white transform hover:scale-105 transition duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm font-medium mb-1">Grand Total</p>
              <p className="text-3xl font-bold">₹{(grandTotal || 0).toLocaleString()}</p>
              <p className="text-orange-100 text-xs mt-2">Combined balance</p>
            </div>
            <div className="bg-white bg-opacity-20 w-14 h-14 rounded-xl flex items-center justify-center">
              <Wallet size={28} />
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
          <form onSubmit={handleSearch} className="flex-1">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by name or phone number..."
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
            </div>
          </form>
          <button
            type="submit"
            onClick={handleSearch}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-xl font-medium transition flex items-center justify-center space-x-2 whitespace-nowrap"
          >
            <Search size={18} />
            <span>Search</span>
          </button>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-xl font-medium transition flex items-center justify-center space-x-2 whitespace-nowrap"
          >
            <Filter size={18} />
            <span>Filters</span>
          </button>
        </div>

        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <button
                onClick={() => handleSort('createdAt')}
                className="bg-gray-50 hover:bg-gray-100 px-4 py-2 rounded-lg text-sm font-medium transition"
              >
                Sort by Date
              </button>
              <button
                onClick={() => handleSort('walletBalance')}
                className="bg-gray-50 hover:bg-gray-100 px-4 py-2 rounded-lg text-sm font-medium transition"
              >
                Sort by Balance
              </button>
              <button
                onClick={() => handleSort('fullName')}
                className="bg-gray-50 hover:bg-gray-100 px-4 py-2 rounded-lg text-sm font-medium transition"
              >
                Sort by Name
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Users Table */}
      {!users || users.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-16 text-center">
          <div className="bg-gray-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <UsersIcon className="text-gray-400" size={40} />
          </div>
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
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition"
            >
              Clear Search
            </button>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left">
                    <button
                      onClick={() => handleSort('fullName')}
                      className="flex items-center space-x-2 text-xs font-semibold text-gray-600 uppercase tracking-wider hover:text-blue-600 transition"
                    >
                      <span>User</span>
                      <ArrowUpDown size={14} />
                    </button>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Phone
                  </th>
                  <th className="px-6 py-4 text-left">
                    <button
                      onClick={() => handleSort('walletBalance')}
                      className="flex items-center space-x-2 text-xs font-semibold text-gray-600 uppercase tracking-wider hover:text-blue-600 transition"
                    >
                      <span>Wallet</span>
                      <ArrowUpDown size={14} />
                    </button>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Bonus
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {users.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                          {user.fullName?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{user.fullName}</p>
                          <p className="text-xs text-gray-500">
                            {new Date(user.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-mono text-sm text-gray-700">{user.phoneNumber}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-bold text-green-600 text-lg">
                        ₹{(user.walletBalance || 0).toLocaleString()}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-bold text-purple-600 text-lg">
                        ₹{(user.bonusBalance || 0).toLocaleString()}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-bold text-blue-600 text-lg">
                        ₹{(user.totalBalance || 0).toLocaleString()}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                          user.isVerified
                            ? 'bg-green-100 text-green-700'
                            : 'bg-yellow-100 text-yellow-700'
                        }`}
                      >
                        {user.isVerified ? '✓ Verified' : '⏳ Pending'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => navigate(`/dashboard/users/${user._id}`)}
                        className="bg-blue-50 hover:bg-blue-100 text-blue-600 px-4 py-2 rounded-lg font-medium transition flex items-center space-x-2"
                      >
                        <Eye size={16} />
                        <span>View</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Pagination (if needed) */}
      {users && users.length > 0 && (
        <div className="flex items-center justify-between bg-white rounded-2xl shadow-sm border border-gray-200 px-6 py-4">
          <p className="text-sm text-gray-600">
            Showing <span className="font-semibold">{users.length}</span> of{' '}
            <span className="font-semibold">{totalUsers}</span> users
          </p>
          <div className="flex items-center space-x-2">
            {/* Add pagination buttons here if needed */}
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;
