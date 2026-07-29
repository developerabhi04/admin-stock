import { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
    fetchUserDetails,
    updateUserBalance,
    resetBalanceUpdateStatus,
} from '../../store/slices/usersSlice';
import { fetchTransactions } from '../../store/slices/transactionsSlice';
import {
    ArrowLeft,
    Wallet,
    RefreshCw,
    ExternalLink,
} from 'lucide-react';
import Loading from '../../components/Loader';

import UserProfileCard from '../../components/Users/UserProfileCard';
import UserBalanceCards from '../../components/Users/UserBalanceCards';
import UserTransactions from '../../components/Users/UserTransactions';
import UserBankDetails from '../../components/Users/UserBankDetails';
import UpdateBalanceModal from '../../components/Users/UpdateBalanceModal';


const getTxnUserId = (txn = {}) => {
    if (!txn?.userId) return '';
    if (typeof txn.userId === 'string') return txn.userId;
    return txn.userId?._id || txn.userId?.id || '';
};

const buildPortfolioSummary = (userDetails = {}) => {
    const backendPortfolio = userDetails.portfolioSummary || {};
    const investments = Array.isArray(userDetails.investments) ? userDetails.investments : [];

    const totalInvested =
        backendPortfolio.totalInvested ??
        backendPortfolio.totalPrincipalInvested ??
        investments.reduce((sum, item) => sum + Number(item.amount || 0), 0);

    const activeInvested = investments.reduce((sum, item) => {
        if (String(item.status || '').toLowerCase() === 'active') {
            return sum + Number(item.amount || 0);
        }
        return sum;
    }, 0);

    const currentValue =
        backendPortfolio.currentValue ??
        backendPortfolio.totalCurrentValue ??
        investments.reduce(
            (sum, item) => sum + Number(item.amount || 0) + Number(item.totalInterestEarned || 0),
            0
        );

    const totalPnL =
        backendPortfolio.totalPnL ??
        backendPortfolio.totalInterestEarned ??
        currentValue - totalInvested;

    const totalPnLPercent =
        backendPortfolio.totalPnLPercent ??
        (Number(totalInvested || 0) > 0 ? (Number(totalPnL || 0) / Number(totalInvested || 1)) * 100 : 0);

    const todayPnL =
        backendPortfolio.todayPnL ??
        backendPortfolio.totalDailyEarning ??
        investments.reduce((sum, item) => {
            return sum + Number(item.dailyInterestAmount || item.dailyReturn || 0);
        }, 0);

    const statusBuckets = investments.reduce(
        (acc, item) => {
            const status = String(item.status || 'pending').toLowerCase();
            acc.all += 1;

            if (['pending', 'processing', 'initiated'].includes(status)) acc.pending += 1;
            else if (status === 'active') acc.active += 1;
            else if (status === 'unlocked') acc.unlocked += 1;
            else if (['completed', 'approved'].includes(status)) acc.completed += 1;
            else if (['closed', 'closed_reinvested'].includes(status)) acc.closed += 1;
            else if (['cancelled', 'rejected', 'failed'].includes(status)) acc.cancelled += 1;
            else acc.other += 1;

            return acc;
        },
        {
            all: 0,
            pending: 0,
            active: 0,
            unlocked: 0,
            completed: 0,
            closed: 0,
            cancelled: 0,
            other: 0,
        }
    );

    return {
        ...backendPortfolio,
        totalInvested: Number(totalInvested || 0),
        activeInvested: Number(activeInvested || 0),
        currentValue: Number(currentValue || 0),
        totalPnL: Number(totalPnL || 0),
        totalPnLPercent: Number(totalPnLPercent || 0),
        todayPnL: Number(todayPnL || 0),
        statusBuckets,
    };
};

const buildAdminStats = (userDetails = {}, fullTransactions = []) => {
    const user = userDetails.user || {};
    const investments = Array.isArray(userDetails.investments) ? userDetails.investments : [];
    const txns = Array.isArray(fullTransactions) ? fullTransactions : [];

    const totalCredits = txns.reduce((sum, txn) => {
        return String(txn.type || '').toLowerCase() === 'credit'
            ? sum + Number(txn.amount || 0)
            : sum;
    }, 0);

    const totalDebits = txns.reduce((sum, txn) => {
        return String(txn.type || '').toLowerCase() === 'debit'
            ? sum + Math.abs(Number(txn.amount || 0))
            : sum;
    }, 0);

    const totalDeposits = txns.reduce((sum, txn) => {
        const category = String(txn.category || '').toLowerCase();
        const type = String(txn.type || '').toLowerCase();
        const status = String(txn.status || '').toLowerCase();

        const validStatus = ['completed', 'success', 'approved'];
        const isValid = !status || validStatus.includes(status);

        return category === 'add_money' && type === 'credit' && isValid
            ? sum + Number(txn.amount || 0)
            : sum;
    }, 0);

    const totalWithdrawals = txns.reduce((sum, txn) => {
        const category = String(txn.category || '').toLowerCase();
        const type = String(txn.type || '').toLowerCase();
        const status = String(txn.status || '').toLowerCase();

        const validStatus = ['completed', 'success', 'approved', 'pending', 'rejected'];
        const isValid = !status || validStatus.includes(status);

        return category === 'withdrawal' && type === 'debit' && isValid
            ? sum + Math.abs(Number(txn.amount || 0))
            : sum;
    }, 0);

    const totalInterestFromTransactions = txns.reduce((sum, txn) => {
        const category = String(txn.category || '').toLowerCase();
        const type = String(txn.type || '').toLowerCase();
        const status = String(txn.status || '').toLowerCase();

        const isInterest = ['interest', 'daily_interest', 'return', 'profit'].includes(category);
        const isValid = !status || ['completed', 'success', 'approved'].includes(status);

        return isInterest && type === 'credit' && isValid
            ? sum + Number(txn.amount || 0)
            : sum;
    }, 0);

    const totalInterestEarned =
        totalInterestFromTransactions ||
        investments.reduce((sum, item) => sum + Number(item.totalInterestEarned || 0), 0);

    const walletBalance = Number(user.walletBalance || 0);
    const totalInvested = investments.reduce((sum, item) => sum + Number(item.amount || 0), 0);
    const principalInSystem = walletBalance + totalInvested;

    return {
        walletBalance,
        totalTransactions: txns.length,
        totalCredits,
        totalDebits,
        totalDeposits,
        totalWithdrawals,
        totalInterestEarned,
        totalInvestments: investments.length,
        principalInSystem,
    };
};


const UserDetails = () => {
    const { userId } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { userDetails, detailsStatus, balanceUpdateStatus, error } = useSelector(
        (state) => state.users
    );

    const {
        transactions: allTransactions = [],
        loading: transactionsLoading,
    } = useSelector((state) => state.transactions);

    const [showBalanceModal, setShowBalanceModal] = useState(false);

    useEffect(() => {
        if (userId) {
            dispatch(fetchUserDetails(userId));
            dispatch(
                fetchTransactions({
                    page: 1,
                    limit: 1000,
                })
            );
        }

        return () => {
            dispatch(resetBalanceUpdateStatus());
        };
    }, [dispatch, userId]);

    const fullUserTransactions = useMemo(() => {
        if (!Array.isArray(allTransactions)) return [];
        return allTransactions.filter((txn) => String(getTxnUserId(txn)) === String(userId));
    }, [allTransactions, userId]);

    const portfolioData = useMemo(() => buildPortfolioSummary(userDetails || {}), [userDetails]);

    const adminStats = useMemo(
        () => buildAdminStats(userDetails || {}, fullUserTransactions),
        [userDetails, fullUserTransactions]
    );

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
        <div className="min-h-screen bg-slate-50 p-4 md:p-6">
            <div className="mb-8 flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                <div className="flex items-start gap-4">
                    <button
                        onClick={() => navigate('/dashboard/users')}
                        className="group rounded-2xl border border-slate-200 bg-white p-3 shadow-sm transition hover:bg-slate-50"
                        type="button"
                    >
                        <ArrowLeft className="text-slate-600 group-hover:text-slate-900" size={22} />
                    </button>

                    <div>
                        <h1 className="text-3xl font-bold text-slate-900">User Details</h1>
                        <p className="mt-1 text-slate-600">
                            Admin overview of profile, wallet, transactions, and bank details
                        </p>
                    </div>
                </div>

                <div className="flex flex-wrap gap-3">
                    <button
                        onClick={() => {
                            dispatch(fetchUserDetails(userId));
                            dispatch(fetchTransactions({ page: 1, limit: 1000 }));
                        }}
                        className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3 font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
                        type="button"
                    >
                        <RefreshCw size={18} />
                        Refresh
                    </button>

                    <button
                        onClick={() => navigate(`/dashboard/users/${userId}/investments`)}
                        className="inline-flex items-center gap-2 rounded-2xl border border-violet-200 bg-violet-50 px-5 py-3 font-semibold text-violet-700 shadow-sm transition hover:bg-violet-100"
                        type="button"
                    >
                        <ExternalLink size={18} />
                        View Investments
                    </button>

                    <button
                        onClick={() => setShowBalanceModal(true)}
                        className="inline-flex items-center gap-2 rounded-2xl bg-blue-600 px-5 py-3 font-semibold text-white shadow-sm transition hover:bg-blue-700"
                        type="button"
                    >
                        <Wallet size={18} />
                        {balanceUpdateStatus === 'loading' ? 'Updating...' : 'Update Balance'}
                    </button>
                </div>
            </div>

            <div className="space-y-6">
                <UserProfileCard user={user} />

                <UserBalanceCards user={user} portfolio={portfolioData} stats={adminStats} />

                <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                        <div>
                            <h3 className="text-xl font-bold text-slate-900">Investments & Orders</h3>
                            <p className="mt-1 text-sm text-slate-500">
                                Open the separate page to inspect all investment records, statuses, returns, lock details, and order activity.
                            </p>
                        </div>

                        <button
                            onClick={() => navigate(`/dashboard/users/${userId}/investments`)}
                            className="inline-flex items-center gap-2 rounded-2xl bg-violet-600 px-5 py-3 font-semibold text-white shadow-sm transition hover:bg-violet-700"
                            type="button"
                        >
                            <ExternalLink size={18} />
                            Open Full Investments Page
                        </button>
                    </div>
                </div>

                <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                        <div>
                            <h3 className="text-xl font-bold text-slate-900">View All Transactions</h3>
                            <p className="mt-1 text-sm text-slate-500">
                                All transaction records, types, categories, and statuses.
                            </p>
                        </div>


                        <button
                            onClick={() => navigate(`/dashboard/users/${userId}/transactions`)}
                            className="inline-flex items-center gap-2 rounded-2xl border border-blue-200 bg-blue-50 px-5 py-3 font-semibold text-blue-700 shadow-sm transition hover:bg-blue-100"
                            type="button"
                        >
                            <ExternalLink size={18} />
                            View Transactions
                        </button>
                    </div>
                </div>


                <UserBankDetails user={user} />
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