import { User, Phone, Mail, Calendar, CheckCircle, Shield } from 'lucide-react';

const UserProfileCard = ({ user = {} }) => {
  const joinedDate = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-IN', {
        dateStyle: 'medium',
      })
    : '-';

  const kycLabel =
    user.kycStatus === 'verified'
      ? 'Verified'
      : user.kycStatus === 'approved'
      ? 'Approved'
      : user.kycStatus === 'pending'
      ? 'Pending'
      : user.kycStatus === 'rejected'
      ? 'Rejected'
      : 'Not Started';

  const kycBadgeClass =
    user.kycStatus === 'verified' || user.kycStatus === 'approved'
      ? 'bg-emerald-500/15 text-emerald-50 ring-emerald-300/30'
      : user.kycStatus === 'pending'
      ? 'bg-amber-500/15 text-amber-50 ring-amber-300/30'
      : user.kycStatus === 'rejected'
      ? 'bg-red-500/15 text-red-50 ring-red-300/30'
      : 'bg-white/10 text-blue-50 ring-white/20';

  return (
    <section className="overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 p-6 shadow-xl md:p-8">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/20 backdrop-blur">
            <User className="text-white" size={38} />
          </div>

          <div className="min-w-0">
            <h2 className="truncate text-2xl font-bold text-white md:text-3xl">
              {user.fullName || user.name || 'Unnamed User'}
            </h2>

            <div className="mt-3 flex flex-wrap gap-3 text-sm text-blue-100">
              {user.phoneNumber || user.phone ? (
                <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5">
                  <Phone size={15} />
                  <span>{user.phoneNumber || user.phone}</span>
                </div>
              ) : null}

              {user.email ? (
                <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5">
                  <Mail size={15} />
                  <span className="max-w-[220px] truncate">{user.email}</span>
                </div>
              ) : null}

              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5">
                <Calendar size={15} />
                <span>Joined {joinedDate}</span>
              </div>

              {user._id ? (
                <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs md:text-sm">
                  <span>ID: {String(user._id).slice(-8)}</span>
                </div>
              ) : null}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 lg:flex-col lg:items-end">
          {user.isVerified ? (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 px-3 py-1.5 text-sm font-semibold text-emerald-50 ring-1 ring-emerald-300/30">
              <CheckCircle size={14} />
              Verified
            </span>
          ) : null}

          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-semibold ring-1 ${kycBadgeClass}`}
          >
            <Shield size={14} />
            KYC: {kycLabel}
          </span>
        </div>
      </div>
    </section>
  );
};

export default UserProfileCard;