import { Icon } from '@/components/ui/Icon';
import Link from 'next/link';

export default function ROIComparisonPage() {
  return (
    <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 font-display min-h-screen flex flex-col overflow-x-hidden antialiased selection:bg-primary/30">
      {/* Sticky Header */}
      <header className="sticky top-0 z-30 flex items-center justify-between px-4 py-3 bg-background-light/90 dark:bg-background-dark/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
        <Link
          href="/brand/campaigns"
          className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-600 dark:text-slate-300"
        >
          <Icon name="arrow_back" size={24} />
        </Link>
        <h1 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">Campaign Forecast</h1>
        <button className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-600 dark:text-slate-300">
          <Icon name="more_horiz" size={24} />
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col gap-6 p-4 pb-32">
        {/* Hero Summary Card */}
        <section className="bg-white dark:bg-surface-dark rounded-3xl p-6 shadow-xl border border-slate-200 dark:border-slate-800 relative overflow-hidden">
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/20 blur-3xl rounded-full pointer-events-none"></div>

          <div className="flex flex-col gap-6 relative z-10">
            <div className="flex flex-col gap-1">
              <span className="text-slate-500 dark:text-slate-400 text-sm font-medium uppercase tracking-wider flex items-center gap-2">
                <Icon name="analytics" size={18} className="text-primary" />
                Total Projected Revenue
              </span>
              <div className="flex items-baseline gap-1">
                <h2 className="text-5xl font-extrabold text-slate-900 dark:text-white tracking-tighter">₹12,450</h2>
                <span className="text-emerald-400 text-lg font-bold flex items-center bg-emerald-400/10 px-2 py-0.5 rounded-full">
                  <Icon name="trending_up" size={14} className="font-bold mr-0.5" />
                  +15%
                </span>
              </div>
              <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Based on historic performance of similar brands.</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-50 dark:bg-surface-card p-4 rounded-2xl border border-slate-200 dark:border-slate-700/50">
                <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-1">ROI %</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">340%</p>
                <p className="text-emerald-400 text-xs font-medium mt-1 flex items-center gap-1">
                  <Icon name="arrow_upward" size={14} /> 2.5% vs avg
                </p>
              </div>
              <div className="bg-slate-50 dark:bg-surface-card p-4 rounded-2xl border border-slate-200 dark:border-slate-700/50">
                <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-1">Est. CPA</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">₹4.20</p>
                <p className="text-emerald-400 text-xs font-medium mt-1 flex items-center gap-1">
                  <Icon name="arrow_downward" size={14} /> 0.50% vs avg
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Compare with Competitors */}
        <section>
          <div className="flex items-center justify-between mb-4 px-2">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Compare with Competitors</h3>
          </div>

          <div className="bg-white dark:bg-surface-dark rounded-3xl p-5 border border-slate-200 dark:border-slate-800">
            {/* Header Row */}
            <div className="flex gap-4 mb-6 border-b border-slate-200 dark:border-slate-800 pb-2">
              <div className="w-1/4"></div>
              <div className="w-1/4 flex flex-col items-center">
                <div className="size-8 rounded-full bg-primary flex items-center justify-center text-xs font-bold text-white mb-1 shadow-[0_0_20px_-5px_rgba(19,164,236,0.3)] ring-2 ring-primary/30">
                  You
                </div>
              </div>
              <div className="w-1/4 flex flex-col items-center opacity-70">
                <div className="size-8 rounded-full bg-slate-300 dark:bg-slate-700 flex items-center justify-center text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">
                  C1
                </div>
              </div>
              <div className="w-1/4 flex flex-col items-center opacity-70">
                <div className="size-8 rounded-full bg-slate-300 dark:bg-slate-700 flex items-center justify-center text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">
                  C2
                </div>
              </div>
            </div>

            {/* Engagement Rate */}
            <div className="mb-6 relative group">
              <div className="flex justify-between items-end mb-2 px-1">
                <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">
                  Engagement Rate
                </span>
                <span className="text-emerald-400 text-xs font-bold bg-emerald-400/10 px-1.5 py-0.5 rounded border border-emerald-400/20">
                  Better Value
                </span>
              </div>
              <div className="flex items-end gap-4 h-24">
                <div className="w-1/4 h-full flex flex-col justify-end items-center gap-1">
                  <span className="text-xs font-bold text-primary">4.8%</span>
                  <div className="w-full bg-primary/20 rounded-t-lg h-[80%] relative overflow-hidden">
                    <div className="absolute bottom-0 w-full bg-primary h-full"></div>
                  </div>
                </div>
                <div className="w-1/4 h-full flex flex-col justify-end items-center gap-1">
                  <span className="text-xs font-medium text-slate-500">3.2%</span>
                  <div className="w-full bg-slate-800 rounded-t-lg h-[55%]"></div>
                </div>
                <div className="w-1/4 h-full flex flex-col justify-end items-center gap-1">
                  <span className="text-xs font-medium text-slate-500">2.9%</span>
                  <div className="w-full bg-slate-800 rounded-t-lg h-[45%]"></div>
                </div>
                <div className="w-1/4 flex flex-col justify-end pb-2">
                  <p className="text-[10px] text-slate-400 leading-tight">Your pick excels in engagement</p>
                </div>
              </div>
            </div>

            {/* Cost Per Click */}
            <div className="mb-6">
              <div className="flex justify-between items-end mb-2 px-1">
                <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">
                  Cost Per Click (CPC)
                </span>
              </div>
              <div className="flex items-end gap-4 h-24">
                <div className="w-1/4 h-full flex flex-col justify-end items-center gap-1">
                  <span className="text-xs font-bold text-primary">₹1.20</span>
                  <div className="w-full bg-primary/20 rounded-t-lg h-[40%] relative overflow-hidden">
                    <div className="absolute bottom-0 w-full bg-primary h-full"></div>
                  </div>
                </div>
                <div className="w-1/4 h-full flex flex-col justify-end items-center gap-1">
                  <span className="text-xs font-medium text-slate-500">₹1.85</span>
                  <div className="w-full bg-slate-800 rounded-t-lg h-[65%]"></div>
                </div>
                <div className="w-1/4 h-full flex flex-col justify-end items-center gap-1">
                  <span className="text-xs font-medium text-slate-500">₹2.10</span>
                  <div className="w-full bg-slate-800 rounded-t-lg h-[85%]"></div>
                </div>
                <div className="w-1/4 flex flex-col justify-end pb-2">
                  <p className="text-[10px] text-slate-400 leading-tight">Lower cost than avg market</p>
                </div>
              </div>
            </div>

            {/* Total Reach */}
            <div>
              <div className="flex justify-between items-end mb-2 px-1">
                <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">Total Reach</span>
              </div>
              <div className="flex items-end gap-4 h-24">
                <div className="w-1/4 h-full flex flex-col justify-end items-center gap-1">
                  <span className="text-xs font-bold text-white">45K</span>
                  <div className="w-full bg-slate-700 rounded-t-lg h-[70%]"></div>
                </div>
                <div className="w-1/4 h-full flex flex-col justify-end items-center gap-1">
                  <span className="text-xs font-bold text-primary">52K</span>
                  <div className="w-full bg-primary/20 rounded-t-lg h-[85%] relative overflow-hidden">
                    <div className="absolute bottom-0 w-full bg-primary h-full shadow-[0_0_10px_rgba(19,164,236,0.5)]"></div>
                  </div>
                </div>
                <div className="w-1/4 h-full flex flex-col justify-end items-center gap-1">
                  <span className="text-xs font-medium text-slate-500">38K</span>
                  <div className="w-full bg-slate-800 rounded-t-lg h-[55%]"></div>
                </div>
                <div className="w-1/4 flex flex-col justify-end pb-2">
                  <p className="text-[10px] text-slate-400 leading-tight">Competitor 1 has slight edge</p>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-800 flex justify-between items-center text-xs text-slate-400">
              <span>C1: Fashionista_Jane</span>
              <span>C2: StyleWithMike</span>
            </div>
          </div>
        </section>

        {/* Engagement Funnel */}
        <section>
          <div className="flex items-center justify-between mb-4 px-2">
            <h3 className="text-xl font-bold text-white">Engagement Funnel</h3>
            <button className="text-primary text-sm font-semibold hover:text-primary/80 transition-colors">
              Details
            </button>
          </div>

          <div className="bg-surface-dark rounded-3xl p-6 border border-slate-800">
            <div className="flex flex-col gap-5">
              <div className="relative">
                <div className="flex justify-between items-end mb-2">
                  <span className="text-slate-300 font-medium">Estimated Reach</span>
                  <span className="text-white font-bold">50.2k</span>
                </div>
                <div className="w-full bg-surface-card rounded-full h-3 overflow-hidden">
                  <div className="bg-gradient-to-r from-primary to-primary/60 h-full rounded-full w-full shadow-[0_0_20px_-5px_rgba(19,164,236,0.3)]"></div>
                </div>
              </div>

              <div className="relative pl-4">
                <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-slate-800"></div>
                <div className="flex justify-between items-end mb-2">
                  <span className="text-slate-300 font-medium">Engagement</span>
                  <span className="text-white font-bold">12.5k</span>
                </div>
                <div className="w-full bg-surface-card rounded-full h-3 overflow-hidden">
                  <div className="bg-gradient-to-r from-primary/90 to-primary/50 h-full rounded-full w-[65%]"></div>
                </div>
                <p className="text-xs text-slate-500 mt-1 text-right">24.9% Conv.</p>
              </div>

              <div className="relative pl-4">
                <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-slate-800"></div>
                <div className="flex justify-between items-end mb-2">
                  <span className="text-slate-300 font-medium">Clicks</span>
                  <span className="text-white font-bold">842</span>
                </div>
                <div className="w-full bg-surface-card rounded-full h-3 overflow-hidden">
                  <div className="bg-gradient-to-r from-primary/80 to-primary/40 h-full rounded-full w-[25%]"></div>
                </div>
                <p className="text-xs text-slate-500 mt-1 text-right">6.7% CTR</p>
              </div>

              <div className="relative pl-4">
                <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-slate-800 h-1/2"></div>
                <div className="flex justify-between items-end mb-2">
                  <span className="text-slate-300 font-medium">Projected Sales</span>
                  <span className="text-white font-bold">128</span>
                </div>
                <div className="w-full bg-surface-card rounded-full h-3 overflow-hidden">
                  <div className="bg-gradient-to-r from-emerald-500 to-emerald-400 h-full rounded-full w-[10%]"></div>
                </div>
                <p className="text-xs text-slate-500 mt-1 text-right">15.2% Conv.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Demographics Match */}
        <section>
          <h3 className="text-xl font-bold text-white mb-4 px-2">Demographics Match</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-surface-dark p-4 rounded-2xl border border-slate-800 flex flex-col items-center justify-center gap-3">
              <div className="relative size-20">
                <svg className="size-full -rotate-90" viewBox="0 0 36 36">
                  <circle
                    className="stroke-current text-surface-card"
                    cx="18"
                    cy="18"
                    fill="none"
                    r="16"
                    strokeWidth="3"
                  ></circle>
                  <circle
                    className="stroke-current text-primary"
                    cx="18"
                    cy="18"
                    fill="none"
                    r="16"
                    strokeDasharray="100"
                    strokeDashoffset="25"
                    strokeLinecap="round"
                    strokeWidth="3"
                  ></circle>
                </svg>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                  <span className="text-sm font-bold text-white">75%</span>
                </div>
              </div>
              <div className="text-center">
                <p className="text-white font-semibold">Age 24-35</p>
                <p className="text-xs text-slate-400">High Match</p>
              </div>
            </div>

            <div className="bg-surface-dark p-4 rounded-2xl border border-slate-800 flex flex-col items-center justify-center gap-3">
              <div className="w-full h-20 rounded-lg overflow-hidden relative">
                <div className="absolute inset-0 bg-primary/20 z-10"></div>
                <div className="absolute inset-0 bg-slate-700"></div>
                <div className="absolute inset-0 flex items-center justify-center z-20">
                  <Icon name="location_on" size={24} className="text-white drop-shadow-md" />
                </div>
              </div>
              <div className="text-center">
                <p className="text-white font-semibold">USA & UK</p>
                <p className="text-xs text-slate-400">Primary Markets</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Smart Suggestion Toast & Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 p-4 bg-gradient-to-t from-background-light dark:from-background-dark via-background-light/95 dark:via-background-dark/95 to-transparent pb-8">
        <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-md border border-primary/30 rounded-2xl p-4 mb-4 shadow-lg shadow-slate-300/40 dark:shadow-black/40 flex items-start gap-3">
          <div className="shrink-0 relative">
            <div className="size-10 rounded-full overflow-hidden border-2 border-primary">
              <img
                className="size-full object-cover"
                alt="Influencer"
                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop"
              />
            </div>
            <div className="absolute -bottom-1 -right-1 bg-primary text-white rounded-full p-0.5 border border-white dark:border-slate-800">
              <Icon name="smart_toy" size={10} />
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm text-slate-700 dark:text-slate-200 leading-snug">
              <span className="text-primary font-bold">AI Insight:</span> Swapping to{' '}
              <span className="font-bold text-slate-900 dark:text-white">Sarah Jenkins</span> could yield{' '}
              <span className="text-emerald-400 font-bold">15% better ROI</span>.
            </p>
          </div>
          <button className="shrink-0 bg-primary/20 hover:bg-primary/30 text-primary text-xs font-bold py-1.5 px-3 rounded-lg transition-colors self-center">
            Review
          </button>
          <button className="shrink-0 text-slate-400 hover:text-slate-900 dark:hover:text-white -mt-1 -mr-1">
            <Icon name="close" size={18} />
          </button>
        </div>

        <button className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2">
          Proceed with Campaign
          <Icon name="arrow_forward" size={20} />
        </button>
      </div>
    </div>
  );
}
