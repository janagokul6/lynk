'use client';

import { Icon } from '@/components/ui/Icon';
import { AppLayout } from '@/components/layout/AppLayout';

export default function AdminVerificationQueue() {
  const profiles = [
    {
      name: 'Sarah Style',
      handle: '@SarahStyle_Official',
      platform: 'instagram',
      avatar:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuDVjmbx0HvLicGSw3rgBMQB0dTeXTeW0ow3TCUfCs3oFUoKxtq7HKvQoFBPoc8JpSZ5lh_THTPyRxTmVst-l1uzyxd384OSOcD9JflJESc6oGqypg68-Zg399OIi9OZSc-cmSs-MtGDQgSfybkP0kXKnIBQoAsATtImt4LxnJN9HeJj6Lrh16KpSE0c-NEBxRw4VFfNsw4Z0RXy889AWNOOi9q3uXXfvdI_O2q0qy6F0xDK40yRAkHcz39JcEF7LTZhihxiJJwd3_Q',
      risk: 'high',
      claimed: { followers: '150k', engagement: '5.2%' },
      audit: { followers: '112k', engagement: '1.1%', status: 'down' },
      alert: 'Critical Flag: 26% Bot Followers',
    },
    {
      name: 'Tech Trekker',
      handle: '@techtrekker_io',
      platform: 'tiktok',
      avatar:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuC4AUcO7MWcTqlpSFzwnXZRGIDSCC86VUthRZfgKeNFDEiuCz5udS2IGX2ZibgdjTv7C81RbfzGmN3ShWnPI8x7VhDNe22FDiUruls8UBD_VRry4gPt98CBrAuVjDARb1IeOxsYo75x_QvhAHbeKA_IGi7jXa02FyUY0Msxzmom2baL-ZaKVPNxdxgU3KpZ7ysUtX6dVRl6sklpi0LRdXWPImMiIOfnvMqmC6xpEbt69Hrwy82nI2IX0bAkqN4W2l2_R6VcJsAiSiQ',
      risk: 'clean',
      verified: true,
      claimed: { followers: '25k', engagement: '3.0%' },
      audit: { followers: '24.8k', engagement: '3.1%', status: 'up' },
    },
    {
      name: 'Alex Growth',
      handle: '@alex_growz',
      platform: 'instagram',
      avatar:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuDAVGfpmQgL2VdEqQDGGuWohEnmZB4fDHd7h6ATQpLwkirvFyKhoCnVBl6tbd1492kh8cnk8Bw78WFY2Mlv0HLT4PDAhih4g3mSVtcuwWYKxowAQ1RukEdtLSvKduocxOJgo2nzHZaCTYRJ2SS6BsBnyApgRPekau4UHXScYBg-DvxyXo_4ZfvJdtkg1trxlGcHUJyZCwmg5t000bFp0w6C87FkR7N0HnU5hCI01_0ZZqjMaSn75SA_Eb-SN9kfq9aYytdZoLAyj54',
      risk: 'warning',
      claimed: { followers: '82k', engagement: '12%' },
      audit: { followers: '79k', engagement: '4.5%', status: 'down' },
      alert: 'Warning: Engagement Pod Activity',
    },
  ];

  const verificationHeader = (
    <header className="sticky top-0 z-50 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-md border-b border-slate-200 dark:border-border">
        <div className="flex items-center justify-between px-4 py-3">
          <h1 className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white">Verification Queue</h1>
          <button className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-slate-100 dark:hover:bg-surface-card transition-colors text-slate-500 dark:text-slate-400">
            <Icon name="filter_list" />
          </button>
        </div>
        {/* Search Bar */}
        <div className="px-4 pb-4">
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Icon name="search" className="text-slate-500 group-focus-within:text-primary" />
            </div>
            <input
              className="block w-full pl-10 pr-3 py-2.5 border border-slate-200 dark:border-transparent rounded-lg leading-5 bg-white dark:bg-surface-dark text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-primary sm:text-sm transition-all"
              placeholder="Search by handle or ID..."
              type="text"
            />
          </div>
        </div>
    </header>
  );

  return (
    <AppLayout variant="admin" activeTab="Trust" header={verificationHeader}>
      <div className="min-h-screen bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 flex flex-col">
        {/* Main Content */}
        <main className="flex-1 overflow-y-auto pb-24">
        {/* Summary Stats Scroll */}
        <div className="w-full overflow-x-auto hide-scrollbar px-4 pt-4 pb-2 flex gap-3 snap-x">
          <div className="snap-start flex-none w-[140px] bg-white dark:bg-surface-dark border border-slate-200 dark:border-border rounded-xl p-3 flex flex-col justify-between">
            <div className="flex items-center gap-2 text-primary">
              <Icon name="pending_actions" size={20} />
              <span className="text-xs font-bold uppercase tracking-wider">Pending</span>
            </div>
            <div>
              <span className="text-2xl font-bold text-slate-900 dark:text-white">52</span>
              <p className="text-[10px] text-slate-500 dark:text-slate-400">Requires review</p>
            </div>
          </div>
          <div className="snap-start flex-none w-[140px] bg-white dark:bg-surface-dark border border-red-500/30 rounded-xl p-3 flex flex-col justify-between relative overflow-hidden">
            <div className="absolute right-0 top-0 w-12 h-12 bg-red-500/10 blur-xl rounded-full"></div>
            <div className="flex items-center gap-2 text-red-500 dark:text-red-400">
              <Icon name="warning" size={20} />
              <span className="text-xs font-bold uppercase tracking-wider">High Risk</span>
            </div>
            <div>
              <span className="text-2xl font-bold text-slate-900 dark:text-white">12</span>
              <p className="text-[10px] text-slate-500 dark:text-slate-400">Bot activity detected</p>
            </div>
          </div>
          <div className="snap-start flex-none w-[140px] bg-white dark:bg-surface-dark border border-slate-200 dark:border-border rounded-xl p-3 flex flex-col justify-between">
            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
              <Icon name="verified_user" size={20} />
              <span className="text-xs font-bold uppercase tracking-wider">Auto-Approve</span>
            </div>
            <div>
              <span className="text-2xl font-bold text-slate-900 dark:text-white">85%</span>
              <p className="text-[10px] text-slate-500 dark:text-slate-400">Low risk rate</p>
            </div>
          </div>
        </div>

        <div className="px-4 py-2">
          <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Priority Review</h2>

          {profiles.map((profile, idx) => (
            <div
              key={idx}
              className={`mb-4 bg-white dark:bg-surface-dark rounded-xl border overflow-hidden relative ${
                profile.risk === 'high'
                  ? 'border-red-300 dark:border-red-900/40'
                  : profile.risk === 'warning'
                  ? 'border-slate-200 dark:border-border'
                  : 'border-slate-200 dark:border-border'
              }`}
            >
              {/* Risk Banner */}
              {profile.alert && (
                <div
                  className={`border-b px-4 py-2 flex items-center gap-2 ${
                    profile.risk === 'high'
                      ? 'bg-red-900/20 border-red-900/30'
                      : 'bg-amber-900/20 border-amber-900/30'
                  }`}
                >
                  <Icon
                    name={profile.risk === 'high' ? 'gpp_maybe' : 'group_work'}
                    className={`text-sm ${profile.risk === 'high' ? 'text-red-500' : 'text-amber-500'}`}
                  />
                  <span
                    className={`text-xs font-bold uppercase tracking-wide ${
                      profile.risk === 'high' ? 'text-red-400' : 'text-amber-400'
                    }`}
                  >
                    {profile.alert}
                  </span>
                </div>
              )}

              {profile.risk === 'clean' && (
                <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 absolute top-4 right-4 z-10">
                  <Icon name="check_circle" className="text-emerald-400 text-[14px]" />
                  <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wide">Clean</span>
                </div>
              )}

              <div className="p-4">
                {/* Profile Header */}
                <div className="flex justify-between items-start mb-4">
                  <div className="flex gap-3">
                    <div className="relative">
                      <img
                        alt={profile.name}
                        className="w-12 h-12 rounded-full object-cover border-2 border-slate-200 dark:border-border"
                        src={profile.avatar}
                      />
                      <div className="absolute -bottom-1 -right-1 bg-slate-100 dark:bg-surface-dark rounded-full p-0.5">
                        <div
                          className={`w-4 h-4 rounded-full flex items-center justify-center ${
                            profile.platform === 'instagram'
                              ? 'bg-gradient-to-tr from-purple-500 to-pink-500'
                              : 'bg-black'
                          }`}
                        >
                          {profile.platform === 'instagram' ? (
                            <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                            </svg>
                          ) : (
                            <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
                            </svg>
                          )}
                        </div>
                      </div>
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 dark:text-white text-base flex items-center gap-1">
                        {profile.name}
                        {profile.verified && <Icon name="verified" className="text-blue-400 text-[14px] fill-current" />}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{profile.handle}</p>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
                      <Icon name="more_horiz" size={14} />
                    </button>
                  </div>
                </div>

                {/* Comparison Grid */}
                <div className="grid grid-cols-2 gap-px bg-slate-200 dark:bg-border rounded-lg overflow-hidden border border-slate-200 dark:border-border mb-4">
                  {/* Claimed Side */}
                  <div className="bg-slate-50 dark:bg-surface-dark p-3">
                    <div className="flex items-center gap-1.5 mb-2">
                      <Icon name="person" className="text-slate-500 text-[16px]" />
                      <span className="text-[10px] font-bold uppercase text-slate-500 tracking-wider">Claimed</span>
                    </div>
                    <div className="mb-2">
                      <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">{profile.claimed.followers}</p>
                      <p className="text-[10px] text-slate-500">Followers</p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">{profile.claimed.engagement}</p>
                      <p className="text-[10px] text-slate-500">Engagement</p>
                    </div>
                  </div>

                  {/* AI Audit Side */}
                  <div className="bg-slate-100/80 dark:bg-surface-dark/50 p-3 relative">
                    <div className="absolute top-0 right-0 w-full h-full bg-primary/5 pointer-events-none"></div>
                    <div className="flex items-center gap-1.5 mb-2 relative z-10">
                      <Icon name="smart_toy" className="text-primary text-[16px]" />
                      <span className="text-[10px] font-bold uppercase text-primary tracking-wider">AI Audit</span>
                    </div>
                    <div className="mb-2 relative z-10">
                      <div className="flex items-center gap-1">
                        <p
                          className={`text-sm font-bold ${
                            profile.audit.status === 'down'
                              ? 'text-red-400'
                              : profile.audit.status === 'up'
                              ? 'text-emerald-400'
                              : 'text-slate-600 dark:text-slate-200'
                          }`}
                        >
                          {profile.audit.followers}
                        </p>
                        {profile.audit.status === 'down' && <Icon name="arrow_downward" className="text-red-400 text-[12px]" />}
                        {profile.audit.status === 'up' && <Icon name="arrow_upward" className="text-emerald-400 text-[12px]" />}
                        {profile.audit.status === 'neutral' && <Icon name="remove" className="text-slate-400 text-[12px]" />}
                      </div>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400">Real Followers</p>
                    </div>
                    <div className="relative z-10">
                      <div className="flex items-center gap-1">
                        <p
                          className={`text-sm font-bold ${
                            profile.audit.status === 'down'
                              ? profile.risk === 'warning'
                                ? 'text-amber-400'
                                : 'text-red-400'
                              : profile.audit.status === 'up'
                              ? 'text-emerald-400'
                              : 'text-slate-600 dark:text-slate-200'
                          }`}
                        >
                          {profile.audit.engagement}
                        </p>
                        {profile.audit.status === 'down' && (
                          <Icon
                            name="arrow_downward"
                            className={`text-[12px] ${profile.risk === 'warning' ? 'text-amber-400' : 'text-red-400'}`}
                          />
                        )}
                        {profile.audit.status === 'up' && <Icon name="arrow_upward" className="text-emerald-400 text-[12px]" />}
                        {profile.audit.status === 'neutral' && <Icon name="check" className="text-emerald-400 text-[12px]" />}
                      </div>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400">Real Eng.</p>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  {profile.risk === 'clean' ? (
                    <>
                      <button className="flex-1 py-2.5 px-4 rounded-lg border border-slate-300 dark:border-border text-slate-600 dark:text-slate-400 text-sm font-semibold hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white transition-colors flex items-center justify-center gap-2">
                        Investigate
                      </button>
                      <button className="flex-[2] py-2.5 px-4 rounded-lg bg-primary text-white text-sm font-bold hover:bg-primary/90 transition-colors shadow-[0_0_15px_-3px_rgba(19,164,236,0.3)] flex items-center justify-center gap-2">
                        <Icon name="verified" size={18} />
                        Verify
                      </button>
                    </>
                  ) : (
                    <>
                      <button className="flex-1 py-2.5 px-4 rounded-lg border border-red-500/50 text-red-400 text-sm font-semibold hover:bg-red-500/10 transition-colors flex items-center justify-center gap-2">
                        <Icon name="flag" size={18} />
                        Flag
                      </button>
                      <button className="flex-1 py-2.5 px-4 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-sm font-semibold hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors flex items-center justify-center gap-2">
                        <Icon name="search" size={18} />
                        Investigate
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}

          {/* Loader at bottom */}
          <div className="flex justify-center py-4 text-slate-500 text-sm gap-2">
            <Icon name="progress_activity" className="animate-spin text-primary" />
            Loading more profiles...
          </div>
        </div>
        </main>

        {/* Floating Action Button for Batch Process */}
        <div className="fixed bottom-20 right-4 z-40">
          <button type="button" className="flex items-center justify-center gap-2 bg-primary text-white h-12 px-5 rounded-full shadow-[0_4px_14px_0_rgba(19,164,236,0.39)] hover:bg-primary/90 transition-all active:scale-95 font-bold text-sm">
            <Icon name="playlist_add_check" />
            Batch Verify (3)
          </button>
        </div>
      </div>
    </AppLayout>
  );
}
