import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  fetchPendingPayments, 
  approvePayment, 
  rejectPayment 
} from '../store/slices/paymentsSlice';
import { Check, X, Clock, Phone, User } from 'lucide-react';

const PendingPayments = () => {
  const dispatch = useDispatch();
  const { payments, loading, actionLoading } = useSelector((state) => state.payments);
  
  const [rejectModal, setRejectModal] = useState(null);
  const [rejectReason, setRejectReason] = useState('');

  useEffect(() => {
    dispatch(fetchPendingPayments({ page: 1, limit: 20 }));
  }, [dispatch]);

  const handleApprove = async (transactionId) => {
    if (!window.confirm('Are you sure you want to approve this payment?')) return;

    const result = await dispatch(approvePayment({
      transactionId,
      verificationNote: 'Payment verified and approved'
    }));

    if (approvePayment.fulfilled.match(result)) {
      alert('Payment approved successfully!');
    } else {
      alert('Error: ' + result.payload);
    }
  };

  const handleReject = async () => {
    if (!rejectReason.trim()) {
      alert('Please enter rejection reason');
      return;
    }

    const result = await dispatch(rejectPayment({
      transactionId: rejectModal,
      reason: rejectReason
    }));

    if (rejectPayment.fulfilled.match(result)) {
      alert('Payment rejected!');
      setRejectModal(null);
      setRejectReason('');
    } else {
      alert('Error: ' + result.payload);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Pending Payments</h1>
        <p className="text-gray-500 mt-2">Review and approve user payment requests</p>
      </div>

      {payments.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-12 text-center">
          <Clock className="mx-auto text-gray-400 mb-4" size={48} />
          <h3 className="text-xl font-semibold text-gray-800 mb-2">No Pending Payments</h3>
          <p className="text-gray-500">All payment requests have been processed.</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {payments.map((payment) => (
            <div
              key={payment._id}
              className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <User className="text-blue-600" size={24} />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-800">
                        {payment.userId?.fullName}
                      </h3>
                      <div className="flex items-center text-gray-500 text-sm">
                        <Phone size={14} className="mr-1" />
                        {payment.userId?.phoneNumber}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Amount</p>
                      <p className="text-lg font-bold text-green-600">
                        ₹{payment.amount.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Gateway</p>
                      <p className="font-semibold text-gray-800">
                        {payment.paymentDetails?.gateway}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">UTR Number</p>
                      <p className="font-mono text-sm text-gray-800">
                        {payment.paymentDetails?.utrNumber}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Date</p>
                      <p className="text-sm text-gray-800">
                        {new Date(payment.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                    <Clock size={14} className="mr-1" />
                    Pending Review
                  </span>
                </div>

                <div className="flex space-x-2 ml-4">
                  <button
                    onClick={() => handleApprove(payment._id)}
                    disabled={actionLoading === payment._id}
                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition disabled:opacity-50"
                  >
                    <Check size={18} />
                    <span>Approve</span>
                  </button>
                  <button
                    onClick={() => setRejectModal(payment._id)}
                    disabled={actionLoading === payment._id}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition disabled:opacity-50"
                  >
                    <X size={18} />
                    <span>Reject</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Reject Modal */}
      {rejectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Reject Payment</h3>
            <p className="text-gray-600 mb-4">Please provide a reason for rejection:</p>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-3 mb-4"
              rows="4"
              placeholder="e.g., Invalid UTR number, Payment not received..."
            ></textarea>
            <div className="flex space-x-3">
              <button
                onClick={handleReject}
                disabled={actionLoading}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg transition disabled:opacity-50"
              >
                Confirm Reject
              </button>
              <button
                onClick={() => {
                  setRejectModal(null);
                  setRejectReason('');
                }}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 rounded-lg transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PendingPayments;
