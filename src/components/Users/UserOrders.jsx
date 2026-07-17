import { useMemo, useState } from 'react';
import {
  ShoppingCart,
  TrendingUp,
  TrendingDown,
  Clock,
  CheckCircle,
  XCircle,
  Layers3,
  IndianRupee,
  CalendarDays,
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

const getStatusBadgeClass = (status) => {
  const normalized = String(status || '').toLowerCase();

  if (
    ['completed', 'active', 'approved', 'success', 'unlocked', 'closed_reinvested'].includes(
      normalized
    )
  ) {
    return 'bg-emerald-100 text-emerald-700';
  }

  if (['pending', 'processing', 'initiated'].includes(normalized)) {
    return 'bg-amber-100 text-amber-700';
  }

  return 'bg-red-100 text-red-700';
};

const getOrderTypeMeta = (order) => {
  const rawType = String(order?.type || order?.action || order?.side || '').toLowerCase();
  const rawStatus = String(order?.status || '').toLowerCase();

  if (rawType === 'sell') {
    return {
      icon: TrendingDown,
      text: 'SELL',
      className: 'text-red-600',
      iconClass: 'text-red-500',
    };
  }

  if (rawType === 'buy') {
    return {
      icon: TrendingUp,
      text: 'BUY',
      className: 'text-emerald-600',
      iconClass: 'text-emerald-500',
    };
  }

  if (['cancelled', 'rejected', 'failed'].includes(rawStatus)) {
    return {
      icon: TrendingDown,
      text: rawType ? rawType.toUpperCase() : 'CANCELLED',
      className: 'text-red-600',
      iconClass: 'text-red-500',
    };
  }

  return {
    icon: TrendingUp,
    text: rawType ? rawType.toUpperCase() : 'INVEST',
    className: 'text-emerald-600',
    iconClass: 'text-emerald-500',
  };
};

const normalizeSingleOrder = (order = {}, index = 0) => {
  const amount =
    order.totalAmount ??
    order.amount ??
    order.investedAmount ??
    order.investmentAmount ??
    order.principal ??
    0;

  const quantity =
    order.quantity ??
    order.units ??
    order.lots ??
    1;

  const price =
    order.price ??
    order.unitPrice ??
    (quantity ? Number(amount || 0) / Number(quantity || 1) : 0);

  const indexName =
    order.indexName ||
    order.index?.name ||
    order.indexId?.name ||
    order.planName ||
    order.productName ||
    order.title ||
    '-';

  const orderId =
    order.orderId ||
    order.transactionId ||
    order.referenceId ||
    order._id ||
    `order-${index}`;

  const orderDate =
    order.orderDate ||
    order.createdAt ||
    order.investedAt ||
    order.purchaseDate ||
    null;

  return {
    ...order,
    _normalizedId: orderId,
    _normalizedIndexName: indexName,
    _normalizedQuantity: Number(quantity || 0),
    _normalizedPrice: Number(price || 0),
    _normalizedTotal: Number(amount || 0),
    _normalizedDate: orderDate,
  };
};

const UserOrders = ({ orders = {} }) => {
  const [activeTab, setActiveTab] = useState('pending');

  const normalizedOrders = useMemo(() => {
    const pending = Array.isArray(orders.pending)
      ? orders.pending.map(normalizeSingleOrder)
      : [];

    const completed = Array.isArray(orders.completed)
      ? orders.completed.map(normalizeSingleOrder)
      : [];

    const cancelled = Array.isArray(orders.cancelled)
      ? orders.cancelled.map(normalizeSingleOrder)
      : [];

    return { pending, completed, cancelled };
  }, [orders]);

  const tabs = [
    {
      id: 'pending',
      label: 'Pending',
      count: normalizedOrders.pending.length,
      icon: Clock,
    },
    {
      id: 'completed',
      label: 'Completed',
      count: normalizedOrders.completed.length,
      icon: CheckCircle,
    },
    {
      id: 'cancelled',
      label: 'Cancelled',
      count: normalizedOrders.cancelled.length,
      icon: XCircle,
    },
  ];

  const renderOrders = (orderList) => {
    if (!orderList.length) {
      return (
        <div className="py-14 text-center">
          <ShoppingCart className="mx-auto mb-4 text-slate-300" size={46} />
          <p className="font-medium text-slate-600">No orders found</p>
          <p className="mt-1 text-sm text-slate-400">
            Orders for this tab will appear here.
          </p>
        </div>
      );
    }

    return (
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50 text-left text-xs font-bold uppercase tracking-wide text-slate-600">
              <th className="px-4 py-3">Order ID</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Index / Plan</th>
              <th className="px-4 py-3 text-center">Qty</th>
              <th className="px-4 py-3 text-right">Price</th>
              <th className="px-4 py-3 text-right">Total</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3 text-center">Status</th>
            </tr>
          </thead>

          <tbody>
            {orderList.map((order, index) => {
              const typeMeta = getOrderTypeMeta(order);
              const TypeIcon = typeMeta.icon;

              return (
                <tr
                  key={order._normalizedId || index}
                  className="border-b border-slate-100 transition hover:bg-slate-50"
                >
                  <td className="px-4 py-4">
                    <div className="flex flex-col">
                      <p className="font-mono text-sm text-slate-700">
                        {order._normalizedId}
                      </p>
                      {order.referenceNo ? (
                        <span className="text-xs text-slate-400">
                          Ref: {order.referenceNo}
                        </span>
                      ) : null}
                    </div>
                  </td>

                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      <TypeIcon className={typeMeta.iconClass} size={18} />
                      <span className={`font-semibold uppercase ${typeMeta.className}`}>
                        {typeMeta.text}
                      </span>
                    </div>
                  </td>

                  <td className="px-4 py-4">
                    <div className="min-w-[160px]">
                      <p className="font-semibold text-slate-900">
                        {order._normalizedIndexName}
                      </p>
                      {order.symbol || order.index?.symbol || order.indexId?.symbol ? (
                        <p className="text-xs uppercase tracking-wide text-slate-500">
                          {order.symbol || order.index?.symbol || order.indexId?.symbol}
                        </p>
                      ) : null}
                    </div>
                  </td>

                  <td className="px-4 py-4 text-center">
                    <span className="inline-flex rounded-full bg-blue-100 px-3 py-1 text-sm font-semibold text-blue-700">
                      {Number(order._normalizedQuantity || 0).toLocaleString('en-IN')}
                    </span>
                  </td>

                  <td className="px-4 py-4 text-right font-semibold text-slate-900">
                    <span className="inline-flex items-center justify-end gap-1">
                      <IndianRupee size={14} className="text-slate-400" />
                      {Number(order._normalizedPrice || 0).toLocaleString('en-IN')}
                    </span>
                  </td>

                  <td className="px-4 py-4 text-right text-lg font-bold text-slate-900">
                    {formatCurrency(order._normalizedTotal)}
                  </td>

                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <CalendarDays size={15} className="text-slate-400" />
                      <span>{formatDateTime(order._normalizedDate)}</span>
                    </div>
                  </td>

                  <td className="px-4 py-4 text-center">
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold capitalize ${getStatusBadgeClass(
                        order.status
                      )}`}
                    >
                      {String(order.status || '-').replace(/_/g, ' ')}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="flex items-center gap-2 text-2xl font-bold text-slate-900">
            <Layers3 className="text-blue-600" size={24} />
            Orders History
          </h3>
          <p className="mt-1 text-sm text-slate-500">
            All buy, sell, and investment orders
          </p>
        </div>
      </div>

      <div className="mb-6 flex flex-wrap gap-2 border-b border-slate-200 pb-3">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`inline-flex min-h-[44px] items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition ${isActive
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
            >
              <Icon size={16} />
              <span>{tab.label}</span>
              <span
                className={`rounded-full px-2 py-0.5 text-xs ${isActive ? 'bg-white/20 text-white' : 'bg-white text-slate-700'
                  }`}
              >
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {activeTab === 'pending' && renderOrders(normalizedOrders.pending)}
      {activeTab === 'completed' && renderOrders(normalizedOrders.completed)}
      {activeTab === 'cancelled' && renderOrders(normalizedOrders.cancelled)}
    </div>
  );
};

export default UserOrders;