import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDashboardStats } from '../store/slices/dashboardSlice';
import { Users, Clock, CheckCircle, TrendingUp, Wallet, UsersIcon } from 'lucide-react';
import { fetchUsers } from '../store/slices/usersSlice';


const Dashboard = () => {
    const dispatch = useDispatch();
    const { stats, loading } = useSelector((state) => state.dashboard);

    const {

        totalUsers,
        totalWalletBalance,
        totalBonusBalance,
        grandTotal,
        filters,
    } = useSelector((state) => state.users);

    useEffect(() => {
        dispatch(fetchDashboardStats());
    }, [dispatch]);




    useEffect(() => {
        console.log('📊 Loading users...');
        dispatch(fetchUsers({
            page: 1,
            limit: 20,
            ...filters
        }));
    }, [dispatch, filters]);





    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    const statCards = [
        {
            title: 'Total Users',
            value: stats?.totalUsers || 0,
            icon: Users,
            color: 'bg-blue-500',
        },
        {
            title: 'Pending Payments',
            value: stats?.pendingPayments || 0,
            icon: Clock,
            color: 'bg-yellow-500',
        },
        {
            title: 'Pending Withdrawals',
            value: stats?.pendingWithdrawals || 0,
            icon: TrendingUp,
            color: 'bg-purple-500',
        },
        {
            title: 'Completed Today',
            value: stats?.todayTransactions?.length || 0,
            icon: CheckCircle,
            color: 'bg-green-500',
        },
    ];

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-800">Dashboard Overview</h1>
                <p className="text-gray-500 mt-2">Welcome back! {"Here's"} {"what's"} happening today.</p>
            </div>

            {/* Stats Cards with Gradient */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-xl p-6 text-white transform hover:scale-105 transition duration-300">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-blue-100 text-sm font-medium mb-1">Total Withdrawals</p>
                            <p className="text-4xl font-bold">{totalUsers || 0}</p>
                            <p className="text-blue-100 text-xs mt-2"></p>
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

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {statCards.map((stat, index) => (
                    <div
                        key={index}
                        className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-500 text-sm font-medium">{stat.title}</p>
                                <p className="text-3xl font-bold text-gray-800 mt-2">{stat.value}</p>
                            </div>
                            <div className={`${stat.color} w-12 h-12 rounded-lg flex items-center justify-center`}>
                                <stat.icon className="text-white" size={24} />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Dashboard;
