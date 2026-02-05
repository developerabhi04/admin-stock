import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CreditCard, TrendingDown, Clock, DollarSign } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchPendingPayments } from '../store/slices/paymentsSlice';
import { fetchPendingWithdrawals } from '../store/slices/withdrawalsSlice';
import PendingPayments from './PendingPayments';
import PendingWithdrawals from './PendingWithdrawals';
import Loading from '../components/Loader';

const PaymentManager = ({ defaultTab = 'payments' }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();

    const { payments, loading: paymentsLoading } = useSelector((state) => state.payments);
    const { withdrawals, loading: withdrawalsLoading } = useSelector((state) => state.withdrawals);

    // ✅ FIXED: Fetch only once, no cleanup
    useEffect(() => {
        dispatch(fetchPendingPayments({ page: 1, limit: 20 }));
        dispatch(fetchPendingWithdrawals({ page: 1, limit: 20 }));

        // ❌ REMOVED: No cleanup function that causes infinite loop
    }, []); // Empty array - runs only once on mount

    const getInitialTab = () => {
        if (location.pathname.includes('withdrawals')) return 'withdrawals';
        if (location.pathname.includes('payments')) return 'payments';
        return defaultTab;
    };

    const [activeTab, setActiveTab] = useState(getInitialTab);

    useEffect(() => {
        const newTab = getInitialTab();
        setActiveTab(newTab);
    }, [location.pathname]);

    const handleTabChange = (tab) => {
        setActiveTab(tab);
        navigate(`/dashboard/payment-manager/${tab}`, { replace: false });
    };

    // Calculate totals
    const totalPaymentsAmount = payments?.reduce((sum, p) => sum + p.amount, 0) || 0;
    const totalWithdrawalsAmount = withdrawals?.reduce((sum, w) => sum + w.amount, 0) || 0;

    // ✅ FIXED: Only check loading state, not undefined
    const isLoading = (paymentsLoading || withdrawalsLoading) &&
        (!payments || !withdrawals);

    console.log('🔍 Loading State:', {
        paymentsLoading,
        withdrawalsLoading,
        paymentsCount: payments?.length,
        withdrawalsCount: withdrawals?.length,
        isLoading
    });

    if (isLoading) {
        return <Loading message="Loading payment manager..." />;
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Payment Manager</h1>
                <p className="text-sm text-gray-600 mt-1">Manage all pending transactions</p>
            </div>

            {/* Statistics Cards - Compact Design */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                {/* Pending Payments Count */}
                <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs font-medium text-gray-500 uppercase">Pending Payments</p>
                            <h3 className="text-2xl font-bold text-gray-800 mt-1">{payments?.length || 0}</h3>
                        </div>
                        <div className="bg-blue-100 p-3 rounded-lg">
                            <CreditCard className="text-blue-600" size={24} />
                        </div>
                    </div>
                </div>

                {/* Pending Withdrawals Count */}
                <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs font-medium text-gray-500 uppercase">Pending Withdrawals</p>
                            <h3 className="text-2xl font-bold text-gray-800 mt-1">{withdrawals?.length || 0}</h3>
                        </div>
                        <div className="bg-purple-100 p-3 rounded-lg">
                            <TrendingDown className="text-purple-600" size={24} />
                        </div>
                    </div>
                </div>

                {/* Total Payments Amount */}
                <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs font-medium text-gray-500 uppercase">Payments Amount</p>
                            <h3 className="text-2xl font-bold text-green-600 mt-1">₹{totalPaymentsAmount.toLocaleString()}</h3>
                        </div>
                        <div className="bg-green-100 p-3 rounded-lg">
                            <DollarSign className="text-green-600" size={24} />
                        </div>
                    </div>
                </div>

                {/* Total Withdrawals Amount */}
                <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs font-medium text-gray-500 uppercase">Withdrawals Amount</p>
                            <h3 className="text-2xl font-bold text-red-600 mt-1">₹{totalWithdrawalsAmount.toLocaleString()}</h3>
                        </div>
                        <div className="bg-red-100 p-3 rounded-lg">
                            <Clock className="text-red-600" size={24} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                {/* Tab Headers */}
                <div className="flex border-b border-gray-200">
                    <button
                        onClick={() => handleTabChange('payments')}
                        className={`flex-1 px-6 py-4 text-sm font-semibold transition-colors ${activeTab === 'payments'
                            ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                            : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                            }`}
                    >
                        <div className="flex items-center justify-center gap-2">
                            <CreditCard size={18} />
                            <span>Payments</span>
                            {payments?.length > 0 && (
                                <span className="bg-blue-600 text-white text-xs px-2 py-0.5 rounded-full">
                                    {payments.length}
                                </span>
                            )}
                        </div>
                    </button>
                    <button
                        onClick={() => handleTabChange('withdrawals')}
                        className={`flex-1 px-6 py-4 text-sm font-semibold transition-colors ${activeTab === 'withdrawals'
                            ? 'text-purple-600 border-b-2 border-purple-600 bg-purple-50'
                            : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                            }`}
                    >
                        <div className="flex items-center justify-center gap-2">
                            <TrendingDown size={18} />
                            <span>Withdrawals</span>
                            {withdrawals?.length > 0 && (
                                <span className="bg-purple-600 text-white text-xs px-2 py-0.5 rounded-full">
                                    {withdrawals.length}
                                </span>
                            )}
                        </div>
                    </button>
                </div>

                {/* Tab Content */}
                <div className="p-6">
                    {activeTab === 'payments' && <PendingPayments />}
                    {activeTab === 'withdrawals' && <PendingWithdrawals />}
                </div>
            </div>
        </div>
    );
};

export default PaymentManager;
