'use client';

import { Icon } from '@/components/ui/Icon';
import { useEffect, useState } from 'react';

export interface SplashScreenProps {
  onComplete?: () => void;
  duration?: number;
}

export function SplashScreen({ onComplete, duration = 3000 }: SplashScreenProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          if (onComplete) {
            setTimeout(onComplete, 200);
          }
          return 100;
        }
        return prev + (100 / (duration / 50));
      });
    }, 50);

    return () => clearInterval(interval);
  }, [duration, onComplete]);

  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-between p-6 bg-background-light dark:bg-background-dark">
      {/* Spacer for vertical centering logic */}
      <div className="flex-1"></div>

      {/* Central Logo Section */}
      <div className="flex flex-col items-center justify-center gap-6">
        {/* Logo Icon with Gradient */}
        <div className="relative flex items-center justify-center w-24 h-24 rounded-2xl bg-gradient-to-br from-primary to-primary/60 shadow-lg shadow-primary/20 animate-pulse">
          <Icon name="auto_awesome" size={48} className="text-white" />
        </div>

        {/* Brand Name */}
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Influenza.AI</h1>
      </div>

      {/* Spacer for vertical centering logic */}
      <div className="flex-1"></div>

      {/* Bottom Section: Progress & Tagline */}
      <div className="flex w-full flex-col items-center gap-4 pb-12 max-w-[240px]">
        {/* Progress Bar */}
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
          <div
            className="h-full rounded-full bg-primary transition-all duration-200 ease-out"
            style={{ width: `${progress}%` }}
          ></div>
        </div>

        {/* Tagline */}
        <div className="flex items-center gap-2 opacity-80">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
            Powered by AI
          </p>
        </div>
      </div>
    </div>
  );
}
