import {
  Wallet,
  Award,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Target,
} from 'lucide-react';

const formatCurrency = (value) => `₹${Number(value || 0).toLocaleString('en-IN')}`;

const UserBalanceCards = ({ user = {}, portfolio = {} }) => {
  const totalPnL = Number(portfolio.totalPnL || 0);
  const totalPnLPercent = Number(portfolio.totalPnLPercent || 0);
  const isProfit = totalPnL >= 0;

  const cards = [
    {
      title: 'Wallet Balance',
      value: formatCurrency(user.walletBalance),
      note: 'Available balance',
      icon: Wallet,
      iconWrap: 'bg-emerald-50 text-emerald-600',
      noteClass: 'text-emerald-600',
      trendIcon: TrendingUp,
      trendClass: 'text-emerald-500',
    },
    
    {
      title: 'Bonus Balance',
      value: formatCurrency(user.bonusBalance),
      note: 'Bonus wallet',
      icon: Award,
      iconWrap: 'bg-violet-50 text-violet-600',
      noteClass: 'text-violet-600',
      trendIcon: TrendingUp,
      trendClass: 'text-violet-500',
    },
    {
      title: 'Portfolio Value',
      value: formatCurrency(portfolio.currentValue),
      note: 'Current market value',
      icon: Target,
      iconWrap: 'bg-blue-50 text-blue-600',
      noteClass: 'text-blue-600',
      trendIcon: TrendingUp,
      trendClass: 'text-blue-500',
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon;
        const TrendIcon = card.trendIcon;

        return (
          <div
            key={card.title}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <div className="mb-4 flex items-start justify-between">
              <div className={`rounded-2xl p-3 ${card.iconWrap}`}>
                <Icon size={22} />
              </div>
              <TrendIcon className={card.trendClass} size={18} />
            </div>

            <p className="text-sm text-slate-500">{card.title}</p>
            <p className="mt-2 text-2xl font-bold text-slate-900">{card.value}</p>
            <p className={`mt-2 text-xs font-medium ${card.noteClass}`}>{card.note}</p>
          </div>
        );
      })}

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
        <div className="mb-4 flex items-start justify-between">
          <div
            className={`rounded-2xl p-3 ${
              isProfit ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'
            }`}
          >
            <DollarSign size={22} />
          </div>
          {isProfit ? (
            <TrendingUp className="text-emerald-500" size={18} />
          ) : (
            <TrendingDown className="text-red-500" size={18} />
          )}
        </div>

        <p className="text-sm text-slate-500">Total P&amp;L</p>
        <p className={`mt-2 text-2xl font-bold ${isProfit ? 'text-emerald-600' : 'text-red-600'}`}>
          {isProfit ? '+' : ''}
          {formatCurrency(totalPnL)}
        </p>
        <p className={`mt-2 text-xs font-medium ${isProfit ? 'text-emerald-600' : 'text-red-600'}`}>
          {isProfit ? '+' : ''}
          {totalPnLPercent.toFixed(2)}%
        </p>
      </div>
    </div>
  );
};

export default UserBalanceCards;