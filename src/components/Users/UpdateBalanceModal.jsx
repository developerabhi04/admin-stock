import { useState } from 'react';
import { Wallet, Plus, Minus, X, Loader } from 'lucide-react';

const UpdateBalanceModal = ({ userId, onClose, dispatch, updateUserBalance, fetchUserDetails }) => {
    const [balanceAction, setBalanceAction] = useState('add');
    const [amount, setAmount] = useState('');
    const [reason, setReason] = useState('');
    const [loading, setLoading] = useState(false);

    const handleBalanceUpdate = async () => {
        if (!amount || !reason) {
            alert('Please fill all fields');
            return;
        }

        setLoading(true);
        try {
            await dispatch(updateUserBalance({
                userId,
                amount: parseFloat(amount),
                type: balanceAction,
                reason
            })).unwrap();

            alert('✅ Balance updated successfully!');
            onClose();
            dispatch(fetchUserDetails(userId));
        } catch (error) {
            alert('Error: ' + error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md animate-scale-in">
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                        <Wallet className="text-blue-600" size={24} />
                        Update Balance
                    </h3>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition"
                    >
                        <X size={24} />
                    </button>
                </div>

                <div className="p-6 space-y-4">
                    {/* Action Type */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">Action Type</label>
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                onClick={() => setBalanceAction('add')}
                                className={`flex items-center justify-center gap-2 py-4 rounded-xl border-2 transition ${balanceAction === 'add'
                                        ? 'border-green-500 bg-green-50 text-green-700 shadow-lg'
                                        : 'border-gray-200 text-gray-600 hover:border-green-300'
                                    }`}
                            >
                                <Plus size={20} />
                                <span className="font-semibold">Add Money</span>
                            </button>
                            <button
                                onClick={() => setBalanceAction('deduct')}
                                className={`flex items-center justify-center gap-2 py-4 rounded-xl border-2 transition ${balanceAction === 'deduct'
                                        ? 'border-red-500 bg-red-50 text-red-700 shadow-lg'
                                        : 'border-gray-200 text-gray-600 hover:border-red-300'
                                    }`}
                            >
                                <Minus size={20} />
                                <span className="font-semibold">Deduct Money</span>
                            </button>
                        </div>
                    </div>

                    {/* Amount */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Amount (₹)</label>
                        <input
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition"
                            placeholder="Enter amount"
                            min="0"
                            step="0.01"
                        />
                    </div>

                    {/* Reason */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Reason</label>
                        <textarea
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition resize-none"
                            rows="3"
                            placeholder="Enter reason for adjustment..."
                        />
                    </div>
                </div>

                {/* Footer */}
                <div className="flex gap-3 p-6 bg-gray-50 rounded-b-2xl">
                    <button
                        onClick={onClose}
                        className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 rounded-xl transition font-semibold"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleBalanceUpdate}
                        disabled={loading || !amount || !reason}
                        className={`flex-1 ${balanceAction === 'add'
                                ? 'bg-green-600 hover:bg-green-700'
                                : 'bg-red-600 hover:bg-red-700'
                            } text-white py-3 rounded-xl transition disabled:opacity-50 disabled:cursor-not-allowed font-semibold flex items-center justify-center gap-2`}
                    >
                        {loading ? (
                            <>
                                <Loader className="animate-spin" size={18} />
                                Processing...
                            </>
                        ) : (
                            <>
                                {balanceAction === 'add' ? <Plus size={18} /> : <Minus size={18} />}
                                {balanceAction === 'add' ? 'Add Amount' : 'Deduct Amount'}
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UpdateBalanceModal;
