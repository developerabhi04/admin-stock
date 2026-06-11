import { CreditCard, TrendingUp, TrendingDown } from 'lucide-react';

const formatCurrency = (value) => `₹${Number(value || 0).toLocaleString('en-IN')}`;

const UserTransactions = ({ transactions = [] }) => {
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
                {transactions.length > 0 ? (
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
                            {transactions.slice(0, 10).map((txn, index) => {
                                const isCredit = txn.type === 'credit';

                                return (
                                    <tr
                                        key={txn._id || txn.transactionId || index}
                                        className="border-b border-slate-100 transition hover:bg-slate-50"
                                    >
                                        <td className="px-4 py-4">
                                            <div className="flex items-center gap-2">
                                                {isCredit ? (
                                                    <TrendingUp className="text-emerald-500" size={18} />
                                                ) : (
                                                    <TrendingDown className="text-red-500" size={18} />
                                                )}
                                                <span className="font-semibold capitalize text-slate-900">
                                                    {(txn.category || txn.type || '-').replace(/_/g, ' ')}
                                                </span>
                                            </div>
                                        </td>

                                        <td className="px-4 py-4 text-right">
                                            <span
                                                className={`text-lg font-bold ${isCredit ? 'text-emerald-600' : 'text-red-600'
                                                    }`}
                                            >
                                                {isCredit ? '+' : '-'}
                                                {formatCurrency(txn.amount)}
                                            </span>
                                        </td>

                                        <td className="px-4 py-4 text-center">
                                            <span
                                                className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold capitalize ${txn.status === 'completed'
                                                        ? 'bg-emerald-100 text-emerald-700'
                                                        : txn.status === 'pending'
                                                            ? 'bg-amber-100 text-amber-700'
                                                            : 'bg-red-100 text-red-700'
                                                    }`}
                                            >
                                                {txn.status || '-'}
                                            </span>
                                        </td>

                                        <td className="px-4 py-4">
                                            <p className="text-sm text-slate-600">
                                                {txn.createdAt
                                                    ? new Date(txn.createdAt).toLocaleString('en-IN', {
                                                        dateStyle: 'short',
                                                        timeStyle: 'short',
                                                    })
                                                    : '-'}
                                            </p>
                                        </td>

                                        <td className="px-4 py-4">
                                            <p className="text-sm text-slate-600">{txn.description || '-'}</p>
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
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserTransactions;