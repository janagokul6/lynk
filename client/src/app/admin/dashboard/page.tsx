'use client';

import { Icon } from '@/components/ui/Icon';
import { AppLayout } from '@/components/layout/AppLayout';
import { AdminHeader } from '@/components/layout/AdminHeader';

export default function AdminDashboard() {
  return (
    <AppLayout variant="admin" activeTab="Dashboard" header={<AdminHeader />}>
      <div className="min-h-screen bg-background-dark text-slate-100 flex flex-col">
        {/* Main Content */}
        <main className="flex-1 px-4 py-6 space-y-6">
        {/* Critical Alert Banner */}
        <div className="relative overflow-hidden rounded-xl bg-danger/10 border border-danger/30 p-4 shadow-glow-danger">
          <div className="absolute top-0 right-0 p-2 opacity-50">
            <Icon name="gpp_maybe" className="text-danger text-6xl rotate-12" />
          </div>
          <div className="relative z-10 flex flex-col gap-3">
            <div className="flex items-center gap-2 text-danger">
              <Icon name="warning" className="fill-current" />
              <p className="text-xs font-bold uppercase tracking-wider">High Risk Fraud Detected</p>
            </div>
            <div>
              <h2 className="text-white text-lg font-bold leading-tight">Bot Network Infiltration</h2>
              <p className="text-slate-300 text-sm mt-1">Suspicious activity in Campaign #402. 350+ fake accounts identified.</p>
            </div>
            <div className="flex gap-3 mt-1">
              <button className="flex-1 bg-danger hover:bg-red-600 text-white text-sm font-bold py-2.5 px-4 rounded-lg shadow-lg transition-colors flex items-center justify-center gap-2">
                <span>REVIEW NOW</span>
                <Icon name="arrow_forward" size={18} />
              </button>
              <button className="bg-surface-dark hover:bg-surface-lighter text-slate-300 border border-white/10 text-sm font-bold py-2.5 px-4 rounded-lg transition-colors">
                DISMISS
              </button>
            </div>
          </div>
        </div>

        {/* Health Pulse Cards */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-slate-400 text-xs font-bold uppercase tracking-widest">Platform Health</h3>
            <span className="text-xs text-primary font-medium">Real-time</span>
          </div>
          <div className="flex gap-3 overflow-x-auto hide-scrollbar pb-2 -mx-4 px-4 snap-x">
            {/* Active Users Card */}
            <div className="snap-start min-w-[160px] bg-surface-dark border border-white/5 rounded-xl p-4 flex flex-col justify-between h-32 relative overflow-hidden group">
              <div className="absolute -right-4 -top-4 w-16 h-16 bg-primary/10 rounded-full blur-xl group-hover:bg-primary/20 transition-all"></div>
              <div>
                <p className="text-slate-400 text-xs font-medium mb-1">Active Users</p>
                <p className="text-white text-2xl font-bold">12.5k</p>
              </div>
              <div className="flex items-end justify-between">
                <div className="h-8 flex items-end gap-[2px]">
                  <div className="w-1 bg-primary/30 h-3 rounded-t-sm"></div>
                  <div className="w-1 bg-primary/50 h-5 rounded-t-sm"></div>
                  <div className="w-1 bg-primary/40 h-4 rounded-t-sm"></div>
                  <div className="w-1 bg-primary h-7 rounded-t-sm shadow-[0_0_8px_rgba(19,164,236,0.6)]"></div>
                  <div className="w-1 bg-primary/60 h-5 rounded-t-sm"></div>
                </div>
                <span className="text-success text-xs font-bold flex items-center bg-success/10 px-1.5 py-0.5 rounded">
                  <Icon name="trending_up" size={14} className="mr-0.5" />
                  12%
                </span>
              </div>
            </div>

            {/* GMV Card */}
            <div className="snap-start min-w-[160px] bg-surface-dark border border-white/5 rounded-xl p-4 flex flex-col justify-between h-32 relative overflow-hidden group">
              <div className="absolute -right-4 -top-4 w-16 h-16 bg-success/10 rounded-full blur-xl group-hover:bg-success/20 transition-all"></div>
              <div>
                <p className="text-slate-400 text-xs font-medium mb-1">GMV (24h)</p>
                <p className="text-white text-2xl font-bold">₹1.2M</p>
              </div>
              <div className="flex items-end justify-between">
                <div className="h-8 flex items-end gap-[2px]">
                  <div className="w-1 bg-success/30 h-2 rounded-t-sm"></div>
                  <div className="w-1 bg-success/50 h-4 rounded-t-sm"></div>
                  <div className="w-1 bg-success/40 h-3 rounded-t-sm"></div>
                  <div className="w-1 bg-success h-6 rounded-t-sm shadow-[0_0_8px_rgba(52,199,89,0.6)]"></div>
                  <div className="w-1 bg-success/60 h-8 rounded-t-sm"></div>
                </div>
                <span className="text-success text-xs font-bold flex items-center bg-success/10 px-1.5 py-0.5 rounded">
                  <Icon name="trending_up" size={14} className="mr-0.5" />
                  8%
                </span>
              </div>
            </div>

            {/* Server Load Card */}
            <div className="snap-start min-w-[160px] bg-surface-dark border border-white/5 rounded-xl p-4 flex flex-col justify-between h-32 relative overflow-hidden group">
              <div className="absolute -right-4 -top-4 w-16 h-16 bg-warning/10 rounded-full blur-xl group-hover:bg-warning/20 transition-all"></div>
              <div>
                <p className="text-slate-400 text-xs font-medium mb-1">Server Load</p>
                <p className="text-white text-2xl font-bold">42%</p>
              </div>
              <div className="flex items-end justify-between">
                <div className="h-8 flex items-end gap-[2px]">
                  <div className="w-1 bg-warning/30 h-6 rounded-t-sm"></div>
                  <div className="w-1 bg-warning/50 h-5 rounded-t-sm"></div>
                  <div className="w-1 bg-warning/40 h-7 rounded-t-sm"></div>
                  <div className="w-1 bg-warning h-4 rounded-t-sm shadow-[0_0_8px_rgba(255,204,0,0.6)]"></div>
                  <div className="w-1 bg-warning/60 h-3 rounded-t-sm"></div>
                </div>
                <span className="text-success text-xs font-bold flex items-center bg-success/10 px-1.5 py-0.5 rounded">
                  <Icon name="trending_down" size={14} className="mr-0.5" />
                  2%
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Market Liquidity Chart */}
        <div className="bg-surface-dark border border-white/5 rounded-xl p-5 shadow-lg">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-white text-base font-bold uppercase tracking-wider mb-1">Market Liquidity</h3>
              <p className="text-slate-400 text-xs">Brand Demand vs. Influencer Supply</p>
            </div>
            <div className="bg-surface-lighter rounded-lg p-1 flex gap-1">
              <button className="px-2 py-1 text-xs font-medium text-white bg-white/10 rounded">24h</button>
              <button className="px-2 py-1 text-xs font-medium text-slate-400 hover:text-white">7d</button>
            </div>
          </div>
          <div className="relative h-48 w-full">
            <div className="absolute inset-0 flex flex-col justify-between">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="border-b border-white/5 w-full h-0"></div>
              ))}
            </div>
            <div className="absolute inset-0 flex items-end opacity-20">
              <div className="w-full h-full bg-gradient-to-t from-primary via-primary/20 to-transparent" style={{ clipPath: 'polygon(0% 100%, 0% 60%, 20% 50%, 40% 70%, 60% 40%, 80% 30%, 100% 50%, 100% 100%)' }}></div>
            </div>
            <svg className="absolute inset-0 w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 100">
              <path d="M0,60 Q20,50 40,70 T80,30 T100,50" fill="none" stroke="#13a4ec" strokeWidth="2" style={{ filter: 'drop-shadow(0 0 4px #13a4ec)', opacity: 0.5 }} vectorEffect="non-scaling-stroke" />
              <path d="M0,80 Q25,75 50,40 T100,20" fill="none" stroke="#ffffff" strokeWidth="2" vectorEffect="non-scaling-stroke" />
              <circle className="animate-pulse" cx="100" cy="20" fill="#ffffff" r="3" />
            </svg>
            <div className="absolute bottom-0 left-0 right-0 flex justify-between text-[10px] text-slate-500 pt-2 font-mono">
              <span>00:00</span>
              <span>06:00</span>
              <span>12:00</span>
              <span>18:00</span>
              <span>23:59</span>
            </div>
          </div>
          <div className="flex gap-4 mt-4 justify-center">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-white"></div>
              <span className="text-xs text-slate-400">Brand Demand</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-primary shadow-glow"></div>
              <span className="text-xs text-slate-400">Inf. Supply</span>
            </div>
          </div>
        </div>

        {/* AI Insight Banner */}
        <div className="bg-gradient-to-r from-purple-900/30 to-blue-900/30 border border-indigo-500/20 rounded-xl p-4 flex items-start gap-3">
          <Icon name="auto_awesome" className="text-indigo-400 mt-0.5" />
          <div>
            <p className="text-indigo-200 text-sm font-semibold">AI Prediction</p>
            <p className="text-indigo-100/80 text-xs mt-0.5 leading-relaxed">
              Supply shortage predicted in <span className="text-white font-medium">'Beauty'</span> category for the upcoming weekend. Suggest boosting influencer incentives.
            </p>
          </div>
        </div>

        {/* Verification Queue */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-white text-base font-bold uppercase tracking-wider">Verification Queue</h3>
            <a className="text-primary text-xs font-bold hover:text-primary/80" href="#">VIEW ALL</a>
          </div>
          <div className="space-y-3">
            {[
              { name: '@SarahStyle', category: 'Fashion', tier: 'Tier 2', time: '2h', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBXScE13Stpq9liT7vumw2PDHjBcSGmYdpGBU4s7W9pUX8W-MScqFysraA6U7l_WQ6_11HGW90XiCafyn5sXawaRljg5wupP2kdcZSTCyheS-wGwL0yTDkNaaVwQas0q_3MFAGB-Lnm0Bgjrxlj-OevGOjWTC60175NS31mMihwoxKZ3-SnicAk-ZT1uW79s8G0UwqqGJGGPsVSInSudcO3DBJ0YNbdfsZ6wS7W2j5mA68bVOb2a7KGjNehb_2JwJ1_AzMUwvcJq7g', timeColor: 'bg-warning' },
              { name: '@TechGuru', category: 'Tech', tier: 'Tier 1', time: '45m', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDALhHDoTWV05oha3SjweJeTfJvQdBn9DaSHyic_PjVndR-lcasKYnlyBCsaACki0Uc4eXhQXXfT7s0abjHTNquM-Og929O45cPXJwKzKLZPHKsrbhI04XItgTCuge1F1fUBt1PiAi2rR6sdW12H-DhdOJrIiEV45K5XXMltD4RP5IIq2wFj_-9-LmKBlIuNhyX_yPfdfQ-5OTPMwgF6nbNd36ZrZE0jyeE95C2UHqMwn3XtdxMWzUNp17HrtHMWJngVO_XkCkUiHc', timeColor: 'bg-warning' },
              { name: '@BellaVibe', category: 'Lifestyle', tier: 'Tier 3', time: '5m', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDB7MRmuVOBvcVc4SXvtQfaPfbJabmrTLi_GsdlhIf55OUBFFcQhK1dDL4Y_ZXuWLn59HAZqKETcC9ObG9yWC0lJ4TZhiKX4dHmzKHYSuZYRYIiz-Qdivl1kIhnpF8gp3Ogl2LswIAod0V8TwZjY5_8K5U2E5SXsciKF1KESFp69rqjSZUt-g3TP1qUIsEYwsWEGNPBkIFmbnS7p582z6_v8geV1dFECkuuHt5dOqXntCd1S2JF4YmvnfVNGQj1cTLbLn3XzjE40Tk', timeColor: 'bg-success', opacity: 'opacity-60' },
            ].map((user, idx) => (
              <div key={idx} className={`bg-surface-dark border border-white/5 rounded-lg p-3 flex items-center justify-between group hover:border-white/10 transition-colors ${user.opacity || ''}`}>
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <img alt={user.name} className="w-10 h-10 rounded-full object-cover ring-2 ring-white/5" src={user.img} />
                    <div className={`absolute -bottom-0.5 -right-0.5 ${user.timeColor} text-black text-[8px] font-bold px-1 rounded-full border border-surface-dark`}>{user.time}</div>
                  </div>
                  <div>
                    <p className="text-white text-sm font-bold">{user.name}</p>
                    <div className="flex items-center gap-2">
                      <span className="text-slate-400 text-xs">{user.category}</span>
                      <span className="w-1 h-1 rounded-full bg-slate-600"></span>
                      <span className="text-slate-500 text-xs">{user.tier}</span>
                    </div>
                  </div>
                </div>
                <button className="bg-primary/10 hover:bg-primary/20 text-primary p-2 rounded-lg transition-colors border border-primary/20">
                  <Icon name="check_circle" size={20} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </main>

        {/* Floating Action Button */}
        <div className="fixed bottom-24 right-5 z-40">
          <button type="button" className="bg-primary text-white w-14 h-14 rounded-full shadow-[0_0_20px_rgba(19,164,236,0.5)] flex items-center justify-center hover:scale-105 transition-transform active:scale-95">
            <Icon name="add_alert" size={28} />
          </button>
        </div>
      </div>
    </AppLayout>
  );
}
