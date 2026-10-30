'use client';

import { Icon } from '@/components/ui/Icon';
import { useState } from 'react';

export default function BrandOnboardingPage() {
  const [aovValue, setAovValue] = useState(120);
  const [selectedGoal, setSelectedGoal] = useState('conversions');
  const [selectedIndustry, setSelectedIndustry] = useState('');

  return (
    <div className="mx-auto flex h-full min-h-screen w-full max-w-md flex-col overflow-hidden bg-background-light dark:bg-background-dark shadow-2xl relative">
      {/* Header / Progress Area */}
      <div className="w-full px-6 pt-8 pb-4">
        {/* Back Button */}
        <button className="mb-4 flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-primary transition-colors">
          <Icon name="arrow_back" size={20} />
          <span className="text-sm font-medium">Back</span>
        </button>

        {/* Progress Dots */}
        <div className="flex w-full flex-row items-center justify-start gap-3 py-2 mb-2">
          <div className="h-1.5 w-8 rounded-full bg-primary shadow-[0_0_10px_rgba(19,164,236,0.5)]"></div>
          <div className="h-1.5 w-8 rounded-full bg-slate-300 dark:bg-slate-700"></div>
          <div className="h-1.5 w-8 rounded-full bg-slate-300 dark:bg-slate-700"></div>
          <div className="h-1.5 w-8 rounded-full bg-slate-300 dark:bg-slate-700"></div>
        </div>

        <p className="text-primary text-xs font-bold uppercase tracking-wider mb-1">Step 1 of 4</p>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white leading-tight">Company Profile</h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-2">
          Let&apos;s set up your brand DNA so our AI can find your perfect match.
        </p>
      </div>

      {/* Scrollable Form Content */}
      <div className="flex-1 overflow-y-auto px-6 pb-24 hide-scrollbar">
        {/* AI Insight Badge */}
        <div className="mt-4 mb-8 flex items-start gap-3 rounded-xl bg-primary/10 border border-primary/20 p-4">
          <Icon name="auto_awesome" className="text-primary shrink-0" size={20} />
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">AI Matching Insight</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
              We use industry benchmarks and your AOV to predict influencer ROI before you even start a campaign.
            </p>
          </div>
        </div>

        <form className="flex flex-col gap-8">
          {/* Section 1: Industry */}
          <div className="flex flex-col gap-3">
            <label className="text-base font-bold text-slate-900 dark:text-white">Industry</label>
            <div className="relative">
              <select
                value={selectedIndustry}
                onChange={(e) => setSelectedIndustry(e.target.value)}
                className="w-full appearance-none rounded-xl bg-white dark:bg-surface-dark border border-slate-200 dark:border-slate-700 px-4 py-4 pr-10 text-base font-medium text-slate-900 dark:text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
              >
                <option value="">Select your industry</option>
                <option value="fashion">Fashion & Apparel</option>
                <option value="beauty">Beauty & Cosmetics</option>
                <option value="tech">Consumer Tech</option>
                <option value="home">Home & Living</option>
                <option value="fitness">Health & Fitness</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-500">
                <Icon name="expand_more" size={24} />
              </div>
            </div>

            {/* Quick Tags */}
            <div className="flex flex-wrap gap-2 mt-1">
              <button
                type="button"
                className="rounded-full bg-white dark:bg-surface-dark border border-slate-200 dark:border-slate-700 px-3 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-300 hover:border-primary hover:text-primary transition-colors"
              >
                DTC Brand
              </button>
              <button
                type="button"
                className="rounded-full bg-primary/20 border border-primary text-primary px-3 py-1.5 text-xs font-medium transition-colors"
              >
                E-commerce
              </button>
              <button
                type="button"
                className="rounded-full bg-white dark:bg-surface-dark border border-slate-200 dark:border-slate-700 px-3 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-300 hover:border-primary hover:text-primary transition-colors"
              >
                SaaS
              </button>
            </div>
          </div>

          {/* Section 2: AOV */}
          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-end">
              <label className="text-base font-bold text-slate-900 dark:text-white">
                Average Order Value (AOV)
              </label>
              <span className="text-xl font-bold text-primary">${aovValue}</span>
            </div>
            <div className="relative w-full h-12 flex items-center">
              <input
                type="range"
                min="0"
                max="500"
                value={aovValue}
                onChange={(e) => setAovValue(Number(e.target.value))}
                className="w-full bg-transparent appearance-none focus:outline-none z-10 slider-thumb slider-track"
              />
            </div>
            <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 px-1 font-medium">
              <span>₹0</span>
              <span>₹250</span>
              <span>₹500+</span>
            </div>
          </div>

          {/* Section 3: Campaign Goals */}
          <div className="flex flex-col gap-4">
            <label className="text-base font-bold text-slate-900 dark:text-white">Primary Campaign Goal</label>
            <div className="grid grid-cols-2 gap-4">
              {/* Option 1: Awareness */}
              <label className="cursor-pointer group relative">
                <input
                  type="radio"
                  name="goal"
                  value="awareness"
                  checked={selectedGoal === 'awareness'}
                  onChange={(e) => setSelectedGoal(e.target.value)}
                  className="peer sr-only"
                />
                <div className="h-full rounded-xl bg-white dark:bg-surface-dark border border-slate-200 dark:border-slate-700 p-4 flex flex-col items-center justify-center text-center gap-3 transition-all peer-checked:border-primary peer-checked:bg-primary/5 peer-checked:shadow-[0_0_15px_rgba(19,164,236,0.15)] hover:border-primary/50">
                  <div className="h-12 w-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400 group-hover:text-primary peer-checked:bg-primary peer-checked:text-white transition-colors">
                    <Icon name="campaign" size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white">Awareness</h4>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">Reach new audiences</p>
                  </div>
                </div>
                {selectedGoal === 'awareness' && (
                  <div className="absolute top-2 right-2 text-primary">
                    <Icon name="check_circle" size={18} filled />
                  </div>
                )}
              </label>

              {/* Option 2: Conversions */}
              <label className="cursor-pointer group relative">
                <input
                  type="radio"
                  name="goal"
                  value="conversions"
                  checked={selectedGoal === 'conversions'}
                  onChange={(e) => setSelectedGoal(e.target.value)}
                  className="peer sr-only"
                />
                <div className="h-full rounded-xl bg-white dark:bg-surface-dark border border-slate-200 dark:border-slate-700 p-4 flex flex-col items-center justify-center text-center gap-3 transition-all peer-checked:border-primary peer-checked:bg-primary/5 peer-checked:shadow-[0_0_15px_rgba(19,164,236,0.15)] hover:border-primary/50">
                  <div className="h-12 w-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400 group-hover:text-primary peer-checked:bg-primary peer-checked:text-white transition-colors">
                    <Icon name="shopping_cart" size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white">Conversions</h4>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">Drive immediate sales</p>
                  </div>
                </div>
                {selectedGoal === 'conversions' && (
                  <div className="absolute top-2 right-2 text-primary">
                    <Icon name="check_circle" size={18} filled />
                  </div>
                )}
              </label>
            </div>
          </div>
        </form>
      </div>

      {/* Sticky Footer Action */}
      <div className="absolute bottom-0 left-0 w-full bg-background-light/90 dark:bg-background-dark/90 backdrop-blur-md p-6 border-t border-slate-200 dark:border-slate-800 z-50">
        <button className="w-full rounded-xl bg-primary py-4 text-base font-bold text-white shadow-lg shadow-primary/25 active:scale-[0.98] transition-all hover:bg-primary/90 flex items-center justify-center gap-2">
          Save & Continue
          <Icon name="arrow_forward" size={18} />
        </button>
      </div>
    </div>
  );
}
