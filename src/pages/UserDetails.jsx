import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserDetails, updateUserBalance } from '../store/slices/usersSlice';
import { adminAPI } from '../services/api';
import {
    ArrowLeft,
    User,
    Phone,
    Wallet,
    Calendar,
    Plus,
    Minus,
    CheckCircle,
    Mail,
    CreditCard,
    TrendingUp,
    TrendingDown,
    Send,
    Bell,
    X,
    Loader,
    Activity,
    Award,
    Shield,
    DollarSign
} from 'lucide-react';
import Loading from '../components/Loader';

const UserDetails = () => {
    const { userId } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { userDetails, detailsLoading } = useSelector((state) => state.users);

    const [showBalanceModal, setShowBalanceModal] = useState(false);
    const [showNotificationModal, setShowNotificationModal] = useState(false);
    const [balanceAction, setBalanceAction] = useState('add');
    const [amount, setAmount] = useState('');
    const [reason, setReason] = useState('');
    const [loading, setLoading] = useState(false);
    const [sendingNotification, setSendingNotification] = useState(false);

    // Notification form
    const [notificationData, setNotificationData] = useState({
        title: '',
        message: '',
        type: 'general'
    });

    useEffect(() => {
        dispatch(fetchUserDetails(userId));
    }, [dispatch, userId]);

    const handleBalanceUpdate = async () => {
        if (!amount || !reason) {
            alert('Please fill all fields');
            return;
        }

        setLoading(true);
        try {
            await dispatch(updateUserBalance({
                userId,
                amount: parseFloat(amount),
                type: balanceAction,
                reason
            })).unwrap();

            alert('✅ Balance updated successfully!');
            setShowBalanceModal(false);
            setAmount('');
            setReason('');
            dispatch(fetchUserDetails(userId));
        } catch (error) {
            alert('Error: ' + error);
        } finally {
            setLoading(false);
        }
    };

    const handleSendNotification = async (e) => {
        e.preventDefault();

        if (!notificationData.title.trim() || !notificationData.message.trim()) {
            alert('Please fill in all fields');
            return;
        }

        try {
            setSendingNotification(true);
            await adminAPI.sendNotificationToUser(userId, notificationData);

            alert('✅ Notification sent successfully!');
            setShowNotificationModal(false);
            setNotificationData({ title: '', message: '', type: 'general' });
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
            default:
                return '📢';
        }
    };

    if (detailsLoading) {
        return <Loading message="Loading dashboard..." />;
    }

    if (!userDetails) return null;

    const user = userDetails.user;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate('/dashboard/users')}
                        className="p-2 hover:bg-gray-100 rounded-lg transition group"
                    >
                        <ArrowLeft className="text-gray-600 group-hover:text-gray-900" size={24} />
                    </button>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">User Profile</h1>
                        <p className="text-gray-500 mt-1">Complete overview and management</p>
                    </div>
                </div>

                <div className="flex gap-3">
                    <button
                        onClick={() => setShowNotificationModal(true)}
                        className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition shadow-lg"
                    >
                        <Send size={18} />
                        Send Notification
                    </button>
                    <button
                        onClick={() => setShowBalanceModal(true)}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition shadow-lg"
                    >
                        <Wallet size={18} />
                        Update Balance
                    </button>
                </div>
            </div>

            {/* User Profile Card */}
            <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-xl p-8 text-white">
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-6">
                        <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center ring-4 ring-white/30">
                            <User className="text-white" size={48} />
                        </div>
                        <div>
                            <h2 className="text-3xl font-bold mb-2">{user.fullName}</h2>
                            <div className="flex flex-wrap gap-4 text-blue-100">
                                <div className="flex items-center gap-2">
                                    <Phone size={16} />
                                    <span>{user.phoneNumber}</span>
                                </div>
                                {user.email && (
                                    <div className="flex items-center gap-2">
                                        <Mail size={16} />
                                        <span>{user.email}</span>
                                    </div>
                                )}
                                <div className="flex items-center gap-2">
                                    <Calendar size={16} />
                                    <span>Joined {new Date(user.createdAt).toLocaleDateString()}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Status Badges */}
                    <div className="flex flex-col gap-2">
                        {user.isVerified && (
                            <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-500/20 backdrop-blur-sm rounded-full text-sm font-semibold">
                                <CheckCircle size={14} />
                                Verified
                            </span>
                        )}
                        <span className={`inline-flex items-center gap-1 px-3 py-1 ${user.kycStatus === 'verified'
                                ? 'bg-green-500/20'
                                : user.kycStatus === 'pending'
                                    ? 'bg-yellow-500/20'
                                    : 'bg-gray-500/20'
                            } backdrop-blur-sm rounded-full text-sm font-semibold capitalize`}>
                            <Shield size={14} />
                            KYC: {user.kycStatus || 'Not Started'}
                        </span>
                    </div>
                </div>
            </div>

            {/* Balance Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Wallet Balance */}
                <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                            <Wallet className="text-green-600" size={24} />
                        </div>
                        <TrendingUp className="text-green-500" size={20} />
                    </div>
                    <p className="text-sm text-gray-600 mb-1">Wallet Balance</p>
                    <p className="text-3xl font-bold text-gray-900">
                        ₹{(user.walletBalance || 0).toLocaleString('en-IN')}
                    </p>
                    <p className="text-xs text-green-600 mt-2 font-medium">● Withdrawable</p>
                </div>

                {/* Bonus Balance */}
                <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                            <Award className="text-purple-600" size={24} />
                        </div>
                        <Activity className="text-purple-500" size={20} />
                    </div>
                    <p className="text-sm text-gray-600 mb-1">Bonus Balance</p>
                    <p className="text-3xl font-bold text-gray-900">
                        ₹{(user.bonusBalance || 0).toLocaleString('en-IN')}
                    </p>
                    <p className="text-xs text-purple-600 mt-2 font-medium">● Non-withdrawable</p>
                </div>

                {/* Total Balance */}
                <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                            <DollarSign className="text-blue-600" size={24} />
                        </div>
                        <TrendingUp className="text-blue-500" size={20} />
                    </div>
                    <p className="text-sm text-gray-600 mb-1">Total Balance</p>
                    <p className="text-3xl font-bold text-gray-900">
                        ₹{(user.totalBalance || 0).toLocaleString('en-IN')}
                    </p>
                    <p className="text-xs text-blue-600 mt-2 font-medium">● Combined</p>
                </div>
            </div>

            {/* Account Information */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Account Status */}
                <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <CheckCircle className="text-blue-600" size={20} />
                        Account Status
                    </h3>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between py-3 border-b border-gray-100">
                            <span className="text-gray-600">Verification Status</span>
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${user.isVerified
                                    ? 'bg-green-100 text-green-700'
                                    : 'bg-yellow-100 text-yellow-700'
                                }`}>
                                {user.isVerified ? '✓ Verified' : 'Unverified'}
                            </span>
                        </div>
                        <div className="flex items-center justify-between py-3 border-b border-gray-100">
                            <span className="text-gray-600">KYC Status</span>
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${user.kycStatus === 'verified'
                                    ? 'bg-green-100 text-green-700'
                                    : user.kycStatus === 'pending'
                                        ? 'bg-yellow-100 text-yellow-700'
                                        : 'bg-gray-100 text-gray-700'
                                }`}>
                                {user.kycStatus || 'Not Started'}
                            </span>
                        </div>
                        <div className="flex items-center justify-between py-3 border-b border-gray-100">
                            <span className="text-gray-600">Account Status</span>
                            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                                ● Active
                            </span>
                        </div>
                        <div className="flex items-center justify-between py-3">
                            <span className="text-gray-600">Last Login</span>
                            <span className="text-gray-900 font-medium">
                                {user.lastLogin ? new Date(user.lastLogin).toLocaleString() : 'Never'}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Quick Stats */}
                <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <Activity className="text-blue-600" size={20} />
                        Activity Overview
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4">
                            <p className="text-sm text-blue-600 mb-1">Total Transactions</p>
                            <p className="text-2xl font-bold text-blue-900">
                                {userDetails.recentTransactions?.length || 0}
                            </p>
                        </div>
                        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4">
                            <p className="text-sm text-green-600 mb-1">Total Deposits</p>
                            <p className="text-2xl font-bold text-green-900">
                                ₹{userDetails.recentTransactions
                                    ?.filter(t => t.category === 'add_money' && t.status === 'completed')
                                    ?.reduce((sum, t) => sum + t.amount, 0)
                                    ?.toLocaleString('en-IN') || 0}
                            </p>
                        </div>
                        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4">
                            <p className="text-sm text-purple-600 mb-1">Total Withdrawals</p>
                            <p className="text-2xl font-bold text-purple-900">
                                ₹{userDetails.recentTransactions
                                    ?.filter(t => t.category === 'withdrawal' && t.status === 'completed')
                                    ?.reduce((sum, t) => sum + t.amount, 0)
                                    ?.toLocaleString('en-IN') || 0}
                            </p>
                        </div>
                        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-4">
                            <p className="text-sm text-orange-600 mb-1">Account Age</p>
                            <p className="text-2xl font-bold text-orange-900">
                                {Math.floor((new Date() - new Date(user.createdAt)) / (1000 * 60 * 60 * 24))}d
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent Transactions */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <CreditCard className="text-blue-600" size={20} />
                    Recent Transactions
                </h3>
                <div className="overflow-x-auto">
                    {userDetails.recentTransactions?.length > 0 ? (
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b-2 border-gray-200">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Type</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Amount</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Date</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Description</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {userDetails.recentTransactions.slice(0, 10).map((txn) => (
                                    <tr key={txn._id} className="hover:bg-gray-50 transition">
                                        <td className="px-4 py-4">
                                            <div className="flex items-center gap-2">
                                                {txn.type === 'credit' ? (
                                                    <TrendingUp className="text-green-500" size={16} />
                                                ) : (
                                                    <TrendingDown className="text-red-500" size={16} />
                                                )}
                                                <span className="font-medium text-gray-900 capitalize">
                                                    {txn.category.replace('_', ' ')}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-4">
                                            <span className={`font-bold text-lg ${txn.type === 'credit' ? 'text-green-600' : 'text-red-600'
                                                }`}>
                                                {txn.type === 'credit' ? '+' : '-'}₹{txn.amount.toLocaleString('en-IN')}
                                            </span>
                                        </td>
                                        <td className="px-4 py-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${txn.status === 'completed'
                                                    ? 'bg-green-100 text-green-700'
                                                    : txn.status === 'pending'
                                                        ? 'bg-yellow-100 text-yellow-700'
                                                        : 'bg-red-100 text-red-700'
                                                }`}>
                                                {txn.status}
                                            </span>
                                        </td>
                                        <td className="px-4 py-4 text-sm text-gray-600">
                                            {new Date(txn.createdAt).toLocaleString('en-IN', {
                                                dateStyle: 'short',
                                                timeStyle: 'short'
                                            })}
                                        </td>
                                        <td className="px-4 py-4 text-sm text-gray-600">
                                            {txn.description || '-'}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <div className="text-center py-12">
                            <CreditCard className="mx-auto text-gray-400 mb-4" size={48} />
                            <p className="text-gray-600">No transactions yet</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Update Balance Modal */}
            {showBalanceModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md animate-scale-in">
                        <div className="flex items-center justify-between p-6 border-b border-gray-200">
                            <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                <Wallet className="text-blue-600" size={24} />
                                Update Balance
                            </h3>
                            <button
                                onClick={() => setShowBalanceModal(false)}
                                className="text-gray-400 hover:text-gray-600 transition"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <div className="p-6 space-y-4">
                            {/* Action Type */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-3">Action Type</label>
                                <div className="grid grid-cols-2 gap-3">
                                    <button
                                        onClick={() => setBalanceAction('add')}
                                        className={`flex items-center justify-center gap-2 py-4 rounded-xl border-2 transition ${balanceAction === 'add'
                                                ? 'border-green-500 bg-green-50 text-green-700 shadow-lg'
                                                : 'border-gray-200 text-gray-600 hover:border-green-300'
                                            }`}
                                    >
                                        <Plus size={20} />
                                        <span className="font-semibold">Add Money</span>
                                    </button>
                                    <button
                                        onClick={() => setBalanceAction('deduct')}
                                        className={`flex items-center justify-center gap-2 py-4 rounded-xl border-2 transition ${balanceAction === 'deduct'
                                                ? 'border-red-500 bg-red-50 text-red-700 shadow-lg'
                                                : 'border-gray-200 text-gray-600 hover:border-red-300'
                                            }`}
                                    >
                                        <Minus size={20} />
                                        <span className="font-semibold">Deduct Money</span>
                                    </button>
                                </div>
                            </div>

                            {/* Amount */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Amount (₹)</label>
                                <input
                                    type="number"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition"
                                    placeholder="Enter amount"
                                    min="0"
                                    step="0.01"
                                />
                            </div>

                            {/* Reason */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Reason</label>
                                <textarea
                                    value={reason}
                                    onChange={(e) => setReason(e.target.value)}
                                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition resize-none"
                                    rows="3"
                                    placeholder="Enter reason for adjustment..."
                                />
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="flex gap-3 p-6 bg-gray-50 rounded-b-2xl">
                            <button
                                onClick={() => setShowBalanceModal(false)}
                                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 rounded-xl transition font-semibold"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleBalanceUpdate}
                                disabled={loading || !amount || !reason}
                                className={`flex-1 ${balanceAction === 'add'
                                        ? 'bg-green-600 hover:bg-green-700'
                                        : 'bg-red-600 hover:bg-red-700'
                                    } text-white py-3 rounded-xl transition disabled:opacity-50 disabled:cursor-not-allowed font-semibold flex items-center justify-center gap-2`}
                            >
                                {loading ? (
                                    <>
                                        <Loader className="animate-spin" size={18} />
                                        Processing...
                                    </>
                                ) : (
                                    <>
                                        {balanceAction === 'add' ? <Plus size={18} /> : <Minus size={18} />}
                                        {balanceAction === 'add' ? 'Add Amount' : 'Deduct Amount'}
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Send Notification Modal */}
            {showNotificationModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md animate-scale-in">
                        <div className="flex items-center justify-between p-6 border-b border-gray-200">
                            <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                <Send className="text-purple-600" size={24} />
                                Send Notification
                            </h3>
                            <button
                                onClick={() => setShowNotificationModal(false)}
                                className="text-gray-400 hover:text-gray-600 transition"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleSendNotification} className="p-6 space-y-4">
                            {/* Notification Type */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Notification Type</label>
                                <select
                                    value={notificationData.type}
                                    onChange={(e) => setNotificationData(prev => ({ ...prev, type: e.target.value }))}
                                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition"
                                >
                                    <option value="general">📢 General</option>
                                    <option value="payment">💰 Payment</option>
                                    <option value="withdrawal">💸 Withdrawal</option>
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
                                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition"
                                    placeholder="Enter notification title"
                                    maxLength={50}
                                    required
                                />
                                <p className="mt-1 text-xs text-gray-500">
                                    {notificationData.title.length}/50 characters
                                </p>
                            </div>

                            {/* Message */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                                <textarea
                                    value={notificationData.message}
                                    onChange={(e) => setNotificationData(prev => ({ ...prev, message: e.target.value }))}
                                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition resize-none"
                                    rows="4"
                                    placeholder="Enter notification message"
                                    maxLength={200}
                                    required
                                />
                                <p className="mt-1 text-xs text-gray-500">
                                    {notificationData.message.length}/200 characters
                                </p>
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
                                                        {notificationData.title || 'Notification Title'}
                                                    </h4>
                                                    <span className="text-lg">{getTypeIcon(notificationData.type)}</span>
                                                </div>
                                                <p className="text-sm text-gray-600">
                                                    {notificationData.message || 'Notification message will appear here'}
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
                                    onClick={() => setShowNotificationModal(false)}
                                    className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 rounded-xl transition font-semibold"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={sendingNotification}
                                    className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-xl transition disabled:opacity-50 disabled:cursor-not-allowed font-semibold flex items-center justify-center gap-2"
                                >
                                    {sendingNotification ? (
                                        <>
                                            <Loader className="animate-spin" size={18} />
                                            Sending...
                                        </>
                                    ) : (
                                        <>
                                            <Send size={18} />
                                            Send Now
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

export default UserDetails;
