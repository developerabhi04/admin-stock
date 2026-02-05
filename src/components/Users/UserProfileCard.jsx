import { User, Phone, Mail, Calendar, CheckCircle, Shield } from 'lucide-react';

const UserProfileCard = ({ user }) => {
    return (
        <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-xl p-8 text-white mb-8">
            <div className="flex items-start justify-between">
                <div className="flex items-center gap-6">
                    <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center ring-4 ring-white/30">
                        <User className="text-white" size={48} />
                    </div>
                    <div>
                        <h2 className="text-3xl font-bold mb-2">{user.fullName}</h2>
                        <div className="flex flex-wrap gap-4 text-blue-100">
                            <div className="flex items-center gap-2">
                                <Phone size={16} />
                                <span>{user.phoneNumber}</span>
                            </div>
                            {user.email && (
                                <div className="flex items-center gap-2">
                                    <Mail size={16} />
                                    <span>{user.email}</span>
                                </div>
                            )}
                            <div className="flex items-center gap-2">
                                <Calendar size={16} />
                                <span>Joined {new Date(user.createdAt).toLocaleDateString()}</span>
                            </div>
                        </div>
                        <div className="flex gap-2 mt-3">
                            <span className="text-xs bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                                ID: {user._id?.slice(-8)}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Status Badges */}
                <div className="flex flex-col gap-2">
                    {user.isVerified && (
                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-500/20 backdrop-blur-sm rounded-full text-sm font-semibold">
                            <CheckCircle size={14} />
                            Verified
                        </span>
                    )}
                    <span className={`inline-flex items-center gap-1 px-3 py-1 ${user.kycStatus === 'verified'
                        ? 'bg-green-500/20'
                        : user.kycStatus === 'pending'
                            ? 'bg-yellow-500/20'
                            : 'bg-gray-500/20'
                        } backdrop-blur-sm rounded-full text-sm font-semibold capitalize`}>
                        <Shield size={14} />
                        KYC: {user.kycStatus || 'Not Started'}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default UserProfileCard;
