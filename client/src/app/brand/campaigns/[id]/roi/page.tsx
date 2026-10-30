'use client';

import { Icon } from '@/components/ui/Icon';

export default function MultiInfluencerROI() {
  const influencers = [
    {
      name: 'Alex Tech',
      category: 'Tech Enthusiasts (450k)',
      revenue: '₹42.1k',
      roi: '5.2x',
      progress: 65,
      img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAn8xiHGwPiuK2iCAwwzdFERD1MrQdX3-Z298eg824iJR0mCu-qvDUUUH-Li2xKqv1yCouTNB9x7djecHsB0wFXSOIvZEqO3KQWqJUCESAFi5gZUpG-0Bc1RTDysiHSp5NBvH1f7pHxuez2G9AJMkz83UDtedOGMxtk3aaGTlne55JJkcxFyFa4Uxo74lsih_z00P-Xg_EOf7GPFAFodMSZtILEAmSe-bgW7rDvROtzkrYDmRv26nv7PZuuQItf08Ghj8q7arjMvGc',
    },
    {
      name: 'Sarah Gadgets',
      category: 'Productivity/Apps (310k)',
      revenue: '₹38.5k',
      roi: '4.9x',
      progress: 45,
      img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAy7YX4CvPvCKsp79mbBJ4yOpmp8xoE9F59mfXDELtrsrI5RS_MQ1YDnEdqZeKw6WEs8MW7b4mEWFo7axl8v2HNlASlEwFYwuH9rhLBOPX5LLO3EqtYOFLXrHOgWdFHfN36PWyuV_uETQcinZb9qyHj6fBp8EU64ZBRuyQYI_i3i5ByTmf4GB_b0Nn_lFWLTZEoPvfR1fuL8dwqD0Ce966a2i0Y_V5KOj4Nzvx3BzCHrZt4WCTkpDWSX6stEe6joJT2aiDmlTsxX8o',
    },
    {
      name: 'Creative Mike',
      category: 'Design/Creative (120k)',
      revenue: '₹12.4k',
      roi: '2.1x',
      progress: 15,
      warning: true,
      img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC1VC-eTi9LRj9TTFSUlEIRL82bfyPohjVwbmypf5aBHGAlWXNZ9S7Ggbgtm-D55FSynwAikSB9Frpg0GkNwwQA9-a4xPZtVNlNWa_tToPFTR6zfsJ8Zrz6piRan-w6wl6t6ezZR59du_rNICBzFJNwKWJqfHpd9_FCbm06aklf1CMPBtCbNXvpHILS1e_kqN4QFZbYF0SCmvIZJlReqM9tdiPtuB8l3zroxJTMnssjIo48myjC26FYVreLmZD200Eg2QaPsZvhJoE',
    },
  ];

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 pb-24">
      {/* Top App Bar */}
      <header className="sticky top-0 z-50 bg-background-light/90 dark:bg-background-dark/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center justify-between p-4 max-w-2xl mx-auto w-full">
          <button className="flex items-center justify-center size-10 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-700 dark:text-slate-200">
            <Icon name="arrow_back" />
          </button>
          <div className="flex-1 px-4">
            <h1 className="text-lg font-bold leading-tight tracking-tight text-slate-900 dark:text-white">Summer Tech Launch</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Multi-Influencer Campaign</p>
          </div>
          <button className="flex items-center justify-center size-10 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-700 dark:text-slate-200">
            <Icon name="share" />
          </button>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        {/* Main Aggregate Prediction Panel */}
        <section className="relative overflow-hidden rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 p-6 border border-primary/20 shadow-lg shadow-primary/5">
          <div className="relative z-10">
            <p className="text-sm font-semibold uppercase tracking-wider text-primary/80 mb-1">Total Projected Revenue</p>
            <div className="flex items-baseline gap-2">
              <h2 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">₹142,500</h2>
              <span className="text-emerald-500 text-sm font-bold flex items-center bg-emerald-500/10 px-2 py-0.5 rounded-full">
                <Icon name="trending_up" size={12} className="mr-0.5" /> 14%
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-4 leading-relaxed italic">
              Based on historical conversion rates and audience overlap analysis.
            </p>
          </div>
          <div className="absolute -right-10 -bottom-10 size-40 bg-primary/10 rounded-full blur-3xl"></div>
        </section>

        {/* Metric Grid */}
        <section className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl p-4 flex flex-col gap-1 shadow-sm">
            <Icon name="groups" className="text-primary mb-2" />
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Total Reach</p>
            <p className="text-xl font-bold text-slate-900 dark:text-white">1.2M</p>
            <p className="text-[10px] text-emerald-500 font-bold">+5.2% vs avg</p>
          </div>
          <div className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl p-4 flex flex-col gap-1 shadow-sm">
            <Icon name="auto_graph" className="text-primary mb-2" />
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Average ROI</p>
            <p className="text-xl font-bold text-slate-900 dark:text-white">4.8x</p>
            <p className="text-[10px] text-emerald-500 font-bold">+0.3x gain</p>
          </div>
          <div className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl p-4 flex flex-col gap-1 shadow-sm col-span-2 md:col-span-1">
            <Icon name="currency_rupee" className="text-primary mb-2" />
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Total CPA</p>
            <p className="text-xl font-bold text-slate-900 dark:text-white">₹12.40</p>
            <p className="text-[10px] text-orange-500 font-bold">-0.80% efficiency</p>
          </div>
        </section>

        {/* Confidence Score Gauge Section */}
        <section className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Batch ROI Confidence</h3>
            <Icon name="info" className="text-slate-500 dark:text-slate-400 cursor-help" title="Based on 50+ similar campaign datasets" />
          </div>
          <div className="flex flex-col gap-3">
            <div className="flex justify-between items-end">
              <span className="text-primary font-bold text-3xl">
                88% <span className="text-xs font-medium text-slate-500 uppercase tracking-widest ml-1">High</span>
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400">Targeting Accuracy</span>
            </div>
            <div className="h-3 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full shadow-[0_0_12px_rgba(19,164,236,0.5)]"
                style={{ width: '88%' }}
              ></div>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Our AI predicts a high probability of meeting the ₹140k threshold based on current audience engagement trends.
            </p>
          </div>
        </section>

        {/* Influencer List */}
        <section>
          <div className="flex items-center justify-between mb-4 px-1">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Influencer Breakdown (5)</h3>
            <button className="text-primary text-xs font-bold hover:underline">Edit List</button>
          </div>
          <div className="space-y-3">
            {influencers.map((influencer, idx) => (
              <div
                key={idx}
                className={`bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl p-3 flex items-center gap-4 group ${
                  influencer.warning ? 'border-l-orange-500 border-l-4' : ''
                }`}
              >
                <div className="size-12 rounded-lg overflow-hidden shrink-0 border-2 border-primary/20">
                  <img className="size-full object-cover" src={influencer.img} alt={influencer.name} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold truncate text-slate-900 dark:text-white">{influencer.name}</p>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">{influencer.category}</p>
                  <div className="mt-1 h-1 w-full bg-slate-200 dark:bg-slate-800 rounded-full">
                    <div className="h-full bg-primary/60 rounded-full" style={{ width: `${influencer.progress}%` }}></div>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-bold text-slate-900 dark:text-white">{influencer.revenue}</p>
                  <p className={`text-[10px] font-medium ${influencer.warning ? 'text-orange-500' : 'text-emerald-500'}`}>
                    ROI {influencer.roi}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Smart Recommendations */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 px-1">
            <Icon name="bolt" className="text-primary fill-1" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Smart Recommendations</h3>
          </div>
          <div className="flex flex-col gap-3">
            {/* Suggestion Card 1 */}
            <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 flex gap-4 items-start shadow-sm">
              <div className="bg-primary/20 p-2 rounded-lg">
                <Icon name="swap_horiz" className="text-primary" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900 dark:text-white">Swap Influencers for higher ROI</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-normal">
                  Replace <span className="font-bold">Creative Mike</span> with{' '}
                  <span className="font-bold text-primary">Jessie Reviews</span> to increase total ROI by{' '}
                  <span className="text-emerald-500 font-bold">12%</span> and lower overall CPA by ₹1.50.
                </p>
                <button className="mt-3 text-[10px] font-bold uppercase tracking-wider text-primary border border-primary/30 rounded-full px-3 py-1 hover:bg-primary/10 transition-colors">
                  Apply Optimization
                </button>
              </div>
            </div>

            {/* Suggestion Card 2 */}
            <div className="bg-slate-100 dark:bg-slate-900/30 border border-slate-200 dark:border-slate-800 rounded-xl p-4 flex gap-4 items-start shadow-sm">
              <div className="bg-slate-200 dark:bg-slate-800 p-2 rounded-lg">
                <Icon name="add_circle" className="text-slate-500 dark:text-slate-400" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900 dark:text-white">Add Complementary Creator</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-normal">
                  Adding a niche 'Unboxing' creator like <span className="font-bold">UnboxDaily</span> could capture another
                  150k in reach with minimal audience overlap.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Fixed Bottom CTA */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-background-light/95 dark:bg-background-dark/90 backdrop-blur-xl border-t border-slate-200 dark:border-slate-800 z-50">
        <div className="max-w-2xl mx-auto flex gap-3">
          <button className="flex-1 bg-primary hover:bg-primary/90 text-white font-bold py-3 px-6 rounded-xl transition-all shadow-lg shadow-primary/20 active:scale-[0.98]">
            Finalize Campaign
          </button>
          <button className="size-12 flex items-center justify-center bg-slate-200 dark:bg-slate-800 rounded-xl hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors text-slate-700 dark:text-slate-200">
            <Icon name="download" />
          </button>
        </div>
      </div>
    </div>
  );
}
