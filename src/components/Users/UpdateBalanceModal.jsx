import { useState } from 'react';
import { Wallet, Plus, Minus, X, Loader } from 'lucide-react';

const UpdateBalanceModal = ({
    userId,
    onClose,
    dispatch,
    updateUserBalance,
    fetchUserDetails,
}) => {
    const [balanceAction, setBalanceAction] = useState('add');
    const [amount, setAmount] = useState('');
    const [reason, setReason] = useState('');
    const [loading, setLoading] = useState(false);

    const handleBalanceUpdate = async () => {
        if (!amount || !reason.trim()) {
            alert('Please fill all fields');
            return;
        }

        setLoading(true);
        try {
            await dispatch(
                updateUserBalance({
                    userId,
                    amount: Number(amount),
                    type: balanceAction,
                    reason: reason.trim(),
                })
            ).unwrap();

            onClose();
            dispatch(fetchUserDetails(userId));
        } catch (error) {
            alert(typeof error === 'string' ? error : error?.message || 'Failed to update balance');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
            <div className="w-full max-w-md rounded-3xl bg-white shadow-2xl">
                <div className="flex items-center justify-between border-b border-slate-200 p-6">
                    <h3 className="flex items-center gap-2 text-xl font-bold text-slate-900">
                        <Wallet className="text-blue-600" size={22} />
                        Update Balance
                    </h3>
                    <button onClick={onClose} className="text-slate-400 transition hover:text-slate-600">
                        <X size={22} />
                    </button>
                </div>

                <div className="space-y-5 p-6">
                    <div>
                        <label className="mb-3 block text-sm font-medium text-slate-700">Action Type</label>
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                onClick={() => setBalanceAction('add')}
                                className={`flex min-h-[52px] items-center justify-center gap-2 rounded-2xl border-2 px-4 py-3 transition ${balanceAction === 'add'
                                        ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                                        : 'border-slate-200 text-slate-600 hover:border-emerald-300'
                                    }`}
                            >
                                <Plus size={18} />
                                <span className="font-semibold">Add Money</span>
                            </button>

                            <button
                                onClick={() => setBalanceAction('deduct')}
                                className={`flex min-h-[52px] items-center justify-center gap-2 rounded-2xl border-2 px-4 py-3 transition ${balanceAction === 'deduct'
                                        ? 'border-red-500 bg-red-50 text-red-700'
                                        : 'border-slate-200 text-slate-600 hover:border-red-300'
                                    }`}
                            >
                                <Minus size={18} />
                                <span className="font-semibold">Deduct Money</span>
                            </button>
                        </div>
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-medium text-slate-700">Amount (₹)</label>
                        <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder="Enter amount"
                            className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                        />
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-medium text-slate-700">Reason</label>
                        <textarea
                            rows="3"
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            placeholder="Enter reason for adjustment"
                            className="w-full resize-none rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                        />
                    </div>
                </div>

                <div className="flex gap-3 rounded-b-3xl bg-slate-50 p-6">
                    <button
                        onClick={onClose}
                        className="flex-1 rounded-2xl bg-slate-200 py-3 font-semibold text-slate-800 transition hover:bg-slate-300"
                    >
                        Cancel
                    </button>

                    <button
                        onClick={handleBalanceUpdate}
                        disabled={loading || !amount || !reason.trim()}
                        className={`flex flex-1 items-center justify-center gap-2 rounded-2xl py-3 font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-50 ${balanceAction === 'add'
                                ? 'bg-emerald-600 hover:bg-emerald-700'
                                : 'bg-red-600 hover:bg-red-700'
                            }`}
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