import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserDetails, updateUserBalance } from '../../store/slices/usersSlice';
import { ArrowLeft, Wallet, Send } from 'lucide-react';
import Loading from '../../components/Loader';

// Import sub-components
import UserProfileCard from '../../components/Users/UserProfileCard';
import UserBalanceCards from '../../components/Users/UserBalanceCards';
import UserHoldings from '../../components/Users/UserHoldings';
import UserOrders from '../../components/Users/UserOrders';
import UserTransactions from '../../components/Users/UserTransactions';
import UserBankDetails from '../../components/Users/UserBankDetails';
import UserKYC from '../../components/Users/UserKYC';
import UpdateBalanceModal from '../../components/Users/UpdateBalanceModal';
import SendNotificationModal from '../../components/Users/SendNotificationModal';

const UserDetails = () => {
    const { userId } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { userDetails, detailsLoading } = useSelector((state) => state.users);

    const [showBalanceModal, setShowBalanceModal] = useState(false);
    const [showNotificationModal, setShowNotificationModal] = useState(false);

    // Sample trading data - Replace with real API call
    const [tradingData, setTradingData] = useState({
        // Holdings
        holdings: [
            {
                indexId: '1',
                indexName: 'Nifty 50',
                quantity: 10,
                avgBuyPrice: 21500,
                currentPrice: 22350,
                investedValue: 215000,
                currentValue: 223500,
                pnl: 8500,
                pnlPercent: 3.95,
                dailyReturn: 1.8,
                purchaseDate: '2024-01-15'
            },
            {
                indexId: '2',
                indexName: 'Sensex',
                quantity: 5,
                avgBuyPrice: 71200,
                currentPrice: 72850,
                investedValue: 356000,
                currentValue: 364250,
                pnl: 8250,
                pnlPercent: 2.32,
                dailyReturn: 1.5,
                purchaseDate: '2024-01-20'
            },
            {
                indexId: '3',
                indexName: 'Bank Nifty',
                quantity: 3,
                avgBuyPrice: 48500,
                currentPrice: 49200,
                investedValue: 145500,
                currentValue: 147600,
                pnl: 2100,
                pnlPercent: 1.44,
                dailyReturn: 1.2,
                purchaseDate: '2024-02-01'
            }
        ],

        // Orders
        orders: {
            pending: [
                {
                    orderId: 'ORD001',
                    type: 'buy',
                    indexName: 'IT Index',
                    quantity: 5,
                    price: 38500,
                    totalAmount: 192500,
                    orderDate: '2026-02-05T10:30:00',
                    status: 'pending'
                },
                {
                    orderId: 'ORD002',
                    type: 'sell',
                    indexName: 'Nifty 50',
                    quantity: 2,
                    price: 22350,
                    totalAmount: 44700,
                    orderDate: '2026-02-05T14:20:00',
                    status: 'pending'
                }
            ],
            completed: [
                {
                    orderId: 'ORD003',
                    type: 'buy',
                    indexName: 'Nifty 50',
                    quantity: 10,
                    price: 21500,
                    totalAmount: 215000,
                    orderDate: '2024-01-15T09:15:00',
                    completedDate: '2024-01-15T09:16:00',
                    status: 'completed'
                },
                {
                    orderId: 'ORD004',
                    type: 'buy',
                    indexName: 'Sensex',
                    quantity: 5,
                    price: 71200,
                    totalAmount: 356000,
                    orderDate: '2024-01-20T11:30:00',
                    completedDate: '2024-01-20T11:31:00',
                    status: 'completed'
                }
            ],
            cancelled: [
                {
                    orderId: 'ORD005',
                    type: 'buy',
                    indexName: 'Pharma Index',
                    quantity: 8,
                    price: 15200,
                    totalAmount: 121600,
                    orderDate: '2024-01-25T16:45:00',
                    cancelledDate: '2024-01-25T17:00:00',
                    status: 'cancelled',
                    reason: 'Insufficient balance'
                }
            ]
        },

        // Portfolio Summary
        portfolio: {
            totalInvested: 716500,
            currentValue: 735350,
            totalPnL: 18850,
            totalPnLPercent: 2.63,
            todayPnL: 2850,
            todayPnLPercent: 0.39
        }
    });

    useEffect(() => {
        dispatch(fetchUserDetails(userId));
        // TODO: Fetch trading data
        // fetchUserTradingData(userId);
    }, [dispatch, userId]);

    if (detailsLoading) {
        return <Loading message="Loading user details..." />;
    }

    if (!userDetails) return null;

    const user = userDetails.user;

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate('/dashboard/users')}
                        className="p-3 hover:bg-white rounded-xl transition group shadow-md bg-white/50 backdrop-blur-sm"
                    >
                        <ArrowLeft className="text-gray-600 group-hover:text-gray-900" size={24} />
                    </button>
                    <div>
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            User Profile & Trading
                        </h1>
                        <p className="text-gray-600 mt-1">Complete trading overview and management</p>
                    </div>
                </div>

                <div className="flex gap-3">
                    <button
                        onClick={() => setShowNotificationModal(true)}
                        className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white px-5 py-3 rounded-xl transition shadow-lg font-semibold"
                    >
                        <Send size={18} />
                        Send Notification
                    </button>
                    <button
                        onClick={() => setShowBalanceModal(true)}
                        className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-5 py-3 rounded-xl transition shadow-lg font-semibold"
                    >
                        <Wallet size={18} />
                        Update Balance
                    </button>
                </div>
            </div>

            {/* User Profile Card */}
            <UserProfileCard user={user} />

            {/* Balance Cards */}
            <UserBalanceCards user={user} portfolio={tradingData.portfolio} />

            {/* Holdings Section */}
            <UserHoldings holdings={tradingData.holdings} portfolio={tradingData.portfolio} />

            {/* Orders Section */}
            <UserOrders orders={tradingData.orders} />

            {/* Bank Details & KYC */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <UserBankDetails user={user} />
                <UserKYC user={user} />
            </div>

            {/* Recent Transactions */}
            <UserTransactions transactions={userDetails.recentTransactions} />

            {/* Modals */}
            {showBalanceModal && (
                <UpdateBalanceModal
                    userId={userId}
                    onClose={() => setShowBalanceModal(false)}
                    dispatch={dispatch}
                    updateUserBalance={updateUserBalance}
                    fetchUserDetails={fetchUserDetails}
                />
            )}

            {showNotificationModal && (
                <SendNotificationModal
                    userId={userId}
                    onClose={() => setShowNotificationModal(false)}
                />
            )}
        </div>
    );
};

export default UserDetails;
