import { CreditCard, TrendingUp, TrendingDown } from 'lucide-react';

const UserTransactions = ({ transactions }) => {
    return (
        <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-6 mb-8">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                        <CreditCard className="text-blue-600" size={24} />
                        Recent Transactions
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">Wallet transactions history</p>
                </div>
            </div>
            <div className="overflow-x-auto">
                {transactions?.length > 0 ? (
                    <table className="w-full">
                        <thead>
                            <tr className="border-b-2 border-gray-200 bg-gray-50">
                                <th className="text-left py-3 px-4 text-xs font-bold text-gray-600 uppercase">Type</th>
                                <th className="text-right py-3 px-4 text-xs font-bold text-gray-600 uppercase">Amount</th>
                                <th className="text-center py-3 px-4 text-xs font-bold text-gray-600 uppercase">Status</th>
                                <th className="text-left py-3 px-4 text-xs font-bold text-gray-600 uppercase">Date</th>
                                <th className="text-left py-3 px-4 text-xs font-bold text-gray-600 uppercase">Description</th>
                            </tr>
                        </thead>
                        <tbody>
                            {transactions.slice(0, 10).map((txn) => (
                                <tr key={txn._id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                                    <td className="py-4 px-4">
                                        <div className="flex items-center gap-2">
                                            {txn.type === 'credit' ? (
                                                <TrendingUp className="text-green-500" size={18} />
                                            ) : (
                                                <TrendingDown className="text-red-500" size={18} />
                                            )}
                                            <span className="font-semibold text-gray-900 capitalize">
                                                {txn.category?.replace('_', ' ')}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="py-4 px-4 text-right">
                                        <span className={`font-bold text-lg ${txn.type === 'credit' ? 'text-green-600' : 'text-red-600'
                                            }`}>
                                            {txn.type === 'credit' ? '+' : '-'}₹{txn.amount.toLocaleString()}
                                        </span>
                                    </td>
                                    <td className="py-4 px-4 text-center">
                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${txn.status === 'completed'
                                                ? 'bg-green-100 text-green-700'
                                                : txn.status === 'pending'
                                                    ? 'bg-yellow-100 text-yellow-700'
                                                    : 'bg-red-100 text-red-700'
                                            }`}>
                                            {txn.status}
                                        </span>
                                    </td>
                                    <td className="py-4 px-4">
                                        <p className="text-sm text-gray-600">
                                            {new Date(txn.createdAt).toLocaleString('en-IN', {
                                                dateStyle: 'short',
                                                timeStyle: 'short'
                                            })}
                                        </p>
                                    </td>
                                    <td className="py-4 px-4">
                                        <p className="text-sm text-gray-600">{txn.description || '-'}</p>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <div className="text-center py-12">
                        <CreditCard className="mx-auto text-gray-400 mb-4" size={48} />
                        <p className="text-gray-600">No transactions yet</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserTransactions;
