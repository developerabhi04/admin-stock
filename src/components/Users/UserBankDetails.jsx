import { Building, CreditCard, Hash, User, Smartphone } from 'lucide-react';

const UserBankDetails = ({ user }) => {
    // Sample bank details - Replace with real data from user.bankDetails
    const bankDetails = user.bankDetails || {
        bankName: 'State Bank of India',
        accountNumber: '12345678901234',
        accountHolderName: user.fullName,
        ifscCode: 'SBIN0001234',
        upiId: `${user.phoneNumber}@paytm`,
        branch: 'Mumbai Main Branch'
    };

    return (
        <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                        <Building className="text-blue-600" size={22} />
                        Bank Account Details
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">For withdrawals</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${user.bankDetails ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                    }`}>
                    {user.bankDetails ? '✓ Added' : 'Not Added'}
                </span>
            </div>

            {user.bankDetails || true ? (
                <div className="space-y-4">
                    {/* Bank Name */}
                    <div className="flex items-start gap-4 p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl border border-blue-200">
                        <div className="bg-blue-500 p-2.5 rounded-lg">
                            <Building className="text-white" size={20} />
                        </div>
                        <div className="flex-1">
                            <p className="text-xs text-blue-600 font-medium mb-1">Bank Name</p>
                            <p className="font-bold text-gray-900 text-lg">{bankDetails.bankName}</p>
                            {bankDetails.branch && (
                                <p className="text-xs text-gray-600 mt-1">{bankDetails.branch}</p>
                            )}
                        </div>
                    </div>

                    {/* Account Number */}
                    <div className="flex items-start gap-4 p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-xl border border-green-200">
                        <div className="bg-green-500 p-2.5 rounded-lg">
                            <Hash className="text-white" size={20} />
                        </div>
                        <div className="flex-1">
                            <p className="text-xs text-green-600 font-medium mb-1">Account Number</p>
                            <p className="font-mono font-bold text-gray-900 text-lg">{bankDetails.accountNumber}</p>
                        </div>
                    </div>

                    {/* Account Holder Name */}
                    <div className="flex items-start gap-4 p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl border border-purple-200">
                        <div className="bg-purple-500 p-2.5 rounded-lg">
                            <User className="text-white" size={20} />
                        </div>
                        <div className="flex-1">
                            <p className="text-xs text-purple-600 font-medium mb-1">Account Holder</p>
                            <p className="font-bold text-gray-900 text-lg">{bankDetails.accountHolderName}</p>
                        </div>
                    </div>

                    {/* IFSC Code */}
                    <div className="flex items-start gap-4 p-4 bg-gradient-to-r from-orange-50 to-orange-100 rounded-xl border border-orange-200">
                        <div className="bg-orange-500 p-2.5 rounded-lg">
                            <CreditCard className="text-white" size={20} />
                        </div>
                        <div className="flex-1">
                            <p className="text-xs text-orange-600 font-medium mb-1">IFSC Code</p>
                            <p className="font-mono font-bold text-gray-900 text-lg">{bankDetails.ifscCode}</p>
                        </div>
                    </div>

                    {/* UPI ID */}
                    {bankDetails.upiId && (
                        <div className="flex items-start gap-4 p-4 bg-gradient-to-r from-pink-50 to-pink-100 rounded-xl border border-pink-200">
                            <div className="bg-pink-500 p-2.5 rounded-lg">
                                <Smartphone className="text-white" size={20} />
                            </div>
                            <div className="flex-1">
                                <p className="text-xs text-pink-600 font-medium mb-1">UPI ID</p>
                                <p className="font-mono font-bold text-gray-900">{bankDetails.upiId}</p>
                            </div>
                        </div>
                    )}
                </div>
            ) : (
                <div className="text-center py-12">
                    <Building className="mx-auto text-gray-400 mb-4" size={48} />
                    <p className="text-gray-600 mb-2">No bank details added</p>
                    <p className="text-sm text-gray-500">User needs to add bank account</p>
                </div>
            )}
        </div>
    );
};

export default UserBankDetails;
