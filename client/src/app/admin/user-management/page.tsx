'use client';

import { Icon } from '@/components/ui/Icon';
import { AppLayout } from '@/components/layout/AppLayout';

export default function UserManagement() {
  const users = [
    {
      name: 'Sarah Jenkins',
      handle: '@sarahstyle',
      role: 'Influencer',
      status: 'High Risk',
      statusColor: 'danger',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAbLcOUW0ojIyVnaG5HJ0GnfsGHtcb4hXv4eQDKNQqHE6o_kBmtj6_L1jI9sN0GB76ZCJ5j5WL82CWkMSPgmKwk1EQ7S6Zb3NyOiNocpsAdgv2-MfgqcvsWnc8eZSKbgWavD4J05yhihFQJeikAPv00MHRucDUNR8yQFPV4KI_zSSCzLUnij57AMw__HeZmZ02elrijC2dOiKu5Pk35doQIJmnOXpKixDMzzsxM4qm-pGFBP4D6ysWGQZT075h5b49PQWmyHzloMjE',
      badge: 'warning',
      aiAlert: 'Suspicious follower growth detected (+50k in 24h). Potential bot activity.',
      actions: ['Ignore', 'Suspend'],
    },
    {
      name: 'TechNova Inc.',
      handle: '@technova_official',
      role: 'Brand',
      status: 'Pending',
      statusColor: 'warning',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBesUM09fnwP6-y7Q_XHrW9FSv_LimS8OaFXInQoq2ds_JZCySCl3L2Mluehdd1n3MgBlRVeldqA6sb22BS7EJEA9e0id4bpzpHnC3_Br7_PRj_X_Hi3aM3Wiqw3lpCcwIyFFmyVNVKcRcmATFiOsAVSvcviTEyeWONUdjLNdmSVoSZNPPGpSMOi8w-a_3aIiqpgnf1etgfCBoL8bIf8Bvnaw6QGs6tV6aDKvVj3o5AVbh3CDmIlBsyqIqungE4pjERZH2Cpz3wKno',
      badge: 'hourglass_empty',
      trustScore: 85,
      actions: ['Review Docs', 'Verify'],
    },
    {
      name: 'John Doe Design',
      handle: '@johndoe_design',
      role: 'Influencer',
      status: 'Medium Risk',
      statusColor: 'orange-400',
      avatar: null,
      initials: 'JD',
      badge: 'warning_amber',
      aiAlert: 'Engagement rate drop detected (-15%). Possible shadowban.',
      actions: ['Details', 'Contact'],
    },
    {
      name: 'Global Ventures',
      handle: '@global_ventures',
      role: 'Brand',
      status: 'Verified',
      statusColor: 'success',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA5t73CuYFP9NPE7X3wUUPbLnNbsvra-J4HKWDbZJsb9KLu3LTGDBZWLxjn13JNOR7hC1piAyFLvSvKsXgoz4wnzutcKM7sDFKmBIpx2NhE6BaMzbih799R1Hp211cC7-OEmpsc2RbkdaZzcckPEtE0lCUlnlhWQSCZTXSB0bz7kouorQ5ggTIcVCQLc2hUG_DU9wo9HnIHZ0w8kuP2TPAdgmqPBYECg5_akv7EPh7PpkgZmD_Sw8fCobJ9OX6r-j3kn822Xbus6to',
      badge: 'check_circle',
      opacity: 'opacity-75 hover:opacity-100',
    },
  ];

  const adminHeader = (
    <header className="flex-none px-4 pt-6 pb-2 bg-background-dark/95 backdrop-blur-sm z-20 sticky top-0">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <button className="text-slate-400 hover:text-white transition-colors">
              <Icon name="arrow_back" />
            </button>
            <h1 className="text-xl font-bold text-white">User Oversight</h1>
          </div>
          <button className="flex items-center justify-center w-10 h-10 rounded-full bg-surface-highlight text-primary hover:bg-primary/20 transition-colors">
            <Icon name="battery_alert" />
          </button>
        </div>

        {/* Stats Summary Widget */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="flex flex-col gap-1 rounded-xl p-4 bg-surface-dark border border-surface-highlight relative overflow-hidden group">
            <div className="absolute right-0 top-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
              <Icon name="flag" className="text-4xl text-danger" />
            </div>
            <p className="text-slate-400 text-xs font-medium uppercase tracking-wider">Flagged</p>
            <div className="flex items-end gap-2">
              <p className="text-white text-2xl font-bold leading-none">3</p>
              <span className="text-danger text-xs font-medium mb-1">High Risk</span>
            </div>
          </div>
          <div className="flex flex-col gap-1 rounded-xl p-4 bg-surface-dark border border-surface-highlight relative overflow-hidden group">
            <div className="absolute right-0 top-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
              <Icon name="verified_user" className="text-4xl text-warning" />
            </div>
            <p className="text-slate-400 text-xs font-medium uppercase tracking-wider">Pending</p>
            <div className="flex items-end gap-2">
              <p className="text-white text-2xl font-bold leading-none">12</p>
              <span className="text-warning text-xs font-medium mb-1">To Verify</span>
            </div>
          </div>
        </div>

        {/* Search & Filter */}
        <div className="space-y-3">
          <div className="relative">
            <Icon name="search" className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              className="w-full bg-surface-dark border-none rounded-lg py-2.5 pl-10 pr-4 text-sm text-white placeholder-slate-500 focus:ring-1 focus:ring-primary"
              placeholder="Search users by name or handle..."
              type="text"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-1">
            <button className="flex-none px-3 py-1.5 rounded-full bg-primary text-white text-xs font-medium whitespace-nowrap">
              High Risk
            </button>
            <button className="flex-none px-3 py-1.5 rounded-full bg-surface-highlight text-slate-300 hover:text-white text-xs font-medium whitespace-nowrap border border-transparent hover:border-slate-600 transition-colors">
              Pending Verification
            </button>
            <button className="flex-none px-3 py-1.5 rounded-full bg-surface-highlight text-slate-300 hover:text-white text-xs font-medium whitespace-nowrap border border-transparent hover:border-slate-600 transition-colors">
              Brands
            </button>
            <button className="flex-none px-3 py-1.5 rounded-full bg-surface-highlight text-slate-300 hover:text-white text-xs font-medium whitespace-nowrap border border-transparent hover:border-slate-600 transition-colors">
              Influencers
            </button>
          </div>
        </div>
    </header>
  );

  return (
    <AppLayout variant="admin" activeTab="Users" header={adminHeader}>
      <div className="relative flex min-h-full w-full flex-col overflow-hidden max-w-md mx-auto border-x border-surface-highlight shadow-2xl bg-background-dark text-slate-100">
        {/* User List Content */}
        <main className="flex-1 overflow-y-auto px-4 py-2 space-y-3 pb-24">
        {users.map((user, idx) => (
          <div
            key={idx}
            className={`group relative flex flex-col gap-3 p-4 rounded-xl bg-surface-dark border border-surface-highlight hover:border-slate-600 transition-all ${user.opacity || ''}`}
          >
            <div className="flex items-start gap-3">
              {/* Checkbox */}
              <div className="pt-1">
                <input
                  className="rounded border-slate-600 bg-surface-highlight text-primary focus:ring-primary focus:ring-offset-background-dark h-5 w-5 cursor-pointer"
                  type="checkbox"
                />
              </div>
              {/* Avatar */}
              <div className="relative flex-none">
                {user.avatar ? (
                  <img
                    alt={user.name}
                    className="h-12 w-12 rounded-full object-cover ring-2 ring-surface-highlight"
                    src={user.avatar}
                  />
                ) : (
                  <div className="h-12 w-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg ring-2 ring-surface-highlight">
                    {user.initials}
                  </div>
                )}
                <div className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full bg-surface-dark flex items-center justify-center">
                  <Icon
                    name={user.badge}
                    className={`text-[16px] ${
                      user.statusColor === 'danger'
                        ? 'text-danger'
                        : user.statusColor === 'warning'
                        ? 'text-warning'
                        : user.statusColor === 'orange-400'
                        ? 'text-orange-400'
                        : 'text-success'
                    }`}
                  />
                </div>
              </div>
              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-0.5">
                  <h3 className="text-white font-bold text-sm truncate">{user.name}</h3>
                  <span
                    className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${
                      user.statusColor === 'danger'
                        ? 'bg-danger/10 text-danger ring-danger/20'
                        : user.statusColor === 'warning'
                        ? 'bg-warning/10 text-warning ring-warning/20'
                        : user.statusColor === 'orange-400'
                        ? 'bg-orange-400/10 text-orange-400 ring-orange-400/20'
                        : 'bg-success/10 text-success ring-success/20'
                    }`}
                  >
                    {user.status}
                  </span>
                </div>
                <p className="text-slate-400 text-xs truncate mb-2">
                  {user.handle} • <span className="text-slate-500">{user.role}</span>
                </p>
                {/* AI Insight or Trust Score */}
                {user.aiAlert && (
                  <div className="flex items-start gap-2 bg-background-dark/50 p-2 rounded-lg border border-white/5">
                    <Icon name="smart_toy" className="text-primary text-sm mt-0.5" />
                    <div>
                      <p className="text-slate-300 text-xs leading-relaxed">
                        <span className="text-primary font-medium">AI Alert:</span> {user.aiAlert}
                      </p>
                    </div>
                  </div>
                )}
                {user.trustScore && (
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-24 bg-surface-highlight rounded-full overflow-hidden">
                      <div className="h-full bg-success rounded-full" style={{ width: `${user.trustScore}%` }}></div>
                    </div>
                    <span className="text-xs text-success font-medium">{user.trustScore}% Trust Score</span>
                  </div>
                )}
              </div>
            </div>
            {/* Actions */}
            {user.actions && (
              <div className="flex gap-2 justify-end mt-1 pt-3 border-t border-white/5">
                {user.actions.map((action, actionIdx) => (
                  <button
                    key={actionIdx}
                    className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors flex items-center gap-1 ${
                      action === 'Suspend'
                        ? 'text-white bg-danger hover:bg-danger/90'
                        : action === 'Verify'
                        ? 'text-white bg-primary hover:bg-primary/90'
                        : 'text-slate-300 hover:text-white bg-surface-highlight hover:bg-white/10'
                    }`}
                  >
                    {action === 'Suspend' && <Icon name="block" size={14} />}
                    {action === 'Verify' && <Icon name="verified" size={14} />}
                    {action}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
        </main>
      </div>
    </AppLayout>
  );
}
