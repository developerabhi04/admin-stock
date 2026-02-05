import { TrendingUp, TrendingDown, Target, Percent } from 'lucide-react';

const UserHoldings = ({ holdings, portfolio }) => {
    return (
        <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-6 mb-8">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-2xl font-bold text-gray-900">Holdings</h3>
                    <p className="text-sm text-gray-500 mt-1">Active index investments</p>
                </div>
                <div className="flex gap-4">
                    <div className="text-right">
                        <p className="text-sm text-gray-500">Total Invested</p>
                        <p className="text-xl font-bold text-gray-900">₹{portfolio.totalInvested.toLocaleString()}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-sm text-gray-500">Current Value</p>
                        <p className="text-xl font-bold text-blue-600">₹{portfolio.currentValue.toLocaleString()}</p>
                    </div>
                </div>
            </div>

            <div className="overflow-x-auto">
                {holdings?.length > 0 ? (
                    <table className="w-full">
                        <thead>
                            <tr className="border-b-2 border-gray-200 bg-gray-50">
                                <th className="text-left py-3 px-4 text-xs font-bold text-gray-600 uppercase">Index</th>
                                <th className="text-center py-3 px-4 text-xs font-bold text-gray-600 uppercase">Qty</th>
                                <th className="text-right py-3 px-4 text-xs font-bold text-gray-600 uppercase">Avg Price</th>
                                <th className="text-right py-3 px-4 text-xs font-bold text-gray-600 uppercase">Current Price</th>
                                <th className="text-right py-3 px-4 text-xs font-bold text-gray-600 uppercase">Invested</th>
                                <th className="text-right py-3 px-4 text-xs font-bold text-gray-600 uppercase">Current Value</th>
                                <th className="text-right py-3 px-4 text-xs font-bold text-gray-600 uppercase">P&L</th>
                                <th className="text-center py-3 px-4 text-xs font-bold text-gray-600 uppercase">Return %</th>
                            </tr>
                        </thead>
                        <tbody>
                            {holdings.map((holding, index) => (
                                <tr key={index} className="border-b border-gray-100 hover:bg-blue-50 transition">
                                    <td className="py-4 px-4">
                                        <div>
                                            <p className="font-bold text-gray-900">{holding.indexName}</p>
                                            <p className="text-xs text-gray-500">
                                                {new Date(holding.purchaseDate).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </td>
                                    <td className="py-4 px-4 text-center">
                                        <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-semibold">
                                            {holding.quantity}
                                        </span>
                                    </td>
                                    <td className="py-4 px-4 text-right">
                                        <p className="font-semibold text-gray-700">₹{holding.avgBuyPrice.toLocaleString()}</p>
                                    </td>
                                    <td className="py-4 px-4 text-right">
                                        <p className="font-semibold text-blue-600">₹{holding.currentPrice.toLocaleString()}</p>
                                    </td>
                                    <td className="py-4 px-4 text-right">
                                        <p className="font-bold text-gray-900">₹{holding.investedValue.toLocaleString()}</p>
                                    </td>
                                    <td className="py-4 px-4 text-right">
                                        <p className="font-bold text-blue-600">₹{holding.currentValue.toLocaleString()}</p>
                                    </td>
                                    <td className="py-4 px-4 text-right">
                                        <p className={`font-bold text-lg ${holding.pnl >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                            {holding.pnl >= 0 ? '+' : ''}₹{holding.pnl.toLocaleString()}
                                        </p>
                                    </td>
                                    <td className="py-4 px-4 text-center">
                                        <div className="flex items-center justify-center gap-1">
                                            {holding.pnlPercent >= 0 ? (
                                                <TrendingUp className="text-green-600" size={16} />
                                            ) : (
                                                <TrendingDown className="text-red-600" size={16} />
                                            )}
                                            <span className={`font-bold ${holding.pnlPercent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                                {holding.pnlPercent >= 0 ? '+' : ''}{holding.pnlPercent.toFixed(2)}%
                                            </span>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <div className="text-center py-12">
                        <Target className="mx-auto text-gray-400 mb-4" size={48} />
                        <p className="text-gray-600">No holdings yet</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserHoldings;
