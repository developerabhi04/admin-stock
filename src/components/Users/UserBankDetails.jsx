import { Building, CreditCard, Hash, User, Smartphone } from 'lucide-react';

const InfoRow = ({ icon: Icon, label, value, tone = 'blue', mono = false }) => {
    const tones = {
        blue: 'bg-blue-50 border-blue-200 text-blue-600',
        green: 'bg-emerald-50 border-emerald-200 text-emerald-600',
        violet: 'bg-violet-50 border-violet-200 text-violet-600',
        orange: 'bg-orange-50 border-orange-200 text-orange-600',
        pink: 'bg-pink-50 border-pink-200 text-pink-600',
    };

    return (
        <div className={`flex items-start gap-4 rounded-2xl border p-4 ${tones[tone]}`}>
            <div className="rounded-xl bg-white p-2.5 shadow-sm">
                <Icon size={18} />
            </div>
            <div className="min-w-0 flex-1">
                <p className="mb-1 text-xs font-medium uppercase tracking-wide">{label}</p>
                <p className={`break-all text-base font-bold text-slate-900 ${mono ? 'font-mono' : ''}`}>
                    {value}
                </p>
            </div>
        </div>
    );
};

const UserBankDetails = ({ user = {} }) => {
    const bankDetails = user.bankDetails || null;

    return (
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-start justify-between gap-4">
                <div>
                    <h3 className="flex items-center gap-2 text-xl font-bold text-slate-900">
                        <Building className="text-blue-600" size={22} />
                        Bank Account Details
                    </h3>
                    <p className="mt-1 text-sm text-slate-500">For withdrawals</p>
                </div>

                <span
                    className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${bankDetails ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                        }`}
                >
                    {bankDetails ? 'Added' : 'Not Added'}
                </span>
            </div>

            {bankDetails ? (
                <div className="space-y-4">
                    {bankDetails.bankName ? (
                        <InfoRow
                            icon={Building}
                            label="Bank Name"
                            value={bankDetails.bankName}
                            tone="blue"
                        />
                    ) : null}

                    {bankDetails.accountNumber ? (
                        <InfoRow
                            icon={Hash}
                            label="Account Number"
                            value={bankDetails.accountNumber}
                            tone="green"
                            mono
                        />
                    ) : null}

                    {bankDetails.accountHolderName ? (
                        <InfoRow
                            icon={User}
                            label="Account Holder"
                            value={bankDetails.accountHolderName}
                            tone="violet"
                        />
                    ) : null}

                    {bankDetails.ifscCode ? (
                        <InfoRow
                            icon={CreditCard}
                            label="IFSC Code"
                            value={bankDetails.ifscCode}
                            tone="orange"
                            mono
                        />
                    ) : null}

                    {bankDetails.upiId ? (
                        <InfoRow
                            icon={Smartphone}
                            label="UPI ID"
                            value={bankDetails.upiId}
                            tone="pink"
                            mono
                        />
                    ) : null}
                </div>
            ) : (
                <div className="py-14 text-center">
                    <Building className="mx-auto mb-4 text-slate-300" size={46} />
                    <p className="font-medium text-slate-600">No bank details added</p>
                    <p className="mt-1 text-sm text-slate-500">User has not added withdrawal details</p>
                </div>
            )}
        </div>
    );
};

export default UserBankDetails;