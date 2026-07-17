import {
    CreditCard,
    TrendingUp,
    TrendingDown,
    CalendarDays,
    FileText,
    Hash,
} from 'lucide-react';

const formatCurrency = (value) => `₹${Number(value || 0).toLocaleString('en-IN')}`;

const formatDateTime = (value) => {
    if (!value) return '-';

    try {
        return new Date(value).toLocaleString('en-IN', {
            dateStyle: 'short',
            timeStyle: 'short',
        });
    } catch {
        return '-';
    }
};

const formatLabel = (value) => {
    if (!value) return '-';

    return String(value)
        .replace(/_/g, ' ')
        .replace(/\b\w/g, (char) => char.toUpperCase());
};

const getStatusBadgeClass = (status) => {
    const normalized = String(status || '').toLowerCase();

    if (['completed', 'success', 'approved', 'verified'].includes(normalized)) {
        return 'bg-emerald-100 text-emerald-700';
    }

    if (['pending', 'processing', 'initiated'].includes(normalized)) {
        return 'bg-amber-100 text-amber-700';
    }

    return 'bg-red-100 text-red-700';
};

const getTransactionMeta = (txn = {}) => {
    const type = String(txn.type || '').toLowerCase();
    const amount = Number(txn.amount || 0);

    if (type === 'credit') {
        return {
            isCredit: true,
            sign: '+',
            icon: TrendingUp,
            amountClass: 'text-emerald-600',
            iconClass: 'text-emerald-500',
        };
    }

    if (type === 'debit') {
        return {
            isCredit: false,
            sign: '-',
            icon: TrendingDown,
            amountClass: 'text-red-600',
            iconClass: 'text-red-500',
        };
    }

    if (amount >= 0) {
        return {
            isCredit: true,
            sign: '+',
            icon: TrendingUp,
            amountClass: 'text-emerald-600',
            iconClass: 'text-emerald-500',
        };
    }

    return {
        isCredit: false,
        sign: '-',
        icon: TrendingDown,
        amountClass: 'text-red-600',
        iconClass: 'text-red-500',
    };
};

const UserTransactions = ({ transactions = [] }) => {
    const safeTransactions = Array.isArray(transactions) ? transactions.slice(0, 10) : [];

    return (
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h3 className="flex items-center gap-2 text-2xl font-bold text-slate-900">
                        <CreditCard className="text-blue-600" size={24} />
                        Recent Transactions
                    </h3>
                    <p className="mt-1 text-sm text-slate-500">Wallet transactions history</p>
                </div>
            </div>

            <div className="overflow-x-auto">
                {safeTransactions.length > 0 ? (
                    <table className="min-w-full">
                        <thead>
                            <tr className="border-b border-slate-200 bg-slate-50 text-left text-xs font-bold uppercase tracking-wide text-slate-600">
                                <th className="px-4 py-3">Type</th>
                                <th className="px-4 py-3 text-right">Amount</th>
                                <th className="px-4 py-3 text-center">Status</th>
                                <th className="px-4 py-3">Date</th>
                                <th className="px-4 py-3">Description</th>
                            </tr>
                        </thead>

                        <tbody>
                            {safeTransactions.map((txn, index) => {
                                const meta = getTransactionMeta(txn);
                                const Icon = meta.icon;

                                return (
                                    <tr
                                        key={txn._id || txn.transactionId || txn.referenceId || index}
                                        className="border-b border-slate-100 transition hover:bg-slate-50"
                                    >
                                        <td className="px-4 py-4">
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2">
                                                    <Icon className={meta.iconClass} size={18} />
                                                    <span className="font-semibold text-slate-900">
                                                        {formatLabel(txn.category || txn.type || '-')}
                                                    </span>
                                                </div>

                                                {(txn.transactionId || txn.referenceId) && (
                                                    <div className="flex items-center gap-1 text-xs text-slate-400">
                                                        <Hash size={12} />
                                                        <span>{txn.transactionId || txn.referenceId}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </td>

                                        <td className="px-4 py-4 text-right">
                                            <span className={`text-lg font-bold ${meta.amountClass}`}>
                                                {meta.sign}
                                                {formatCurrency(Math.abs(Number(txn.amount || 0)))}
                                            </span>
                                        </td>

                                        <td className="px-4 py-4 text-center">
                                            <span
                                                className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold capitalize ${getStatusBadgeClass(
                                                    txn.status
                                                )}`}
                                            >
                                                {String(txn.status || '-').replace(/_/g, ' ')}
                                            </span>
                                        </td>

                                        <td className="px-4 py-4">
                                            <div className="flex items-center gap-2 text-sm text-slate-600">
                                                <CalendarDays size={15} className="text-slate-400" />
                                                <span>{formatDateTime(txn.createdAt || txn.date)}</span>
                                            </div>
                                        </td>

                                        <td className="px-4 py-4">
                                            <div className="flex items-start gap-2 text-sm text-slate-600">
                                                <FileText size={15} className="mt-0.5 shrink-0 text-slate-400" />
                                                <p className="max-w-md">
                                                    {txn.description || txn.remark || txn.note || '-'}
                                                </p>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                ) : (
                    <div className="py-14 text-center">
                        <CreditCard className="mx-auto mb-4 text-slate-300" size={46} />
                        <p className="font-medium text-slate-600">No transactions yet</p>
                        <p className="mt-1 text-sm text-slate-400">
                            Recent wallet activity will appear here.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserTransactions;