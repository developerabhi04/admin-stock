import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  fetchPendingWithdrawals, 
  approveWithdrawal, 
  rejectWithdrawal 
} from '../store/slices/withdrawalsSlice';
import { Check, X, Clock, Phone, User, Building } from 'lucide-react';



const PendingWithdrawals = () => {
  const dispatch = useDispatch();
  const { withdrawals, loading, actionLoading } = useSelector((state) => state.withdrawals);
  
  const [approveModal, setApproveModal] = useState(null);
  const [rejectModal, setRejectModal] = useState(null);
  const [utrNumber, setUtrNumber] = useState('');
  const [rejectReason, setRejectReason] = useState('');

  useEffect(() => {
    dispatch(fetchPendingWithdrawals({ page: 1, limit: 20 }));
  }, [dispatch]);

  const handleApprove = async () => {
    if (!utrNumber.trim()) {
      alert('Please enter UTR number');
      return;
    }

    const result = await dispatch(approveWithdrawal({
      transactionId: approveModal,
      utrNumber,
      verificationNote: 'Withdrawal approved and processed'
    }));

    if (approveWithdrawal.fulfilled.match(result)) {
      alert('Withdrawal approved successfully!');
      setApproveModal(null);
      setUtrNumber('');
    } else {
      alert('Error: ' + result.payload);
    }
  };

  const handleReject = async () => {
    if (!rejectReason.trim()) {
      alert('Please enter rejection reason');
      return;
    }

    const result = await dispatch(rejectWithdrawal({
      transactionId: rejectModal,
      reason: rejectReason
    }));

    if (rejectWithdrawal.fulfilled.match(result)) {
      alert('Withdrawal rejected and amount refunded!');
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
        <h1 className="text-3xl font-bold text-gray-800">Pending Withdrawals</h1>
        <p className="text-gray-500 mt-2">Review and process user withdrawal requests</p>
      </div>

      {withdrawals.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-12 text-center">
          <Clock className="mx-auto text-gray-400 mb-4" size={48} />
          <h3 className="text-xl font-semibold text-gray-800 mb-2">No Pending Withdrawals</h3>
          <p className="text-gray-500">All withdrawal requests have been processed.</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {withdrawals.map((withdrawal) => (
            <div
              key={withdrawal._id}
              className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  {/* User Info */}
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <User className="text-blue-600" size={24} />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-800">
                        {withdrawal.userId?.fullName}
                      </h3>
                      <div className="flex items-center text-gray-500 text-sm">
                        <Phone size={14} className="mr-1" />
                        {withdrawal.userId?.phoneNumber}
                      </div>
                    </div>
                  </div>

                  {/* Withdrawal Details */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Amount</p>
                      <p className="text-lg font-bold text-red-600">
                        ₹{withdrawal.amount.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Account Number</p>
                      <p className="font-mono text-sm text-gray-800">
                        {withdrawal.withdrawalDetails?.accountNumber}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">IFSC Code</p>
                      <p className="font-mono text-sm text-gray-800">
                        {withdrawal.withdrawalDetails?.ifscCode}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Request Date</p>
                      <p className="text-sm text-gray-800">
                        {new Date(withdrawal.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  {/* Bank Details */}
                  <div className="bg-gray-50 rounded-lg p-4 mb-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <Building size={16} className="text-gray-600" />
                      <p className="font-semibold text-gray-800">Bank Details</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500">Account Holder</p>
                        <p className="font-medium text-gray-800">
                          {withdrawal.withdrawalDetails?.accountHolderName}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500">Bank Name</p>
                        <p className="font-medium text-gray-800">
                          {withdrawal.withdrawalDetails?.bankName}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                    <Clock size={14} className="mr-1" />
                    Pending Review
                  </span>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-2 ml-4">
                  <button
                    onClick={() => setApproveModal(withdrawal._id)}
                    disabled={actionLoading === withdrawal._id}
                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition disabled:opacity-50"
                  >
                    <Check size={18} />
                    <span>Approve</span>
                  </button>
                  <button
                    onClick={() => setRejectModal(withdrawal._id)}
                    disabled={actionLoading === withdrawal._id}
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

      {/* Approve Modal */}
      {approveModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Approve Withdrawal</h3>
            <p className="text-gray-600 mb-4">Enter UTR/Transaction ID after processing the withdrawal:</p>
            <input
              type="text"
              value={utrNumber}
              onChange={(e) => setUtrNumber(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 mb-4"
              placeholder="e.g., 403456789012"
            />
            <div className="flex space-x-3">
              <button
                onClick={handleApprove}
                disabled={actionLoading}
                className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg transition disabled:opacity-50"
              >
                Confirm Approval
              </button>
              <button
                onClick={() => {
                  setApproveModal(null);
                  setUtrNumber('');
                }}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 rounded-lg transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {rejectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Reject Withdrawal</h3>
            <p className="text-gray-600 mb-4">Please provide a reason for rejection:</p>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-3 mb-4"
              rows="4"
              placeholder="e.g., Invalid bank details, Suspicious activity..."
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

export default PendingWithdrawals;
