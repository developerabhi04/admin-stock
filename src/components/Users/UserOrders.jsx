import { useMemo, useState } from 'react';
import {
  ShoppingCart,
  TrendingUp,
  TrendingDown,
  Clock,
  CheckCircle,
  XCircle,
} from 'lucide-react';

const formatCurrency = (value) => `₹${Number(value || 0).toLocaleString('en-IN')}`;

const UserOrders = ({ orders = {} }) => {
  const [activeTab, setActiveTab] = useState('pending');

  const normalizedOrders = useMemo(
    () => ({
      pending: Array.isArray(orders.pending) ? orders.pending : [],
      completed: Array.isArray(orders.completed) ? orders.completed : [],
      cancelled: Array.isArray(orders.cancelled) ? orders.cancelled : [],
    }),
    [orders]
  );

  const tabs = [
    { id: 'pending', label: 'Pending', count: normalizedOrders.pending.length, icon: Clock },
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
              <th className="px-4 py-3">Index</th>
              <th className="px-4 py-3 text-center">Qty</th>
              <th className="px-4 py-3 text-right">Price</th>
              <th className="px-4 py-3 text-right">Total</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3 text-center">Status</th>
            </tr>
          </thead>

          <tbody>
            {orderList.map((order, index) => {
              const isBuy = order.type === 'buy';

              return (
                <tr
                  key={order._id || order.orderId || index}
                  className="border-b border-slate-100 transition hover:bg-slate-50"
                >
                  <td className="px-4 py-4">
                    <p className="font-mono text-sm text-slate-700">
                      {order.orderId || order._id || '-'}
                    </p>
                  </td>

                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      {isBuy ? (
                        <>
                          <TrendingUp className="text-emerald-500" size={18} />
                          <span className="font-semibold uppercase text-emerald-600">
                            {order.type || '-'}
                          </span>
                        </>
                      ) : (
                        <>
                          <TrendingDown className="text-red-500" size={18} />
                          <span className="font-semibold uppercase text-red-600">
                            {order.type || '-'}
                          </span>
                        </>
                      )}
                    </div>
                  </td>

                  <td className="px-4 py-4">
                    <p className="font-semibold text-slate-900">
                      {order.indexName || order.index?.name || '-'}
                    </p>
                  </td>

                  <td className="px-4 py-4 text-center">
                    <span className="inline-flex rounded-full bg-blue-100 px-3 py-1 text-sm font-semibold text-blue-700">
                      {Number(order.quantity || 0).toLocaleString('en-IN')}
                    </span>
                  </td>

                  <td className="px-4 py-4 text-right font-semibold text-slate-900">
                    {formatCurrency(order.price)}
                  </td>

                  <td className="px-4 py-4 text-right text-lg font-bold text-slate-900">
                    {formatCurrency(order.totalAmount)}
                  </td>

                  <td className="px-4 py-4">
                    <p className="text-sm text-slate-600">
                      {order.orderDate
                        ? new Date(order.orderDate).toLocaleString('en-IN', {
                            dateStyle: 'short',
                            timeStyle: 'short',
                          })
                        : '-'}
                    </p>
                  </td>

                  <td className="px-4 py-4 text-center">
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold capitalize ${
                        order.status === 'completed'
                          ? 'bg-emerald-100 text-emerald-700'
                          : order.status === 'pending'
                          ? 'bg-amber-100 text-amber-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {order.status || '-'}
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
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-slate-900">Orders History</h3>
        <p className="mt-1 text-sm text-slate-500">All buy and sell orders</p>
      </div>

      <div className="mb-6 flex flex-wrap gap-2 border-b border-slate-200 pb-3">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`inline-flex min-h-[44px] items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition ${
                isActive
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <Icon size={16} />
              <span>{tab.label}</span>
              <span
                className={`rounded-full px-2 py-0.5 text-xs ${
                  isActive ? 'bg-white/20 text-white' : 'bg-white text-slate-700'
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