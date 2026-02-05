import { useState } from 'react';
import { ShoppingCart, TrendingUp, TrendingDown, Clock, CheckCircle, XCircle } from 'lucide-react';

const UserOrders = ({ orders }) => {
    const [activeTab, setActiveTab] = useState('pending');

    const tabs = [
        { id: 'pending', label: 'Pending', count: orders.pending?.length || 0, icon: Clock },
        { id: 'completed', label: 'Completed', count: orders.completed?.length || 0, icon: CheckCircle },
        { id: 'cancelled', label: 'Cancelled', count: orders.cancelled?.length || 0, icon: XCircle },
    ];

    const renderOrders = (orderList) => {
        if (!orderList || orderList.length === 0) {
            return (
                <div className="text-center py-12">
                    <ShoppingCart className="mx-auto text-gray-400 mb-4" size={48} />
                    <p className="text-gray-600">No orders found</p>
                </div>
            );
        }

        return (
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="border-b-2 border-gray-200 bg-gray-50">
                            <th className="text-left py-3 px-4 text-xs font-bold text-gray-600 uppercase">Order ID</th>
                            <th className="text-left py-3 px-4 text-xs font-bold text-gray-600 uppercase">Type</th>
                            <th className="text-left py-3 px-4 text-xs font-bold text-gray-600 uppercase">Index</th>
                            <th className="text-center py-3 px-4 text-xs font-bold text-gray-600 uppercase">Qty</th>
                            <th className="text-right py-3 px-4 text-xs font-bold text-gray-600 uppercase">Price</th>
                            <th className="text-right py-3 px-4 text-xs font-bold text-gray-600 uppercase">Total</th>
                            <th className="text-left py-3 px-4 text-xs font-bold text-gray-600 uppercase">Date</th>
                            <th className="text-center py-3 px-4 text-xs font-bold text-gray-600 uppercase">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orderList.map((order, index) => (
                            <tr key={index} className="border-b border-gray-100 hover:bg-gray-50 transition">
                                <td className="py-4 px-4">
                                    <p className="font-mono text-sm text-gray-700">{order.orderId}</p>
                                </td>
                                <td className="py-4 px-4">
                                    <div className="flex items-center gap-2">
                                        {order.type === 'buy' ? (
                                            <>
                                                <TrendingUp className="text-green-500" size={18} />
                                                <span className="font-semibold text-green-600 uppercase">{order.type}</span>
                                            </>
                                        ) : (
                                            <>
                                                <TrendingDown className="text-red-500" size={18} />
                                                <span className="font-semibold text-red-600 uppercase">{order.type}</span>
                                            </>
                                        )}
                                    </div>
                                </td>
                                <td className="py-4 px-4">
                                    <p className="font-semibold text-gray-900">{order.indexName}</p>
                                </td>
                                <td className="py-4 px-4 text-center">
                                    <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-semibold">
                                        {order.quantity}
                                    </span>
                                </td>
                                <td className="py-4 px-4 text-right">
                                    <p className="font-semibold text-gray-900">₹{order.price.toLocaleString()}</p>
                                </td>
                                <td className="py-4 px-4 text-right">
                                    <p className="font-bold text-lg text-gray-900">₹{order.totalAmount.toLocaleString()}</p>
                                </td>
                                <td className="py-4 px-4">
                                    <p className="text-sm text-gray-600">
                                        {new Date(order.orderDate).toLocaleString('en-IN', {
                                            dateStyle: 'short',
                                            timeStyle: 'short'
                                        })}
                                    </p>
                                </td>
                                <td className="py-4 px-4 text-center">
                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${order.status === 'completed'
                                            ? 'bg-green-100 text-green-700'
                                            : order.status === 'pending'
                                                ? 'bg-yellow-100 text-yellow-700'
                                                : 'bg-red-100 text-red-700'
                                        }`}>
                                        {order.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    };

    return (
        <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-6 mb-8">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-2xl font-bold text-gray-900">Orders History</h3>
                    <p className="text-sm text-gray-500 mt-1">All buy and sell orders</p>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-gray-200 mb-6">
                {tabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-6 py-3 border-b-2 transition ${activeTab === tab.id
                                    ? 'border-blue-600 text-blue-600'
                                    : 'border-transparent text-gray-600 hover:text-gray-900'
                                }`}
                        >
                            <Icon size={18} />
                            <span className="font-semibold">{tab.label}</span>
                            {tab.count > 0 && (
                                <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${activeTab === tab.id
                                        ? 'bg-blue-100 text-blue-700'
                                        : 'bg-gray-100 text-gray-700'
                                    }`}>
                                    {tab.count}
                                </span>
                            )}
                        </button>
                    );
                })}
            </div>

            {/* Tab Content */}
            {activeTab === 'pending' && renderOrders(orders.pending)}
            {activeTab === 'completed' && renderOrders(orders.completed)}
            {activeTab === 'cancelled' && renderOrders(orders.cancelled)}
        </div>
    );
};

export default UserOrders;
