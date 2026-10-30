'use client';

import { Icon } from '@/components/ui/Icon';
import { useState } from 'react';

export default function CampaignAnalyticsPage() {
  const [selectedMetric, setSelectedMetric] = useState('Reach');

  const topPerformers = [
    {
      id: 1,
      name: 'Sarah Jenkings',
      handle: '@sarah.style',
      engagement: '4.5%',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
    },
    {
      id: 2,
      name: 'Mike Ross',
      handle: '@mikeross_fit',
      engagement: '3.8%',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
    },
  ];

  return (
    <div className="relative flex h-full min-h-screen w-full flex-col bg-background-light overflow-x-hidden max-w-md mx-auto shadow-2xl">
      {/* Header */}
      <div className="sticky top-0 z-50 flex items-center bg-white/90 backdrop-blur-md p-4 pb-2 justify-between border-b border-slate-100">
        <button className="text-slate-900 flex size-12 shrink-0 items-center justify-center rounded-full hover:bg-slate-50 transition-colors">
          <Icon name="arrow_back_ios_new" size={24} />
        </button>
        <h2 className="text-slate-900 text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center pr-12">
          Summer Glow Launch
        </h2>
      </div>

      <div className="flex-1 overflow-y-auto pb-24">
        {/* ROI Cards */}
        <div className="flex flex-row gap-4 p-4">
          {/* Actual ROI */}
          <div className="flex flex-1 flex-col gap-1 rounded-2xl p-5 bg-white shadow-sm border border-slate-100 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-3 opacity-10">
              <Icon name="trending_up" size={40} className="text-primary" />
            </div>
            <p className="text-slate-500 text-sm font-medium leading-normal z-10">Actual ROI</p>
            <div className="flex items-baseline gap-2 z-10">
              <p className="text-slate-900 tracking-tight text-3xl font-extrabold leading-tight">450%</p>
            </div>
            <div className="inline-flex items-center gap-1 mt-2 self-start rounded-full bg-green-50 px-2 py-0.5 text-green-700 text-xs font-bold">
              <Icon name="arrow_upward" size={14} />
              130% vs target
            </div>
          </div>

          {/* Predicted ROI */}
          <div className="flex flex-1 flex-col gap-1 rounded-2xl p-5 bg-slate-50 border border-slate-100 relative">
            <div className="absolute top-0 right-0 p-3 opacity-10">
              <Icon name="query_stats" size={40} className="text-slate-500" />
            </div>
            <p className="text-slate-500 text-sm font-medium leading-normal">Predicted ROI</p>
            <p className="text-slate-700 tracking-tight text-3xl font-bold leading-tight opacity-60">320%</p>
            <p className="text-slate-400 text-xs mt-2 font-medium">AI Estimate</p>
          </div>
        </div>

        {/* AI Insight Card */}
        <div className="px-4 mb-2">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary to-[#0f8bc5] p-5 shadow-lg shadow-primary/20">
            {/* Decorative background pattern */}
            <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white opacity-10 rounded-full blur-xl"></div>
            <div className="absolute bottom-0 left-0 -mb-4 -ml-4 w-20 h-20 bg-white opacity-10 rounded-full blur-xl"></div>

            <div className="relative z-10 flex items-start gap-3">
              <div className="rounded-full bg-white/20 p-2 backdrop-blur-sm shrink-0">
                <Icon name="auto_awesome" size={20} className="text-white" />
              </div>
              <div className="flex flex-col gap-1">
                <p className="text-white text-sm font-bold uppercase tracking-wider opacity-80">AI Insight</p>
                <p className="text-white text-base font-medium leading-relaxed">
                  Performance exceeded predictions by{' '}
                  <span className="font-bold underline decoration-white/30 decoration-2 underline-offset-2">12%</span>.
                  Authentic storytelling drove higher engagement.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Metrics Toggle */}
        <div className="flex px-4 py-4 sticky top-[60px] bg-background-light z-40 backdrop-blur-sm">
          <div className="flex h-12 flex-1 items-center justify-center rounded-xl bg-white p-1 shadow-sm border border-slate-200">
            {['Reach', 'Engagement', 'Conversions'].map((metric) => (
              <label key={metric} className="group relative flex cursor-pointer h-full grow items-center justify-center overflow-hidden rounded-lg px-2 text-slate-500 transition-all hover:text-primary">
                <input
                  type="radio"
                  name="chart-view"
                  value={metric}
                  checked={selectedMetric === metric}
                  onChange={(e) => setSelectedMetric(e.target.value)}
                  className="peer invisible w-0 absolute"
                />
                <span className="relative z-10 text-sm font-bold truncate transition-colors peer-checked:text-primary">
                  {metric}
                </span>
                <div className="absolute inset-0 bg-primary/10 opacity-0 transition-opacity peer-checked:opacity-100 rounded-lg"></div>
              </label>
            ))}
          </div>
        </div>

        {/* Chart Section */}
        <div className="flex flex-col gap-4 px-4">
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
            <div className="flex justify-between items-end mb-6">
              <div className="flex flex-col gap-1">
                <p className="text-slate-500 text-sm font-medium">Total Reach</p>
                <p className="text-slate-900 text-4xl font-bold tracking-tight">1.2M</p>
              </div>
              <div className="flex items-center gap-1 bg-green-50 px-2 py-1 rounded-lg">
                <Icon name="trending_up" size={14} className="text-green-600" />
                <p className="text-green-700 text-sm font-bold">+15%</p>
              </div>
            </div>

            <div className="relative w-full h-[200px]">
              {/* Chart SVG */}
              <svg className="w-full h-full overflow-visible" viewBox="0 0 350 150" preserveAspectRatio="none">
                {/* Grid lines */}
                <line x1="0" y1="150" x2="350" y2="150" stroke="#f1f5f9" strokeWidth="1" />
                <line x1="0" y1="100" x2="350" y2="100" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="4 4" />
                <line x1="0" y1="50" x2="350" y2="50" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="4 4" />
                <line x1="0" y1="0" x2="350" y2="0" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="4 4" />

                {/* Gradient Fill */}
                <defs>
                  <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#13a4ec" stopOpacity="0.2" />
                    <stop offset="100%" stopColor="#13a4ec" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path
                  d="M0 120 C 50 120, 50 80, 100 60 C 150 40, 150 90, 200 70 C 250 50, 250 20, 300 30 C 330 36, 350 10, 350 10 V 150 H 0 Z"
                  fill="url(#chartGradient)"
                />

                {/* Line Path */}
                <path
                  d="M0 120 C 50 120, 50 80, 100 60 C 150 40, 150 90, 200 70 C 250 50, 250 20, 300 30 C 330 36, 350 10, 350 10"
                  fill="none"
                  stroke="#13a4ec"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {/* Active Data Point */}
                <circle cx="200" cy="70" r="6" fill="#13a4ec" stroke="white" strokeWidth="3" />

                {/* Tooltip */}
                <g transform="translate(180, 30)">
                  <rect x="0" y="0" width="40" height="24" rx="4" fill="#1e293b" />
                  <text x="20" y="16" fill="white" fontSize="10" fontWeight="bold" textAnchor="middle">
                    45k
                  </text>
                  <path d="M15 24 L20 29 L25 24 Z" fill="#1e293b" />
                </g>
              </svg>
            </div>

            <div className="flex justify-between mt-4 px-1">
              <p className="text-slate-400 text-xs font-medium">Day 1</p>
              <p className="text-slate-400 text-xs font-medium">Day 7</p>
              <p className="text-primary text-xs font-medium">Day 14</p>
              <p className="text-slate-400 text-xs font-medium">Day 21</p>
              <p className="text-slate-400 text-xs font-medium">Day 30</p>
            </div>
          </div>
        </div>

        {/* Top Influencers Preview */}
        <div className="px-4 py-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-slate-900 font-bold text-lg">Top Performers</h3>
            <a href="#" className="text-primary text-sm font-semibold">
              View All
            </a>
          </div>

          <div className="space-y-3">
            {topPerformers.map((influencer) => (
              <div
                key={influencer.id}
                className="flex items-center gap-3 bg-white p-3 rounded-xl border border-slate-100 shadow-sm"
              >
                <div
                  className="h-10 w-10 rounded-full bg-slate-200 bg-cover bg-center shrink-0"
                  style={{ backgroundImage: `url(${influencer.avatar})` }}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-slate-900 font-bold text-sm truncate">{influencer.name}</p>
                  <p className="text-slate-500 text-xs">{influencer.handle}</p>
                </div>
                <div className="text-right">
                  <p className="text-slate-900 font-bold text-sm">{influencer.engagement}</p>
                  <p className="text-slate-400 text-xs">Engagement</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Sticky Bottom Actions */}
      <div className="fixed bottom-0 w-full max-w-md bg-white border-t border-slate-100 p-4 pb-8 z-50 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
        <div className="flex gap-3">
          <button className="flex-1 flex items-center justify-center gap-2 rounded-xl border-2 border-slate-200 bg-white px-4 py-3 text-slate-700 font-bold hover:bg-slate-50 transition-colors">
            <Icon name="download" size={20} />
            <span>Download</span>
          </button>
          <button className="flex-[2] flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-white font-bold shadow-lg shadow-primary/30 hover:bg-[#1192d3] transition-colors">
            <Icon name="ios_share" size={20} />
            <span>Share with Team</span>
          </button>
        </div>
      </div>
    </div>
  );
}
