import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserDetails, updateUserBalance } from '../store/slices/usersSlice';
import {
    ArrowLeft,
    User,
    Phone,
    Wallet,
    Calendar,
    Plus,
    Minus,
    CheckCircle
} from 'lucide-react';

const UserDetails = () => {
    const { userId } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { userDetails, detailsLoading } = useSelector((state) => state.users);

    const [showBalanceModal, setShowBalanceModal] = useState(false);
    const [balanceAction, setBalanceAction] = useState('add');
    const [amount, setAmount] = useState('');
    const [reason, setReason] = useState('');
    const [loading, setLoading] = useState(false);

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

            alert('Balance updated successfully!');
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

    if (detailsLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (!userDetails) return null;

    const user = userDetails.user;

    return (
        <div>
            {/* Header */}
            <div className="mb-8 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <button
                        onClick={() => navigate('/dashboard/users')}
                        className="p-2 hover:bg-gray-100 rounded-lg transition"
                    >
                        <ArrowLeft size={24} />
                    </button>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">User Details</h1>
                        <p className="text-gray-500 mt-1">Complete user information and activity</p>
                    </div>
                </div>
            </div>

            {/* User Info Card */}
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-4">
                        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                            <User className="text-blue-600" size={32} />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-gray-800">{user.fullName}</h2>
                            <div className="flex items-center space-x-4 mt-2 text-gray-600">
                                <div className="flex items-center space-x-1">
                                    <Phone size={16} />
                                    <span>{user.phoneNumber}</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                    <Calendar size={16} />
                                    <span>Joined {new Date(user.createdAt).toLocaleDateString()}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={() => setShowBalanceModal(true)}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition"
                    >
                        Update Balance
                    </button>
                </div>
            </div>

            {/* Balance Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white">
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-green-100">Wallet Balance</p>
                        <Wallet size={24} />
                    </div>
                    <p className="text-4xl font-bold">₹{(user.walletBalance || 0).toLocaleString()}</p>
                    <p className="text-green-100 text-sm mt-2">Withdrawable</p>
                </div>

                <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg p-6 text-white">
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-purple-100">Bonus Balance</p>
                        <Wallet size={24} />
                    </div>
                    <p className="text-4xl font-bold">₹{(user.bonusBalance || 0).toLocaleString()}</p>
                    <p className="text-purple-100 text-sm mt-2">Non-withdrawable</p>
                </div>

                <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white">
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-blue-100">Total Balance</p>
                        <Wallet size={24} />
                    </div>
                    <p className="text-4xl font-bold">₹{(user.totalBalance || 0).toLocaleString()}</p>
                    <p className="text-blue-100 text-sm mt-2">Combined</p>
                </div>
            </div>

            {/* Account Status */}
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Account Status</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                        <p className="text-gray-500 text-sm mb-1">Verification</p>
                        <div className="flex items-center space-x-2">
                            {user.isVerified ? (
                                <>
                                    <CheckCircle className="text-green-500" size={20} />
                                    <span className="font-semibold text-green-600">Verified</span>
                                </>
                            ) : (
                                <span className="font-semibold text-yellow-600">Unverified</span>
                            )}
                        </div>
                    </div>
                    <div>
                        <p className="text-gray-500 text-sm mb-1">KYC Status</p>
                        <span className={`font-semibold ${user.kycStatus === 'verified' ? 'text-green-600' : 'text-yellow-600'
                            }`}>
                            {user.kycStatus}
                        </span>
                    </div>
                    <div>
                        <p className="text-gray-500 text-sm mb-1">Account Status</p>
                        <span className="font-semibold text-green-600">Active</span>
                    </div>
                    <div>
                        <p className="text-gray-500 text-sm mb-1">Last Login</p>
                        <span className="font-semibold text-gray-700">
                            {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Never'}
                        </span>
                    </div>
                </div>
            </div>

            {/* Recent Transactions */}
            <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Recent Transactions</h3>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {userDetails.recentTransactions?.map((txn) => (
                                <tr key={txn._id}>
                                    <td className="px-4 py-3 capitalize">{txn.category.replace('_', ' ')}</td>
                                    <td className="px-4 py-3">
                                        <span className={`font-bold ${txn.type === 'credit' ? 'text-green-600' : 'text-red-600'
                                            }`}>
                                            {txn.type === 'credit' ? '+' : '-'}₹{txn.amount.toLocaleString()}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${txn.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                            }`}>
                                            {txn.status}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-sm text-gray-600">
                                        {new Date(txn.createdAt).toLocaleString()}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Update Balance Modal */}
            {showBalanceModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl p-6 w-full max-w-md">
                        <h3 className="text-xl font-bold text-gray-800 mb-4">Update User Balance</h3>

                        {/* Action Type */}
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Action</label>
                            <div className="grid grid-cols-2 gap-4">
                                <button
                                    onClick={() => setBalanceAction('add')}
                                    className={`flex items-center justify-center space-x-2 py-3 rounded-lg border-2 transition ${balanceAction === 'add'
                                            ? 'border-green-500 bg-green-50 text-green-600'
                                            : 'border-gray-300 text-gray-600'
                                        }`}
                                >
                                    <Plus size={20} />
                                    <span className="font-medium">Add Money</span>
                                </button>
                                <button
                                    onClick={() => setBalanceAction('deduct')}
                                    className={`flex items-center justify-center space-x-2 py-3 rounded-lg border-2 transition ${balanceAction === 'deduct'
                                            ? 'border-red-500 bg-red-50 text-red-600'
                                            : 'border-gray-300 text-gray-600'
                                        }`}
                                >
                                    <Minus size={20} />
                                    <span className="font-medium">Deduct Money</span>
                                </button>
                            </div>
                        </div>

                        {/* Amount */}
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Amount</label>
                            <input
                                type="number"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                className="w-full border border-gray-300 rounded-lg px-4 py-3"
                                placeholder="Enter amount"
                            />
                        </div>

                        {/* Reason */}
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Reason</label>
                            <textarea
                                value={reason}
                                onChange={(e) => setReason(e.target.value)}
                                className="w-full border border-gray-300 rounded-lg px-4 py-3"
                                rows="3"
                                placeholder="Enter reason for adjustment..."
                            ></textarea>
                        </div>

                        {/* Buttons */}
                        <div className="flex space-x-3">
                            <button
                                onClick={handleBalanceUpdate}
                                disabled={loading}
                                className={`flex-1 ${balanceAction === 'add' ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600'
                                    } text-white py-3 rounded-lg transition disabled:opacity-50`}
                            >
                                {loading ? 'Updating...' : `${balanceAction === 'add' ? 'Add' : 'Deduct'} Amount`}
                            </button>
                            <button
                                onClick={() => setShowBalanceModal(false)}
                                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 rounded-lg transition"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserDetails;
