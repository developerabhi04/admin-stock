import { useMemo, useState } from 'react';
import {
    ArrowDownLeft,
    ArrowUpRight,
    Filter,
    Search,
    Wallet,
    Landmark,
    BadgeIndianRupee,
    Layers3,
    TrendingUp,
    CircleDollarSign,
} from 'lucide-react';

const formatCurrency = (value) => `₹${Number(value || 0).toLocaleString('en-IN')}`;

const formatDateTime = (value) => {
    if (!value) return '-';

    try {
        return new Date(value).toLocaleString('en-IN', {
            dateStyle: 'medium',
            timeStyle: 'short',
        });
    } catch {
        return '-';
    }
};

const toTitleCase = (value = '') =>
    String(value)
        .replace(/_/g, ' ')
        .replace(/\b\w/g, (char) => char.toUpperCase());

const normalizeTransaction = (txn = {}, index = 0) => {
    const category = String(txn.category || 'other').toLowerCase();
    const type = String(txn.type || 'debit').toLowerCase();
    const status = String(txn.status || 'pending').toLowerCase();

    const reference =
        txn.referenceId ||
        txn.transactionId ||
        txn.orderId ||
        txn.paymentId ||
        txn._id ||
        `txn-${index}`;

    const note =
        txn.description ||
        txn.remark ||
        txn.note ||
        txn.message ||
        txn.reason ||
        txn.adminNote ||
        '';

    const titleMap = {
        add_money: 'Add Money',
        withdrawal: 'Withdrawal',
        signup_bonus: 'Signup Bonus',
        interest: 'Interest Credit',
        daily_interest: 'Daily Interest',
        return: 'Return Credit',
        profit: 'Profit Credit',
        index_purchase: 'Index Purchase',
        stock_purchase: 'Stock Purchase',
        investment: 'Investment',
        purchase: 'Purchase',
        wallet_adjustment: 'Wallet Adjustment',
    };

    return {
        ...txn,
        _normalizedId: reference,
        _normalizedCategory: category,
        _normalizedType: type,
        _normalizedStatus: status,
        _normalizedTitle: titleMap[category] || toTitleCase(category || (type === 'credit' ? 'credit transaction' : 'debit transaction')),
        _normalizedAmount: Number(txn.amount || 0),
        _normalizedDate: txn.createdAt || txn.updatedAt || null,
        _normalizedNote: note,
    };
};

const getStatusClass = (status) => {
    if (['completed', 'success', 'approved'].includes(status)) {
        return 'bg-emerald-100 text-emerald-700';
    }

    if (['pending', 'processing', 'initiated'].includes(status)) {
        return 'bg-amber-100 text-amber-700';
    }

    if (['rejected', 'failed', 'cancelled'].includes(status)) {
        return 'bg-red-100 text-red-700';
    }

    return 'bg-slate-100 text-slate-700';
};

const getTypeIcon = (txn) => {
    const category = txn._normalizedCategory;
    const type = txn._normalizedType;

    if (category === 'add_money') return Wallet;
    if (category === 'withdrawal') return Landmark;
    if (['interest', 'daily_interest', 'return', 'profit'].includes(category)) return TrendingUp;
    if (['index_purchase', 'stock_purchase', 'investment', 'purchase'].includes(category)) return Layers3;
    if (category === 'signup_bonus') return BadgeIndianRupee;
    return type === 'credit' ? ArrowDownLeft : ArrowUpRight;
};

const getTypeClass = (txn) => {
    const category = txn._normalizedCategory;
    const type = txn._normalizedType;

    if (category === 'add_money') return 'bg-cyan-50 text-cyan-600';
    if (category === 'withdrawal') return 'bg-rose-50 text-rose-600';
    if (['interest', 'daily_interest', 'return', 'profit'].includes(category)) return 'bg-emerald-50 text-emerald-600';
    if (['index_purchase', 'stock_purchase', 'investment', 'purchase'].includes(category)) return 'bg-violet-50 text-violet-600';
    if (category === 'signup_bonus') return 'bg-amber-50 text-amber-600';
    return type === 'credit' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600';
};

const UserTransactions = ({ transactions = [] }) => {
    const [statusFilter, setStatusFilter] = useState('all');
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [search, setSearch] = useState('');

    const normalizedTransactions = useMemo(() => {
        return Array.isArray(transactions)
            ? transactions.map((txn, index) => normalizeTransaction(txn, index))
            : [];
    }, [transactions]);

    const categories = useMemo(() => {
        const allCategories = normalizedTransactions.map((txn) => txn._normalizedCategory);
        return ['all', ...Array.from(new Set(allCategories))];
    }, [normalizedTransactions]);

    const filteredTransactions = useMemo(() => {
        return normalizedTransactions.filter((txn) => {
            const matchesStatus =
                statusFilter === 'all' ? true : txn._normalizedStatus === statusFilter;

            const matchesCategory =
                categoryFilter === 'all' ? true : txn._normalizedCategory === categoryFilter;

            const query = search.trim().toLowerCase();
            const matchesSearch =
                !query ||
                txn._normalizedTitle.toLowerCase().includes(query) ||
                txn._normalizedId.toLowerCase().includes(query) ||
                txn._normalizedCategory.toLowerCase().includes(query) ||
                txn._normalizedNote.toLowerCase().includes(query);

            return matchesStatus && matchesCategory && matchesSearch;
        });
    }, [normalizedTransactions, statusFilter, categoryFilter, search]);

    if (!normalizedTransactions.length) {
        return (
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="py-14 text-center">
                    <CircleDollarSign className="mx-auto mb-4 text-slate-300" size={46} />
                    <p className="font-medium text-slate-600">No transactions found</p>
                    <p className="mt-1 text-sm text-slate-400">
                        Deposit, withdrawal, purchase, bonus, and interest records will appear here.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                    <h3 className="text-2xl font-bold text-slate-900">Transactions</h3>
                    <p className="mt-1 text-sm text-slate-500">
                        Full user transaction history including deposit, withdrawal, purchase, bonus, and earnings
                    </p>
                </div>

                <div className="rounded-2xl bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700">
                    {filteredTransactions.length} of {normalizedTransactions.length} records
                </div>
            </div>

            <div className="mb-6 grid grid-cols-1 gap-3 md:grid-cols-3">
                <div className="relative">
                    <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search by id, type, note..."
                        className="min-h-[44px] w-full rounded-2xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm outline-none transition focus:border-blue-500"
                    />
                </div>

                <div className="relative">
                    <Filter size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="min-h-[44px] w-full appearance-none rounded-2xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm outline-none transition focus:border-blue-500"
                    >
                        <option value="all">All Status</option>
                        <option value="completed">Completed</option>
                        <option value="success">Success</option>
                        <option value="approved">Approved</option>
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="initiated">Initiated</option>
                        <option value="rejected">Rejected</option>
                        <option value="failed">Failed</option>
                        <option value="cancelled">Cancelled</option>
                    </select>
                </div>

                <div>
                    <select
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                        className="min-h-[44px] w-full appearance-none rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500"
                    >
                        {categories.map((category) => (
                            <option key={category} value={category}>
                                {category === 'all' ? 'All Categories' : toTitleCase(category)}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full">
                    <thead>
                        <tr className="border-b border-slate-200 bg-slate-50 text-left text-xs font-bold uppercase tracking-wide text-slate-600">
                            <th className="px-4 py-3">Transaction</th>
                            <th className="px-4 py-3">Category</th>
                            <th className="px-4 py-3">Amount</th>
                            <th className="px-4 py-3">Status</th>
                            <th className="px-4 py-3">Date</th>
                            <th className="px-4 py-3">Note</th>
                        </tr>
                    </thead>

                    <tbody>
                        {filteredTransactions.map((txn, index) => {
                            const Icon = getTypeIcon(txn);
                            const iconClass = getTypeClass(txn);
                            const isCredit = txn._normalizedType === 'credit';

                            return (
                                <tr
                                    key={txn._normalizedId || index}
                                    className="border-b border-slate-100 transition hover:bg-slate-50"
                                >
                                    <td className="px-4 py-4">
                                        <div className="flex items-start gap-3">
                                            <div className={`rounded-2xl p-2.5 ${iconClass}`}>
                                                <Icon size={18} />
                                            </div>
                                            <div>
                                                <p className="font-semibold text-slate-900">{txn._normalizedTitle}</p>
                                                <p className="mt-1 text-xs text-slate-500">{txn._normalizedId}</p>
                                            </div>
                                        </div>
                                    </td>

                                    <td className="px-4 py-4">
                                        <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                                            {toTitleCase(txn._normalizedCategory)}
                                        </span>
                                    </td>

                                    <td className="px-4 py-4">
                                        <span className={`text-base font-bold ${isCredit ? 'text-emerald-600' : 'text-red-600'}`}>
                                            {isCredit ? '+' : '-'}
                                            {formatCurrency(Math.abs(txn._normalizedAmount))}
                                        </span>
                                    </td>

                                    <td className="px-4 py-4">
                                        <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold capitalize ${getStatusClass(txn._normalizedStatus)}`}>
                                            {txn._normalizedStatus}
                                        </span>
                                    </td>

                                    <td className="px-4 py-4 text-sm text-slate-600">
                                        {formatDateTime(txn._normalizedDate)}
                                    </td>

                                    <td className="px-4 py-4 text-sm text-slate-600">
                                        {txn._normalizedNote || '-'}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default UserTransactions;