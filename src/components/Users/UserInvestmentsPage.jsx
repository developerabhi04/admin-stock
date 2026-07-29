import { useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
    fetchUserDetails,
    resetBalanceUpdateStatus,
} from '../../store/slices/usersSlice';
import {
    ArrowLeft,
    RefreshCw,
    Layers3,
    ArrowUpRight,
    Wallet,
    Clock3,
    CheckCircle2,
    Ban,
    Unlock,
    TrendingUp,
} from 'lucide-react';
import Loading from '../../components/Loader';
import UserOrders from '../../components/Users/UserOrders';

const formatCurrency = (value) => `₹${Number(value || 0).toLocaleString('en-IN')}`;

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
        investments.reduce((sum, item) => {
            return sum + Number(item.amount || 0) + Number(item.totalInterestEarned || 0);
        }, 0);

    const totalPnL =
        backendPortfolio.totalPnL ??
        backendPortfolio.totalInterestEarned ??
        currentValue - totalInvested;

    const totalPnLPercent =
        backendPortfolio.totalPnLPercent ??
        (Number(totalInvested || 0) > 0
            ? (Number(totalPnL || 0) / Number(totalInvested || 1)) * 100
            : 0);

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

const buildOrdersFromInvestments = (userDetails = {}) => {
    if (userDetails.investmentOrders) {
        const safe = userDetails.investmentOrders;

        return {
            pending: Array.isArray(safe.pending) ? safe.pending : [],
            active: Array.isArray(safe.active) ? safe.active : [],
            unlocked: Array.isArray(safe.unlocked) ? safe.unlocked : [],
            completed: Array.isArray(safe.completed) ? safe.completed : [],
            cancelled: Array.isArray(safe.cancelled) ? safe.cancelled : [],
            all: Array.isArray(safe.all) ? safe.all : [],
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
        symbol:
            item.symbol ||
            item.indexSnapshot?.symbol ||
            item.index?.symbol ||
            item.indexId?.symbol ||
            '',
        quantity: Number(item.quantity || item.units || 1),
        price:
            Number(item.price || item.unitPrice || 0) ||
            Number(item.amount || 0) / Math.max(Number(item.quantity || item.units || 1), 1),
        totalAmount: Number(item.totalAmount || item.amount || 0),
        orderDate: item.orderDate || item.orderPlacedAt || item.createdAt || null,
        status: item.status || 'pending',
        reason: item.reason || item.rejectionReason || '',
        amount: Number(item.amount || 0),
        totalInterestEarned: Number(item.totalInterestEarned || 0),
        dailyInterestAmount: Number(item.dailyInterestAmount || item.dailyReturn || 0),
        effectiveDailyRate: Number(item.effectiveDailyRate || item.dailyRate || item.returnRate || 0),
        daysCompleted: Number(item.daysCompleted || 0),
        daysRemaining: Number(item.daysRemaining || 0),
        lockPeriodDays: Number(item.lockPeriodDays || 0),
        isLockCompleted: Boolean(item.isLockCompleted),
    }));

    return {
        pending: mapped.filter((item) =>
            ['pending', 'processing', 'initiated'].includes(String(item.status).toLowerCase())
        ),
        active: mapped.filter((item) => String(item.status).toLowerCase() === 'active'),
        unlocked: mapped.filter((item) => String(item.status).toLowerCase() === 'unlocked'),
        completed: mapped.filter((item) =>
            ['completed', 'approved', 'closed', 'closed_reinvested'].includes(
                String(item.status).toLowerCase()
            )
        ),
        cancelled: mapped.filter((item) =>
            ['cancelled', 'rejected', 'failed'].includes(String(item.status).toLowerCase())
        ),
        all: mapped,
    };
};

const TopCard = ({ title, value, note, icon: Icon, tone = 'blue' }) => {
    const toneMap = {
        blue: 'bg-blue-50 border-blue-100 text-blue-700',
        emerald: 'bg-emerald-50 border-emerald-100 text-emerald-700',
        violet: 'bg-violet-50 border-violet-100 text-violet-700',
        orange: 'bg-orange-50 border-orange-100 text-orange-700',
        red: 'bg-red-50 border-red-100 text-red-700',
        amber: 'bg-amber-50 border-amber-100 text-amber-700',
        slate: 'bg-slate-50 border-slate-200 text-slate-700',
    };

    return (
        <div className={`rounded-2xl border p-5 shadow-sm ${toneMap[tone] || toneMap.blue}`}>
            <div className="mb-3 flex items-center justify-between">
                <div className="rounded-xl bg-white/80 p-3 shadow-sm">
                    <Icon size={20} />
                </div>
            </div>
            <p className="text-sm font-medium opacity-80">{title}</p>
            <p className="mt-2 text-2xl font-bold">{value}</p>
            <p className="mt-2 text-xs opacity-80">{note}</p>
        </div>
    );
};

const UserInvestmentsPage = () => {
    const { userId } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { userDetails, detailsStatus, error } = useSelector((state) => state.users);

    useEffect(() => {
        if (userId) {
            dispatch(fetchUserDetails(userId));
        }

        return () => {
            dispatch(resetBalanceUpdateStatus());
        };
    }, [dispatch, userId]);

    const portfolioData = useMemo(() => buildPortfolioSummary(userDetails || {}), [userDetails]);
    const ordersData = useMemo(() => buildOrdersFromInvestments(userDetails || {}), [userDetails]);

    if (detailsStatus === 'loading') {
        return <Loading message="Loading investments and orders..." />;
    }

    if (detailsStatus === 'failed') {
        return (
            <div className="p-6">
                <button
                    onClick={() => navigate(`/dashboard/users/${userId}`)}
                    className="mb-4 inline-flex items-center gap-2 rounded-lg border px-4 py-2"
                    type="button"
                >
                    <ArrowLeft size={18} />
                    Back to user details
                </button>
                <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
                    {error || 'Failed to load user investments'}
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
                        onClick={() => navigate(`/dashboard/users/${userId}`)}
                        className="group rounded-2xl border border-slate-200 bg-white p-3 shadow-sm transition hover:bg-slate-50"
                        type="button"
                    >
                        <ArrowLeft className="text-slate-600 group-hover:text-slate-900" size={22} />
                    </button>

                    <div>
                        <h1 className="text-3xl font-bold text-slate-900">Investments & Orders</h1>
                        <p className="mt-1 text-slate-600">
                            Full investment activity for {user.fullName || user.name || 'this user'}
                        </p>
                    </div>
                </div>

                <button
                    onClick={() => dispatch(fetchUserDetails(userId))}
                    className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3 font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
                    type="button"
                >
                    <RefreshCw size={18} />
                    Refresh
                </button>
            </div>

            <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
                <TopCard
                    title="Total Invested"
                    value={formatCurrency(portfolioData.totalInvested)}
                    note={`${portfolioData.statusBuckets.all} total investments`}
                    icon={Wallet}
                    tone="emerald"
                />
                <TopCard
                    title="Current Value"
                    value={formatCurrency(portfolioData.currentValue)}
                    note={`Active invested ${formatCurrency(portfolioData.activeInvested)}`}
                    icon={Layers3}
                    tone="blue"
                />
                <TopCard
                    title="Total Return"
                    value={formatCurrency(portfolioData.totalPnL)}
                    note={`${portfolioData.totalPnLPercent.toFixed(2)}% overall return`}
                    icon={TrendingUp}
                    tone="violet"
                />
                <TopCard
                    title="Today Earnings"
                    value={formatCurrency(portfolioData.todayPnL)}
                    note="Daily earnings across investments"
                    icon={ArrowUpRight}
                    tone="orange"
                />
            </div>

            <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-6">
                <TopCard
                    title="Active"
                    value={portfolioData.statusBuckets.active}
                    note="Running investments"
                    icon={TrendingUp}
                    tone="emerald"
                />
                <TopCard
                    title="Pending"
                    value={portfolioData.statusBuckets.pending}
                    note="Awaiting action"
                    icon={Clock3}
                    tone="amber"
                />
                <TopCard
                    title="Unlocked"
                    value={portfolioData.statusBuckets.unlocked}
                    note="Ready for next action"
                    icon={Unlock}
                    tone="blue"
                />
                <TopCard
                    title="Completed"
                    value={portfolioData.statusBuckets.completed}
                    note="Completed orders"
                    icon={CheckCircle2}
                    tone="violet"
                />
                <TopCard
                    title="Closed"
                    value={portfolioData.statusBuckets.closed}
                    note="Closed or reinvested"
                    icon={Layers3}
                    tone="slate"
                />
                <TopCard
                    title="Cancelled"
                    value={portfolioData.statusBuckets.cancelled}
                    note="Rejected or failed"
                    icon={Ban}
                    tone="red"
                />
            </div>

            <UserOrders orders={ordersData} />
        </div>
    );
};

export default UserInvestmentsPage;