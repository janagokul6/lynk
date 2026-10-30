'use client';

import { Icon } from '@/components/ui/Icon';
import { useState, useEffect } from 'react';

export function AIAnalysisLoading() {
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState('Analyzing audience demographics...');

  const statusMessages = [
    'Analyzing audience demographics...',
    'Calculating engagement rates...',
    'Evaluating content quality...',
    'Predicting campaign ROI...',
    'Finalizing recommendations...',
  ];

  useEffect(() => {
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 2;
      });
    }, 100);

    const statusInterval = setInterval(() => {
      setStatusText((prev) => {
        const currentIndex = statusMessages.indexOf(prev);
        const nextIndex = (currentIndex + 1) % statusMessages.length;
        return statusMessages[nextIndex];
      });
    }, 2000);

    return () => {
      clearInterval(progressInterval);
      clearInterval(statusInterval);
    };
  }, []);

  return (
    <div className="relative flex flex-col min-h-screen bg-background-dark text-slate-100 overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-20%] left-[-20%] w-[600px] h-[600px] rounded-full bg-primary/5 blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] rounded-full bg-primary/10 blur-[100px]"></div>
        <div className="absolute inset-0 bg-grid-pattern opacity-50"></div>
      </div>

      {/* Top Bar */}
      <div className="relative z-10 flex items-center justify-between p-4 pt-6 md:pt-8 bg-transparent">
        <div className="w-12"></div>
        <h2 className="text-lg font-bold leading-tight tracking-tight text-center">ROI Predictor</h2>
        <div className="flex w-12 items-center justify-end">
          <button className="text-slate-400 hover:text-white text-base font-semibold leading-normal tracking-wide transition-colors">
            Cancel
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center w-full max-w-md mx-auto px-6 py-4">
        {/* Radar Section */}
        <div className="relative flex items-center justify-center mb-12 w-72 h-72">
          {/* Outer Rings (Static & Pulsing) */}
          <div className="absolute inset-0 rounded-full border border-primary/10"></div>
          <div className="absolute inset-4 rounded-full border border-primary/20"></div>
          <div className="absolute inset-8 rounded-full border border-dashed border-primary/30 opacity-50"></div>
          <div className="absolute inset-12 rounded-full border border-primary/10 animate-pulse"></div>

          {/* Radar Sweep Animation */}
          <div className="absolute inset-0 w-full h-full animate-spin-slow rounded-full z-0 overflow-hidden">
            <div className="w-full h-full radar-sweep"></div>
          </div>

          {/* Inner Core */}
          <div className="relative z-10 w-32 h-32 rounded-full bg-background-dark border border-primary/50 shadow-[0_0_30px_rgba(19,164,236,0.2)] flex items-center justify-center">
            <Icon name="query_stats" size={40} className="text-primary animate-pulse" />
          </div>

          {/* Floating Data Points */}
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-4 animate-float"
            style={{ animationDelay: '0.2s' }}
          >
            <div className="px-2 py-1 rounded-full bg-background-dark border border-primary/30 text-[10px] text-primary font-medium shadow-lg backdrop-blur-sm">
              Reach
            </div>
          </div>
          <div
            className="absolute bottom-10 right-0 translate-x-4 animate-float"
            style={{ animationDelay: '1.5s' }}
          >
            <div className="px-2 py-1 rounded-full bg-background-dark border border-primary/30 text-[10px] text-primary font-medium shadow-lg backdrop-blur-sm">
              CPM
            </div>
          </div>
          <div
            className="absolute bottom-10 left-0 -translate-x-4 animate-float"
            style={{ animationDelay: '0.8s' }}
          >
            <div className="px-2 py-1 rounded-full bg-background-dark border border-primary/30 text-[10px] text-primary font-medium shadow-lg backdrop-blur-sm">
              CPA
            </div>
          </div>

          {/* Abstract Dots */}
          <div className="absolute top-1/4 right-8 w-1.5 h-1.5 rounded-full bg-primary/70 animate-pulse"></div>
          <div className="absolute bottom-1/3 left-6 w-1 h-1 rounded-full bg-primary/50 animate-pulse"></div>
          <div className="absolute top-10 left-16 w-1 h-1 rounded-full bg-primary/40"></div>
        </div>

        {/* Progress Text */}
        <div className="flex flex-col items-center gap-2 mb-8 w-full">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
            <p className="text-primary text-sm font-medium tracking-wider uppercase">AI Scanning</p>
          </div>
          <h1 className="text-5xl font-bold text-white tracking-tighter mb-1">
            {progress}
            <span className="text-2xl text-slate-400">%</span>
          </h1>

          {/* Dynamic Status Text Box */}
          <div className="h-8 overflow-hidden relative w-full flex justify-center">
            <p className="text-slate-300 text-base font-medium animate-pulse">{statusText}</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full max-w-[280px] h-1.5 bg-slate-800 rounded-full overflow-hidden relative mb-4">
          <div
            className="absolute top-0 left-0 h-full bg-primary shadow-[0_0_10px_rgba(19,164,236,0.8)] rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          ></div>
        </div>

        {/* Additional Processing Details */}
        <div className="flex justify-between w-full max-w-[280px] text-xs text-slate-500 font-mono mt-2">
          <span>THREAD: 04</span>
          <span>LATENCY: 12ms</span>
        </div>
      </div>

      {/* Footer Tip */}
      <div className="relative z-10 w-full p-6 pb-10 bg-gradient-to-t from-background-dark to-transparent">
        <div className="max-w-md mx-auto">
          <div className="flex items-start gap-3 p-4 rounded-xl bg-slate-800/40 border border-slate-700/50 backdrop-blur-md">
            <Icon name="lightbulb" size={20} className="text-primary shrink-0 mt-0.5" />
            <p className="text-slate-300 text-sm font-normal leading-relaxed">
              <span className="text-primary font-semibold">Tip:</span> AI predictions are based on 12-month
              historical performance across similar niche influencers.
            </p>
          </div>
        </div>
      </div>

      <style jsx>{`
        .radar-sweep {
          background: conic-gradient(
            from 0deg,
            transparent 0deg,
            transparent 270deg,
            rgba(19, 164, 236, 0.1) 300deg,
            rgba(19, 164, 236, 0.6) 360deg
          );
          border-radius: 50%;
        }

        .bg-grid-pattern {
          background-size: 40px 40px;
          background-image: linear-gradient(to right, rgba(255, 255, 255, 0.03) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
        }

        @keyframes float {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }

        .animate-spin-slow {
          animation: spin 4s linear infinite;
        }
      `}</style>
    </div>
  );
}
