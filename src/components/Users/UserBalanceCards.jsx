import { Wallet, Award, DollarSign, TrendingUp, TrendingDown, Target } from 'lucide-react';

const UserBalanceCards = ({ user, portfolio }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Wallet Balance */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition">
                <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                        <Wallet className="text-green-600" size={24} />
                    </div>
                    <TrendingUp className="text-green-500" size={20} />
                </div>
                <p className="text-sm text-gray-600 mb-1">Wallet Balance</p>
                <p className="text-3xl font-bold text-gray-900">
                    ₹{(user.walletBalance || 0).toLocaleString()}
                </p>
                <p className="text-xs text-green-600 mt-2 font-medium">● Available</p>
            </div>

            {/* Bonus Balance */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition">
                <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                        <Award className="text-purple-600" size={24} />
                    </div>
                    <TrendingUp className="text-purple-500" size={20} />
                </div>
                <p className="text-sm text-gray-600 mb-1">Bonus Balance</p>
                <p className="text-3xl font-bold text-gray-900">
                    ₹{(user.bonusBalance || 0).toLocaleString()}
                </p>
                <p className="text-xs text-purple-600 mt-2 font-medium">● Locked</p>
            </div>

            {/* Portfolio Value */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition">
                <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Target className="text-blue-600" size={24} />
                    </div>
                    <TrendingUp className="text-blue-500" size={20} />
                </div>
                <p className="text-sm text-gray-600 mb-1">Portfolio Value</p>
                <p className="text-3xl font-bold text-gray-900">
                    ₹{(portfolio.currentValue || 0).toLocaleString()}
                </p>
                <p className="text-xs text-blue-600 mt-2 font-medium">● Current</p>
            </div>

            {/* Total P&L */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition">
                <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${portfolio.totalPnL >= 0 ? 'bg-green-100' : 'bg-red-100'
                        }`}>
                        <DollarSign className={portfolio.totalPnL >= 0 ? 'text-green-600' : 'text-red-600'} size={24} />
                    </div>
                    {portfolio.totalPnL >= 0 ? (
                        <TrendingUp className="text-green-500" size={20} />
                    ) : (
                        <TrendingDown className="text-red-500" size={20} />
                    )}
                </div>
                <p className="text-sm text-gray-600 mb-1">Total P&L</p>
                <p className={`text-3xl font-bold ${portfolio.totalPnL >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {portfolio.totalPnL >= 0 ? '+' : ''}₹{(portfolio.totalPnL || 0).toLocaleString()}
                </p>
                <p className={`text-xs mt-2 font-medium ${portfolio.totalPnL >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    ● {portfolio.totalPnL >= 0 ? '+' : ''}{portfolio.totalPnLPercent?.toFixed(2)}%
                </p>
            </div>
        </div>
    );
};

export default UserBalanceCards;
