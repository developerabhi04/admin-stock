import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchDashboardStats } from '../store/slices/dashboardSlice';
import { fetchUsers } from '../store/slices/usersSlice';
import {
    Users,
    Clock,
    CheckCircle,
    TrendingUp,
    Wallet,
    TrendingDown,
    DollarSign,
    Activity,
    AlertCircle,
    ArrowRight,
    RefreshCw
} from 'lucide-react';

const Dashboard = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { stats, loading: dashboardLoading } = useSelector((state) => state.dashboard);
    const {
        totalUsers,
        totalWalletBalance,
        totalBonusBalance,
        grandTotal,
        totalWithdrawals,
        pendingWithdrawals,
        filters,
    } = useSelector((state) => state.users);

    useEffect(() => {
        console.log('📊 Loading dashboard...');
        dispatch(fetchDashboardStats());
        dispatch(fetchUsers({ page: 1, limit: 20, ...filters }));
    }, [dispatch, filters]);

    const handleRefresh = () => {
        dispatch(fetchDashboardStats());
        dispatch(fetchUsers({ page: 1, limit: 20, ...filters }));
    };

    if (dashboardLoading) {
        return (
            <div className="flex flex-col items-center justify-center h-screen">
                <div className="relative">
                    <div className="w-20 h-20 border-4 border-blue-200 rounded-full"></div>
                    <div className="w-20 h-20 border-4 border-blue-500 rounded-full animate-spin border-t-transparent absolute top-0"></div>
                </div>
                <p className="mt-6 text-gray-600 font-medium animate-pulse">Loading dashboard...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header Section */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-4xl font-bold text-gray-900">Dashboard Overview</h1>
                    <p className="text-gray-500 mt-2">
                        Welcome back! {"Here's what's"} happening with your platform today.
                    </p>
                </div>
                <button
                    onClick={handleRefresh}
                    className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg transition flex items-center space-x-2"
                >
                    <RefreshCw size={18} />
                    <span>Refresh</span>
                </button>
            </div>

            {/* Main Stats Grid - 6 Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
                {/* Total Users */}
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-xl p-6 text-white transform hover:scale-105 transition duration-300 cursor-pointer"
                    onClick={() => navigate('/dashboard/users')}>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-blue-100 text-sm font-medium mb-1">Total Users</p>
                            <p className="text-4xl font-bold">{totalUsers || 0}</p>
                            <p className="text-blue-100 text-xs mt-2">Active accounts</p>
                        </div>
                        <div className="bg-white bg-opacity-20 w-14 h-14 rounded-xl flex items-center justify-center">
                            <Users size={28} />
                        </div>
                    </div>
                </div>

                {/* Wallet Balance */}
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

                {/* Bonus Balance */}
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

                {/* Completed Withdrawals */}
                <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-2xl shadow-xl p-6 text-white transform hover:scale-105 transition duration-300 cursor-pointer"
                    onClick={() => navigate('/dashboard/withdrawals')}>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-red-100 text-sm font-medium mb-1">Completed</p>
                            <p className="text-3xl font-bold">₹{(totalWithdrawals || 0).toLocaleString()}</p>
                            <p className="text-red-100 text-xs mt-2">Withdrawals paid</p>
                        </div>
                        <div className="bg-white bg-opacity-20 w-14 h-14 rounded-xl flex items-center justify-center">
                            <TrendingDown size={28} />
                        </div>
                    </div>
                </div>

                {/* Pending Withdrawals */}
                <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-2xl shadow-xl p-6 text-white transform hover:scale-105 transition duration-300 cursor-pointer"
                    onClick={() => navigate('/dashboard/withdrawals')}>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-yellow-100 text-sm font-medium mb-1">Pending</p>
                            <p className="text-3xl font-bold">₹{(pendingWithdrawals || 0).toLocaleString()}</p>
                            <p className="text-yellow-100 text-xs mt-2">Awaiting approval</p>
                        </div>
                        <div className="bg-white bg-opacity-20 w-14 h-14 rounded-xl flex items-center justify-center">
                            <Clock size={28} />
                        </div>
                    </div>
                </div>

                {/* Grand Total */}
                <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl shadow-xl p-6 text-white transform hover:scale-105 transition duration-300">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-orange-100 text-sm font-medium mb-1">Grand Total</p>
                            <p className="text-3xl font-bold">₹{(grandTotal || 0).toLocaleString()}</p>
                            <p className="text-orange-100 text-xs mt-2">Combined balance</p>
                        </div>
                        <div className="bg-white bg-opacity-20 w-14 h-14 rounded-xl flex items-center justify-center">
                            <DollarSign size={28} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Secondary Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Pending Payments */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition cursor-pointer"
                    onClick={() => navigate('/dashboard/payments')}>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 text-sm font-medium mb-1">Pending Payments</p>
                            <p className="text-3xl font-bold text-gray-900 mt-2">
                                {stats?.pendingPayments || 0}
                            </p>
                            <p className="text-xs text-orange-600 mt-2 flex items-center">
                                <AlertCircle size={12} className="mr-1" />
                                Requires action
                            </p>
                        </div>
                        <div className="bg-yellow-100 w-14 h-14 rounded-xl flex items-center justify-center">
                            <Clock className="text-yellow-600" size={28} />
                        </div>
                    </div>
                </div>

                {/* Pending Withdrawals Count */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition cursor-pointer"
                    onClick={() => navigate('/dashboard/pending-withdrawals')}>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 text-sm font-medium mb-1">Pending Withdrawals</p>
                            <p className="text-3xl font-bold text-gray-900 mt-2">
                                {stats?.pendingWithdrawals || 0}
                            </p>
                            <p className="text-xs text-orange-600 mt-2 flex items-center">
                                <AlertCircle size={12} className="mr-1" />
                                Requires action
                            </p>
                        </div>
                        <div className="bg-purple-100 w-14 h-14 rounded-xl flex items-center justify-center">
                            <TrendingUp className="text-purple-600" size={28} />
                        </div>
                    </div>
                </div>

                {/* Today's Transactions */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition cursor-pointer"
                    onClick={() => navigate('/dashboard/transactions')}>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 text-sm font-medium mb-1">{"Today's Activity"}</p>
                            <p className="text-3xl font-bold text-gray-900 mt-2">
                                {stats?.todayTransactions?.length || 0}
                            </p>
                            <p className="text-xs text-green-600 mt-2 flex items-center">
                                <Activity size={12} className="mr-1" />
                                Transactions today
                            </p>
                        </div>
                        <div className="bg-green-100 w-14 h-14 rounded-xl flex items-center justify-center">
                            <Activity className="text-green-600" size={28} />
                        </div>
                    </div>
                </div>

                {/* Completed Today */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 text-sm font-medium mb-1">Completed Today</p>
                            <p className="text-3xl font-bold text-gray-900 mt-2">
                                {stats?.todayTransactions?.filter(t => t._id === 'add_money')?.length || 0}
                            </p>
                            <p className="text-xs text-blue-600 mt-2 flex items-center">
                                <CheckCircle size={12} className="mr-1" />
                                Approved payments
                            </p>
                        </div>
                        <div className="bg-blue-100 w-14 h-14 rounded-xl flex items-center justify-center">
                            <CheckCircle className="text-blue-600" size={28} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Actions Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Pending Payments Card */}
                <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl border-2 border-yellow-200 p-6 hover:shadow-lg transition">
                    <div className="flex items-center justify-between mb-4">
                        <div className="bg-yellow-500 w-12 h-12 rounded-xl flex items-center justify-center">
                            <Clock className="text-white" size={24} />
                        </div>
                        <span className="bg-yellow-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                            {stats?.pendingPayments || 0} Pending
                        </span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Payment Approvals</h3>
                    <p className="text-gray-600 text-sm mb-4">
                        Review and approve pending add money requests
                    </p>
                    <button
                        onClick={() => navigate('/dashboard/payments')}
                        className="w-full bg-yellow-500 hover:bg-yellow-600 text-white py-3 rounded-xl font-semibold transition flex items-center justify-center space-x-2"
                    >
                        <span>Review Payments</span>
                        <ArrowRight size={18} />
                    </button>
                </div>

                {/* Pending Withdrawals Card */}
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl border-2 border-purple-200 p-6 hover:shadow-lg transition">
                    <div className="flex items-center justify-between mb-4">
                        <div className="bg-purple-500 w-12 h-12 rounded-xl flex items-center justify-center">
                            <TrendingUp className="text-white" size={24} />
                        </div>
                        <span className="bg-purple-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                            {stats?.pendingWithdrawals || 0} Pending
                        </span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Withdrawal Requests</h3>
                    <p className="text-gray-600 text-sm mb-4">
                        Process pending withdrawal requests from users
                    </p>
                    <button
                        onClick={() => navigate('/dashboard/withdrawals')}
                        className="w-full bg-purple-500 hover:bg-purple-600 text-white py-3 rounded-xl font-semibold transition flex items-center justify-center space-x-2"
                    >
                        <span>Process Withdrawals</span>
                        <ArrowRight size={18} />
                    </button>
                </div>

                {/* User Management Card */}
                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl border-2 border-blue-200 p-6 hover:shadow-lg transition">
                    <div className="flex items-center justify-between mb-4">
                        <div className="bg-blue-500 w-12 h-12 rounded-xl flex items-center justify-center">
                            <Users className="text-white" size={24} />
                        </div>
                        <span className="bg-blue-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                            {totalUsers} Users
                        </span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">User Management</h3>
                    <p className="text-gray-600 text-sm mb-4">
                        View and manage all registered users
                    </p>
                    <button
                        onClick={() => navigate('/dashboard/users')}
                        className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-xl font-semibold transition flex items-center justify-center space-x-2"
                    >
                        <span>Manage Users</span>
                        <ArrowRight size={18} />
                    </button>
                </div>
            </div>

            {/* Financial Summary */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Financial Summary</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Total Money In System */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-green-50 rounded-xl">
                            <div className="flex items-center space-x-3">
                                <div className="bg-green-500 w-10 h-10 rounded-lg flex items-center justify-center">
                                    <Wallet className="text-white" size={20} />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Total Balance in System</p>
                                    <p className="text-2xl font-bold text-green-600">
                                        ₹{(grandTotal || 0).toLocaleString()}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-purple-50 rounded-xl">
                            <div className="flex items-center space-x-3">
                                <div className="bg-purple-500 w-10 h-10 rounded-lg flex items-center justify-center">
                                    <TrendingUp className="text-white" size={20} />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Bonus Balance</p>
                                    <p className="text-2xl font-bold text-purple-600">
                                        ₹{(totalBonusBalance || 0).toLocaleString()}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Money Out */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-red-50 rounded-xl">
                            <div className="flex items-center space-x-3">
                                <div className="bg-red-500 w-10 h-10 rounded-lg flex items-center justify-center">
                                    <TrendingDown className="text-white" size={20} />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Total Withdrawals</p>
                                    <p className="text-2xl font-bold text-red-600">
                                        ₹{(totalWithdrawals || 0).toLocaleString()}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-xl">
                            <div className="flex items-center space-x-3">
                                <div className="bg-yellow-500 w-10 h-10 rounded-lg flex items-center justify-center">
                                    <Clock className="text-white" size={20} />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Pending Withdrawals</p>
                                    <p className="text-2xl font-bold text-yellow-600">
                                        ₹{(pendingWithdrawals || 0).toLocaleString()}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* System Health */}
            <div className="bg-gradient-to-br from-green-50 to-teal-50 rounded-2xl border-2 border-green-200 p-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <div className="bg-green-500 w-14 h-14 rounded-xl flex items-center justify-center">
                            <CheckCircle className="text-white" size={28} />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-gray-900">System Status</h3>
                            <p className="text-gray-600 text-sm">All systems operational</p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="text-sm font-semibold text-green-600">Active</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
