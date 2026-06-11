import { TrendingUp, TrendingDown, Target } from 'lucide-react';

const formatCurrency = (value) => `₹${Number(value || 0).toLocaleString('en-IN')}`;
const formatNumber = (value) => Number(value || 0).toLocaleString('en-IN');

const UserHoldings = ({ holdings = [], portfolio = {} }) => {
    return (
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div>
                    <h3 className="text-2xl font-bold text-slate-900">Holdings</h3>
                    <p className="mt-1 text-sm text-slate-500">Active index investments</p>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div className="rounded-2xl bg-slate-50 px-4 py-3">
                        <p className="text-sm text-slate-500">Total Invested</p>
                        <p className="mt-1 text-xl font-bold text-slate-900">
                            {formatCurrency(portfolio.totalInvested)}
                        </p>
                    </div>
                    <div className="rounded-2xl bg-blue-50 px-4 py-3">
                        <p className="text-sm text-slate-500">Current Value</p>
                        <p className="mt-1 text-xl font-bold text-blue-600">
                            {formatCurrency(portfolio.currentValue)}
                        </p>
                    </div>
                </div>
            </div>

            <div className="overflow-x-auto">
                {holdings.length > 0 ? (
                    <table className="min-w-full">
                        <thead>
                            <tr className="border-b border-slate-200 bg-slate-50 text-left text-xs font-bold uppercase tracking-wide text-slate-600">
                                <th className="px-4 py-3">Index</th>
                                <th className="px-4 py-3 text-center">Qty</th>
                                <th className="px-4 py-3 text-right">Avg Price</th>
                                <th className="px-4 py-3 text-right">Current Price</th>
                                <th className="px-4 py-3 text-right">Invested</th>
                                <th className="px-4 py-3 text-right">Current Value</th>
                                <th className="px-4 py-3 text-right">P&amp;L</th>
                                <th className="px-4 py-3 text-center">Return %</th>
                            </tr>
                        </thead>

                        <tbody>
                            {holdings.map((holding, index) => {
                                const pnl = Number(holding.pnl || 0);
                                const pnlPercent = Number(holding.pnlPercent || 0);
                                const isProfit = pnl >= 0;

                                return (
                                    <tr
                                        key={holding._id || holding.holdingId || index}
                                        className="border-b border-slate-100 transition hover:bg-slate-50"
                                    >
                                        <td className="px-4 py-4">
                                            <div>
                                                <p className="font-semibold text-slate-900">
                                                    {holding.indexName || holding.index?.name || '-'}
                                                </p>
                                                <p className="mt-1 text-xs text-slate-500">
                                                    {holding.purchaseDate
                                                        ? new Date(holding.purchaseDate).toLocaleDateString('en-IN', {
                                                            dateStyle: 'medium',
                                                        })
                                                        : '-'}
                                                </p>
                                            </div>
                                        </td>

                                        <td className="px-4 py-4 text-center">
                                            <span className="inline-flex rounded-full bg-blue-100 px-3 py-1 text-sm font-semibold text-blue-700">
                                                {formatNumber(holding.quantity)}
                                            </span>
                                        </td>

                                        <td className="px-4 py-4 text-right font-medium text-slate-700">
                                            {formatCurrency(holding.avgBuyPrice)}
                                        </td>

                                        <td className="px-4 py-4 text-right font-medium text-blue-600">
                                            {formatCurrency(holding.currentPrice)}
                                        </td>

                                        <td className="px-4 py-4 text-right font-semibold text-slate-900">
                                            {formatCurrency(holding.investedValue)}
                                        </td>

                                        <td className="px-4 py-4 text-right font-semibold text-blue-600">
                                            {formatCurrency(holding.currentValue)}
                                        </td>

                                        <td
                                            className={`px-4 py-4 text-right text-base font-bold ${isProfit ? 'text-emerald-600' : 'text-red-600'
                                                }`}
                                        >
                                            {isProfit ? '+' : ''}
                                            {formatCurrency(pnl)}
                                        </td>

                                        <td className="px-4 py-4 text-center">
                                            <div className="flex items-center justify-center gap-1.5">
                                                {isProfit ? (
                                                    <TrendingUp className="text-emerald-600" size={16} />
                                                ) : (
                                                    <TrendingDown className="text-red-600" size={16} />
                                                )}
                                                <span
                                                    className={`font-bold ${isProfit ? 'text-emerald-600' : 'text-red-600'
                                                        }`}
                                                >
                                                    {isProfit ? '+' : ''}
                                                    {pnlPercent.toFixed(2)}%
                                                </span>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                ) : (
                    <div className="py-14 text-center">
                        <Target className="mx-auto mb-4 text-slate-300" size={46} />
                        <p className="font-medium text-slate-600">No holdings yet</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserHoldings;