'use client';

import { Icon } from '@/components/ui/Icon';
import { AppLayout } from '@/components/layout/AppLayout';

export default function FraudControl() {
  const fraudHeader = (
    <div className="flex flex-col gap-2 p-4 pb-2 sticky top-0 z-20 bg-background-dark/95 backdrop-blur-md border-b border-surface-highlight">
        <div className="flex items-center h-12 justify-between">
          <div className="flex items-center gap-2">
            <Icon name="security" className="text-primary text-[28px]" />
            <h1 className="text-xl font-extrabold tracking-tight">Fraud Control</h1>
          </div>
          <div className="flex w-12 items-center justify-end">
            <button className="flex items-center justify-center rounded-lg h-10 w-10 text-slate-400 hover:text-white transition-colors">
              <Icon name="settings" size={24} />
            </button>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
          <p className="text-primary tracking-wide text-sm font-bold uppercase">System Status: Secure</p>
        </div>
    </div>
  );

  return (
    <AppLayout variant="admin" activeTab="Trust" header={fraudHeader}>
      <div className="min-h-screen bg-background-dark text-slate-100 flex flex-col">
        {/* Main Dashboard Content */}
        <main className="flex-1 flex flex-col gap-6 p-4 pb-24">
        {/* Authenticity Score Widget */}
        <div className="rounded-xl bg-surface-dark border border-surface-highlight p-5 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Icon name="shield" className="text-[120px] text-primary" />
          </div>
          <h2 className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-4">Global Authenticity Index</h2>
          <div className="flex flex-row items-end justify-between">
            <div className="flex flex-col">
              <span className="text-6xl font-black tracking-tighter text-white tabular-nums">
                94<span className="text-2xl text-primary">%</span>
              </span>
              <div className="flex items-center gap-1 mt-2 text-green-400">
                <Icon name="trending_up" size={14} />
                <span className="text-xs font-bold">+2.4% from yesterday</span>
              </div>
            </div>
            {/* Mini Radial Chart */}
            <div className="relative w-24 h-24 flex items-center justify-center">
              <svg className="transform -rotate-90 w-full h-full" viewBox="0 0 36 36">
                <path className="text-surface-highlight" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="4" />
                <path className="text-primary drop-shadow-[0_0_8px_rgba(19,164,236,0.6)]" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeDasharray="94, 100" strokeLinecap="round" strokeWidth="4" />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <Icon name="verified_user" className="text-primary" />
              </div>
            </div>
          </div>
          {/* Trust Score Distribution Bar */}
          <div className="mt-6 space-y-2">
            <div className="flex justify-between text-xs text-slate-400 font-medium">
              <span>Trust Score Distribution</span>
              <span>Avg: 88/100</span>
            </div>
            <div className="flex h-2 w-full overflow-hidden rounded-full bg-surface-highlight">
              <div className="bg-primary shadow-[0_0_10px_rgba(19,164,236,0.5)]" style={{ width: '75%' }}></div>
              <div className="bg-yellow-500" style={{ width: '15%' }}></div>
              <div className="bg-red-500" style={{ width: '10%' }}></div>
            </div>
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>Safe (75%)</span>
              <span className="text-right">Risk (25%)</span>
            </div>
          </div>
        </div>

        {/* Risk Parameter Controls */}
        <div className="flex flex-col gap-4">
          <h3 className="text-white text-lg font-bold px-1">Risk Thresholds</h3>
          <div className="rounded-xl bg-surface-dark border border-surface-highlight p-4 space-y-5">
            {/* Slider 1 */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium text-slate-200 flex items-center gap-2">
                  <Icon name="smart_toy" className="text-primary text-sm" />
                  Bot Detection Sensitivity
                </label>
                <span className="text-xs font-mono text-primary bg-primary/10 px-2 py-0.5 rounded">HIGH</span>
              </div>
              <input className="w-full h-1 bg-surface-highlight rounded-lg appearance-none cursor-pointer slider-thumb slider-track" max="100" min="0" type="range" defaultValue="85" />
            </div>
            {/* Slider 2 */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium text-slate-200 flex items-center gap-2">
                  <Icon name="groups" className="text-primary text-sm" />
                  Follower Spikes Tolerance
                </label>
                <span className="text-xs font-mono text-yellow-500 bg-yellow-500/10 px-2 py-0.5 rounded">MED</span>
              </div>
              <input className="w-full h-1 bg-surface-highlight rounded-lg appearance-none cursor-pointer slider-thumb slider-track" max="100" min="0" type="range" defaultValue="45" />
            </div>
            {/* Slider 3 */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium text-slate-200 flex items-center gap-2">
                  <Icon name="forum" className="text-primary text-sm" />
                  Comment Quality Filter
                </label>
                <span className="text-xs font-mono text-primary bg-primary/10 px-2 py-0.5 rounded">STRICT</span>
              </div>
              <input className="w-full h-1 bg-surface-highlight rounded-lg appearance-none cursor-pointer slider-thumb slider-track" max="100" min="0" type="range" defaultValue="92" />
            </div>
          </div>
        </div>

        {/* Live Chart Area */}
        <div className="rounded-xl bg-surface-dark border border-surface-highlight p-4">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-white text-base font-bold">Live Anomaly Detection</p>
              <p className="text-slate-400 text-xs">Real-time engagement velocity</p>
            </div>
            <div className="flex items-center gap-1.5 px-2 py-1 bg-red-500/10 border border-red-500/20 rounded text-red-400">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider">Scanning</span>
            </div>
          </div>
          <div className="relative h-32 w-full">
            {/* Grid Background */}
            <div className="absolute inset-0 grid grid-cols-6 grid-rows-4 gap-0 opacity-10 pointer-events-none">
              {[...Array(24)].map((_, i) => (
                <div key={i} className="border-r border-b border-primary last:border-r-0"></div>
              ))}
            </div>
            <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 50">
              <defs>
                <linearGradient id="gradient" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#13a4ec" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#13a4ec" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path d="M0 40 Q 10 35, 20 38 T 40 30 T 60 20 T 80 35 T 100 25 V 50 H 0 Z" fill="url(#gradient)" />
              <path d="M0 40 Q 10 35, 20 38 T 40 30 T 60 20 T 80 35 T 100 25" fill="none" stroke="#13a4ec" strokeWidth="0.5" />
              <circle className="animate-pulse" cx="60" cy="20" fill="#ef4444" r="1.5" />
            </svg>
          </div>
          <div className="flex justify-between mt-2 pt-2 border-t border-surface-highlight">
            <p className="text-slate-500 text-[10px] font-mono">10:00</p>
            <p className="text-slate-500 text-[10px] font-mono">10:15</p>
            <p className="text-slate-500 text-[10px] font-mono">10:30</p>
            <p className="text-slate-500 text-[10px] font-mono">10:45</p>
          </div>
        </div>

        {/* Verification Table */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-white text-lg font-bold">
              Pending Verification <span className="text-slate-500 text-sm font-normal">(12)</span>
            </h3>
            <button className="text-primary text-xs font-bold uppercase tracking-wider hover:text-white transition-colors">View All</button>
          </div>
          <div className="bg-surface-dark border border-surface-highlight rounded-xl overflow-hidden">
            {/* Table Header */}
            <div className="grid grid-cols-[1.5fr_1fr_1fr] bg-surface-highlight/50 p-3 border-b border-surface-highlight">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">User</div>
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider text-center">Risk Score</div>
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Action</div>
            </div>
            {/* Row 1 */}
            <div className="grid grid-cols-[1.5fr_1fr_1fr] p-3 border-b border-surface-highlight items-center hover:bg-white/5 transition-colors cursor-pointer group">
              <div className="flex flex-col">
                <span className="text-sm font-bold text-white group-hover:text-primary transition-colors">@SarahStyle</span>
                <div className="flex items-center gap-1 mt-1">
                  <Icon name="warning" className="text-[10px] text-red-500" />
                  <span className="text-[10px] text-red-400 font-medium">Engagement Anomaly</span>
                </div>
              </div>
              <div className="flex justify-center">
                <span className="px-2 py-1 rounded bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-mono font-bold">45/100</span>
              </div>
              <div className="flex justify-end gap-2">
                <button className="h-8 w-8 rounded-full bg-surface-highlight flex items-center justify-center hover:bg-green-500/20 hover:text-green-500 text-slate-400 transition-colors">
                  <Icon name="check" size={18} />
                </button>
                <button className="h-8 w-8 rounded-full bg-surface-highlight flex items-center justify-center hover:bg-red-500/20 hover:text-red-500 text-slate-400 transition-colors">
                  <Icon name="close" size={18} />
                </button>
              </div>
            </div>
            {/* Row 2 */}
            <div className="grid grid-cols-[1.5fr_1fr_1fr] p-3 border-b border-surface-highlight items-center hover:bg-white/5 transition-colors cursor-pointer group">
              <div className="flex flex-col">
                <span className="text-sm font-bold text-white group-hover:text-primary transition-colors">@TechGuru99</span>
                <div className="flex items-center gap-1 mt-1">
                  <Icon name="schedule" className="text-[10px] text-yellow-500" />
                  <span className="text-[10px] text-yellow-500 font-medium">New Account</span>
                </div>
              </div>
              <div className="flex justify-center">
                <span className="px-2 py-1 rounded bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 text-xs font-mono font-bold">68/100</span>
              </div>
              <div className="flex justify-end gap-2">
                <button className="h-8 w-8 rounded-full bg-surface-highlight flex items-center justify-center hover:bg-green-500/20 hover:text-green-500 text-slate-400 transition-colors">
                  <Icon name="check" size={18} />
                </button>
                <button className="h-8 w-8 rounded-full bg-surface-highlight flex items-center justify-center hover:bg-red-500/20 hover:text-red-500 text-slate-400 transition-colors">
                  <Icon name="close" size={18} />
                </button>
              </div>
            </div>
            {/* Row 3 */}
            <div className="grid grid-cols-[1.5fr_1fr_1fr] p-3 items-center hover:bg-white/5 transition-colors cursor-pointer group">
              <div className="flex flex-col">
                <span className="text-sm font-bold text-white group-hover:text-primary transition-colors">@FitnessJane</span>
              </div>
              <div className="flex justify-center">
                <span className="px-2 py-1 rounded bg-green-500/10 border border-green-500/20 text-green-500 text-xs font-mono font-bold">92/100</span>
              </div>
              <div className="flex justify-end gap-2">
                <button className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-white shadow-[0_0_10px_rgba(19,164,236,0.4)] hover:scale-105 transition-transform">
                  <Icon name="check" size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
        </main>
      </div>
    </AppLayout>
  );
}
