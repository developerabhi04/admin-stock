import { Shield, FileText, CheckCircle, Clock, XCircle, User, CreditCard } from 'lucide-react';

const UserKYC = ({ user }) => {
    // Sample KYC data - Replace with real data from user.kycDetails
    const kycDetails = user.kycDetails || {
        status: user.kycStatus || 'pending',
        fullName: user.fullName,
        email: user.email || 'Not provided',
        aadharNumber: '1234 5678 9012',
        panNumber: 'ABCDE1234F',
        address: '123, MG Road, Mumbai, Maharashtra - 400001',
        submittedAt: '2024-01-15',
        verifiedAt: user.kycStatus === 'verified' ? '2024-01-16' : null
    };

    const getStatusConfig = (status) => {
        switch (status) {
            case 'verified':
                return {
                    icon: CheckCircle,
                    color: 'green',
                    bg: 'bg-green-50',
                    border: 'border-green-200',
                    text: 'text-green-700',
                    iconBg: 'bg-green-500',
                    label: 'Verified'
                };
            case 'pending':
                return {
                    icon: Clock,
                    color: 'yellow',
                    bg: 'bg-yellow-50',
                    border: 'border-yellow-200',
                    text: 'text-yellow-700',
                    iconBg: 'bg-yellow-500',
                    label: 'Pending Verification'
                };
            case 'rejected':
                return {
                    icon: XCircle,
                    color: 'red',
                    bg: 'bg-red-50',
                    border: 'border-red-200',
                    text: 'text-red-700',
                    iconBg: 'bg-red-500',
                    label: 'Rejected'
                };
            default:
                return {
                    icon: Shield,
                    color: 'gray',
                    bg: 'bg-gray-50',
                    border: 'border-gray-200',
                    text: 'text-gray-700',
                    iconBg: 'bg-gray-500',
                    label: 'Not Started'
                };
        }
    };

    const statusConfig = getStatusConfig(kycDetails.status);
    const StatusIcon = statusConfig.icon;

    return (
        <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                        <Shield className="text-blue-600" size={22} />
                        KYC Details
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">Identity verification</p>
                </div>
                <span className={`px-3 py-1.5 rounded-full text-xs font-semibold ${statusConfig.bg} ${statusConfig.text} border ${statusConfig.border} flex items-center gap-1.5`}>
                    <StatusIcon size={14} />
                    {statusConfig.label}
                </span>
            </div>

            {kycDetails.status !== 'not_started' ? (
                <div className="space-y-4">
                    {/* Full Name */}
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200">
                        <div className="flex items-center gap-3">
                            <div className="bg-blue-500 p-2 rounded-lg">
                                <User className="text-white" size={18} />
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 font-medium">Full Name</p>
                                <p className="font-bold text-gray-900">{kycDetails.fullName}</p>
                            </div>
                        </div>
                    </div>

                    {/* Email */}
                    {kycDetails.email && (
                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200">
                            <div className="flex items-center gap-3">
                                <div className="bg-purple-500 p-2 rounded-lg">
                                    <FileText className="text-white" size={18} />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 font-medium">Email Address</p>
                                    <p className="font-semibold text-gray-900">{kycDetails.email}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Aadhar */}
                    {kycDetails.aadharNumber && (
                        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-xl border border-green-200">
                            <div className="flex items-center gap-3">
                                <div className="bg-green-500 p-2 rounded-lg">
                                    <CreditCard className="text-white" size={18} />
                                </div>
                                <div>
                                    <p className="text-xs text-green-600 font-medium">Aadhar Number</p>
                                    <p className="font-mono font-bold text-gray-900">{kycDetails.aadharNumber}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* PAN */}
                    {kycDetails.panNumber && (
                        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-orange-50 to-orange-100 rounded-xl border border-orange-200">
                            <div className="flex items-center gap-3">
                                <div className="bg-orange-500 p-2 rounded-lg">
                                    <CreditCard className="text-white" size={18} />
                                </div>
                                <div>
                                    <p className="text-xs text-orange-600 font-medium">PAN Number</p>
                                    <p className="font-mono font-bold text-gray-900">{kycDetails.panNumber}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Address */}
                    {kycDetails.address && (
                        <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                            <p className="text-xs text-gray-500 font-medium mb-2">Address</p>
                            <p className="text-sm text-gray-900">{kycDetails.address}</p>
                        </div>
                    )}

                    {/* Submission Date */}
                    <div className="flex items-center justify-between p-4 bg-blue-50 rounded-xl border border-blue-200">
                        <div>
                            <p className="text-xs text-blue-600 font-medium">Submitted On</p>
                            <p className="font-semibold text-gray-900">
                                {new Date(kycDetails.submittedAt).toLocaleDateString('en-IN', {
                                    dateStyle: 'long'
                                })}
                            </p>
                        </div>
                        {kycDetails.verifiedAt && (
                            <div className="text-right">
                                <p className="text-xs text-green-600 font-medium">Verified On</p>
                                <p className="font-semibold text-gray-900">
                                    {new Date(kycDetails.verifiedAt).toLocaleDateString('en-IN', {
                                        dateStyle: 'long'
                                    })}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            ) : (
                <div className="text-center py-12">
                    <Shield className="mx-auto text-gray-400 mb-4" size={48} />
                    <p className="text-gray-600 mb-2">KYC not submitted</p>
                    <p className="text-sm text-gray-500">User needs to complete KYC</p>
                </div>
            )}
        </div>
    );
};

export default UserKYC;
