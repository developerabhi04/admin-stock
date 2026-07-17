import { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
    fetchUserDetails,
    updateUserBalance,
    resetBalanceUpdateStatus,
} from '../../store/slices/usersSlice';
import { ArrowLeft, Wallet } from 'lucide-react';
import Loading from '../../components/Loader';

import UserProfileCard from '../../components/Users/UserProfileCard';
import UserBalanceCards from '../../components/Users/UserBalanceCards';
import UserHoldings from '../../components/Users/UserHoldings';
import UserOrders from '../../components/Users/UserOrders';
import UserTransactions from '../../components/Users/UserTransactions';
import UserBankDetails from '../../components/Users/UserBankDetails';
import UpdateBalanceModal from '../../components/Users/UpdateBalanceModal';

const buildPortfolioSummary = (userDetails = {}) => {
    const backendPortfolio = userDetails.portfolioSummary || {};
    const investments = Array.isArray(userDetails.investments) ? userDetails.investments : [];

    const totalInvested =
        backendPortfolio.totalInvested ??
        backendPortfolio.totalPrincipalInvested ??
        investments.reduce((sum, item) => {
            if (String(item.status || '').toLowerCase() === 'active') {
                return sum + Number(item.amount || 0);
            }
            return sum;
        }, 0);

    const currentValue =
        backendPortfolio.currentValue ??
        backendPortfolio.totalCurrentValue ??
        investments.reduce((sum, item) => {
            if (String(item.status || '').toLowerCase() === 'active') {
                return sum + Number(item.amount || 0) + Number(item.totalInterestEarned || 0);
            }
            return sum;
        }, 0);

    const totalPnL =
        backendPortfolio.totalPnL ??
        backendPortfolio.totalInterestEarned ??
        (currentValue - totalInvested);

    const totalPnLPercent =
        backendPortfolio.totalPnLPercent ??
        (Number(totalInvested || 0) > 0
            ? (Number(totalPnL || 0) / Number(totalInvested || 1)) * 100
            : 0);

    const todayPnL =
        backendPortfolio.todayPnL ??
        backendPortfolio.totalDailyEarning ??
        investments.reduce((sum, item) => {
            if (String(item.status || '').toLowerCase() === 'active') {
                return sum + Number(item.dailyInterestAmount || item.dailyReturn || 0);
            }
            return sum;
        }, 0);

    const todayPnLPercent =
        backendPortfolio.todayPnLPercent ??
        (Number(totalInvested || 0) > 0
            ? (Number(todayPnL || 0) / Number(totalInvested || 1)) * 100
            : 0);

    return {
        ...backendPortfolio,
        totalInvested: Number(totalInvested || 0),
        currentValue: Number(currentValue || 0),
        totalPnL: Number(totalPnL || 0),
        totalPnLPercent: Number(totalPnLPercent || 0),
        todayPnL: Number(todayPnL || 0),
        todayPnLPercent: Number(todayPnLPercent || 0),
    };
};

const mapInvestmentsToHoldings = (investments = []) => {
    return investments
        .filter((item) => String(item.status || '').toLowerCase() === 'active')
        .map((item, index) => {
            const investedValue = Number(item.amount || 0);
            const pnl = Number(item.totalInterestEarned || 0);
            const currentValue = investedValue + pnl;
            const quantity = Number(item.quantity || item.units || 1);
            const avgBuyPrice = quantity > 0 ? investedValue / quantity : investedValue;
            const currentPrice = quantity > 0 ? currentValue / quantity : currentValue;

            return {
                _id: item._id || `holding-${index}`,
                indexName:
                    item.indexName ||
                    item.indexSnapshot?.name ||
                    item.index?.name ||
                    item.indexId?.name ||
                    item.planName ||
                    '-',
                symbol:
                    item.symbol ||
                    item.indexSnapshot?.symbol ||
                    item.index?.symbol ||
                    item.indexId?.symbol ||
                    '',
                quantity,
                avgBuyPrice,
                currentPrice,
                investedValue,
                currentValue,
                pnl,
                pnlPercent: investedValue > 0 ? (pnl / investedValue) * 100 : 0,
                dailyReturn: Number(item.dailyInterestAmount || item.dailyReturn || 0),
                purchaseDate: item.orderPlacedAt || item.createdAt || null,
                daysRemaining: Number(item.daysRemaining || 0),
                lockPeriodDays: Number(item.lockPeriodDays || 0),
            };
        });
};

const buildOrdersFromInvestments = (userDetails = {}) => {
    if (userDetails.investmentOrders) {
        return {
            pending: Array.isArray(userDetails.investmentOrders.pending)
                ? userDetails.investmentOrders.pending
                : [],
            active: Array.isArray(userDetails.investmentOrders.active)
                ? userDetails.investmentOrders.active
                : [],
            unlocked: Array.isArray(userDetails.investmentOrders.unlocked)
                ? userDetails.investmentOrders.unlocked
                : [],
            completed: Array.isArray(userDetails.investmentOrders.completed)
                ? userDetails.investmentOrders.completed
                : [],
            cancelled: Array.isArray(userDetails.investmentOrders.cancelled)
                ? userDetails.investmentOrders.cancelled
                : [],
            all: Array.isArray(userDetails.investmentOrders.all)
                ? userDetails.investmentOrders.all
                : [],
        };
    }

    const investments = Array.isArray(userDetails.investments) ? userDetails.investments : [];

    const mapped = investments.map((item, index) => ({
        _id: item._id || `order-${index}`,
        orderId: item.orderId || item.orderNumber || item._id,
        type: item.type || item.action || 'buy',
        indexName:
            item.indexName ||
            item.indexSnapshot?.name ||
            item.index?.name ||
            item.indexId?.name ||
            item.planName ||
            '-',
        quantity: Number(item.quantity || item.units || 1),
        price:
            Number(item.price || item.unitPrice || 0) ||
            Number(item.amount || 0) / Math.max(Number(item.quantity || item.units || 1), 1),
        totalAmount: Number(item.totalAmount || item.amount || 0),
        orderDate: item.orderDate || item.orderPlacedAt || item.createdAt || null,
        status: item.status || 'pending',
        reason: item.reason || item.rejectionReason || '',
    }));

    return {
        pending: mapped.filter((item) =>
            ['pending', 'processing', 'initiated'].includes(String(item.status).toLowerCase())
        ),
        active: mapped.filter((item) => String(item.status).toLowerCase() === 'active'),
        unlocked: mapped.filter((item) => String(item.status).toLowerCase() === 'unlocked'),
        completed: mapped.filter((item) =>
            ['completed', 'approved', 'closed_reinvested'].includes(String(item.status).toLowerCase())
        ),
        cancelled: mapped.filter((item) =>
            ['cancelled', 'rejected', 'failed'].includes(String(item.status).toLowerCase())
        ),
        all: mapped,
    };
};

const UserDetails = () => {
    const { userId } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { userDetails, detailsStatus, balanceUpdateStatus, error } = useSelector(
        (state) => state.users
    );

    const [showBalanceModal, setShowBalanceModal] = useState(false);

    useEffect(() => {
        if (userId) {
            dispatch(fetchUserDetails(userId));
        }

        return () => {
            dispatch(resetBalanceUpdateStatus());
        };
    }, [dispatch, userId]);

    const portfolioData = useMemo(() => buildPortfolioSummary(userDetails || {}), [userDetails]);

    const holdingsData = useMemo(
        () => mapInvestmentsToHoldings(userDetails?.investments || []),
        [userDetails]
    );

    const ordersData = useMemo(() => buildOrdersFromInvestments(userDetails || {}), [userDetails]);

    if (detailsStatus === 'loading') {
        return <Loading message="Loading user details..." />;
    }

    if (detailsStatus === 'failed') {
        return (
            <div className="p-6">
                <button
                    onClick={() => navigate('/dashboard/users')}
                    className="mb-4 inline-flex items-center gap-2 rounded-lg border px-4 py-2"
                    type="button"
                >
                    <ArrowLeft size={18} />
                    Back to users
                </button>
                <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
                    {error || 'Failed to load user details'}
                </div>
            </div>
        );
    }

    if (!userDetails) return null;

    const user = userDetails.user || {};

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="mb-8 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate('/dashboard/users')}
                        className="group rounded-xl bg-white p-3 shadow-sm border border-gray-200 transition hover:bg-gray-50"
                        type="button"
                    >
                        <ArrowLeft className="text-gray-600 group-hover:text-gray-900" size={24} />
                    </button>

                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">User Profile & Portfolio</h1>
                        <p className="mt-1 text-gray-600">
                            Complete investment overview and management
                        </p>
                    </div>
                </div>

                <div className="flex gap-3">
                    <button
                        onClick={() => setShowBalanceModal(true)}
                        className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white shadow-sm transition hover:bg-blue-700"
                        type="button"
                    >
                        <Wallet size={18} />
                        {balanceUpdateStatus === 'loading' ? 'Updating...' : 'Update Balance'}
                    </button>
                </div>
            </div>

            <div className="space-y-6">
                <UserProfileCard user={user} />
                <UserBalanceCards user={user} portfolio={portfolioData} />
                <UserHoldings holdings={holdingsData} portfolio={portfolioData} />
                <UserOrders orders={ordersData} />
                <UserBankDetails user={user} />
                <UserTransactions transactions={userDetails.recentTransactions || []} />
            </div>

            {showBalanceModal && (
                <UpdateBalanceModal
                    userId={userId}
                    onClose={() => setShowBalanceModal(false)}
                    dispatch={dispatch}
                    updateUserBalance={updateUserBalance}
                    fetchUserDetails={fetchUserDetails}
                />
            )}
        </div>
    );
};

export default UserDetails;