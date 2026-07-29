import { useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
    fetchUserDetails,
    resetBalanceUpdateStatus,
} from '../../store/slices/usersSlice';
import { fetchTransactions } from '../../store/slices/transactionsSlice';
import {
    ArrowLeft,
    RefreshCw,
    ExternalLink,
    CircleDollarSign,
} from 'lucide-react';
import Loading from '../../components/Loader';

import UserTransactions from '../../components/Users/UserTransactions';

const getTxnUserId = (txn = {}) => {
    if (!txn?.userId) return '';
    if (typeof txn.userId === 'string') return txn.userId;
    return txn.userId?._id || txn.userId?.id || '';
};

const UserTransactionsPage = () => {
    const { userId } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { userDetails, detailsStatus, error } = useSelector((state) => state.users);

    const {
        transactions: allTransactions = [],
        loading: transactionsLoading,
    } = useSelector((state) => state.transactions);

    useEffect(() => {
        if (userId) {
            dispatch(fetchUserDetails(userId));
            dispatch(fetchTransactions({ page: 1, limit: 1000 }));
        }

        return () => {
            dispatch(resetBalanceUpdateStatus());
        };
    }, [dispatch, userId]);

    const fullUserTransactions = useMemo(() => {
        if (!Array.isArray(allTransactions)) return [];
        return allTransactions.filter((txn) => String(getTxnUserId(txn)) === String(userId));
    }, [allTransactions, userId]);

    if (detailsStatus === 'loading') {
        return <Loading message="Loading transactions..." />;
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
                    {error || 'Failed to load user transactions'}
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
                        <h1 className="text-3xl font-bold text-slate-900">Transactions</h1>
                        <p className="mt-1 text-slate-600">
                            Full transaction history for {user.fullName || user.name || 'this user'}
                        </p>
                    </div>
                </div>

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
            </div>

            {transactionsLoading && !fullUserTransactions.length ? (
                <Loading message="Loading transactions..." />
            ) : (
                <UserTransactions transactions={fullUserTransactions} />
            )}
        </div>
    );
};

export default UserTransactionsPage;