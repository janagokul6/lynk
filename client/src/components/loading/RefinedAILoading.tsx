'use client';

import { Icon } from '@/components/ui/Icon';
import { useState, useEffect } from 'react';

export function RefinedAILoading() {
  const [progress, setProgress] = useState(0);
  const [currentMessage, setCurrentMessage] = useState(0);

  const messages = [
    'Scanning Engagement Patterns...',
    'Calculating Conversion Probability...',
    'Auditing Audience Authenticity...',
  ];

  useEffect(() => {
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 1;
      });
    }, 80);

    const messageInterval = setInterval(() => {
      setCurrentMessage((prev) => (prev + 1) % messages.length);
    }, 3000);

    return () => {
      clearInterval(progressInterval);
      clearInterval(messageInterval);
    };
  }, []);

  // Calculate stroke dashoffset for circular progress (circumference = 2 * PI * r = 691)
  const circumference = 691;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative flex flex-col min-h-screen bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 overflow-hidden">
      {/* Scanning Grid Background */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden scanning-grid opacity-30">
        <div className="scanning-line w-full absolute"></div>
      </div>

      {/* Background Glow Elements */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full bg-primary/10 blur-[100px] animate-pulse-glow"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-primary/5 blur-[120px]"></div>
      </div>

      {/* Main Content Container */}
      <div className="relative z-10 flex flex-col h-full min-h-screen max-w-md mx-auto w-full">
        {/* Top App Bar */}
        <div className="flex items-center p-4 pb-2 justify-between">
          <button className="text-slate-900 dark:text-white flex size-12 shrink-0 items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
            <Icon name="arrow_back" size={24} />
          </button>
          <h2 className="text-slate-900 dark:text-white text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center pr-12">
            ROI Calculator
          </h2>
        </div>

        {/* Central Progress Section */}
        <div className="flex-1 flex flex-col items-center justify-center -mt-10">
          <div className="relative flex items-center justify-center size-64 sm:size-72">
            {/* Glowing Background Behind Ring */}
            <div className="absolute inset-0 rounded-full bg-primary/20 blur-3xl scale-75 animate-pulse"></div>

            {/* SVG Progress Ring */}
            <svg className="size-full transform -rotate-90" viewBox="0 0 256 256">
              {/* Track */}
              <circle
                className="stroke-slate-300 dark:stroke-slate-800"
                cx="128"
                cy="128"
                fill="none"
                r="110"
                strokeWidth="12"
              ></circle>
              {/* Progress Indicator - Blur Layer */}
              <circle
                className="stroke-primary/30 blur-sm"
                cx="128"
                cy="128"
                fill="none"
                r="110"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                strokeWidth="16"
              ></circle>
              {/* Progress Indicator - Main Layer */}
              <circle
                className="stroke-primary drop-shadow-[0_0_10px_rgba(19,164,236,0.6)]"
                cx="128"
                cy="128"
                fill="none"
                r="110"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                strokeWidth="12"
                style={{ transition: 'stroke-dashoffset 0.35s' }}
              ></circle>
            </svg>

            {/* Center Content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <Icon name="smart_toy" size={40} className="text-primary mb-2 animate-bounce" />
              <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-b from-slate-900 dark:from-white to-slate-500 dark:to-slate-400 drop-shadow-[0_0_15px_rgba(19,164,236,0.5)]">
                {progress}%
              </h1>
            </div>
          </div>

          <div className="mt-8 text-center px-6">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 flex justify-center">
              <div className="relative h-7 flex items-center justify-center overflow-hidden">
                {messages.map((message, index) => (
                  <span
                    key={index}
                    className={`absolute transition-all duration-500 ${
                      currentMessage === index
                        ? 'opacity-100 translate-y-0'
                        : index < currentMessage
                        ? 'opacity-0 -translate-y-10'
                        : 'opacity-0 translate-y-10'
                    }`}
                  >
                    {message}
                  </span>
                ))}
              </div>
            </h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm">
              Please wait while our AI generates your campaign insights.
            </p>
          </div>

          {/* Secondary processing indicators */}
          <div className="flex gap-2 mt-6">
            <div className="h-1.5 w-1.5 rounded-full bg-primary animate-bounce"></div>
            <div
              className="h-1.5 w-1.5 rounded-full bg-primary animate-bounce"
              style={{ animationDelay: '0.1s' }}
            ></div>
            <div
              className="h-1.5 w-1.5 rounded-full bg-primary animate-bounce"
              style={{ animationDelay: '0.2s' }}
            ></div>
          </div>
        </div>

        {/* Bottom Tips Carousel */}
        <div className="p-4 mb-4">
          <div className="glass-card rounded-xl p-4 flex gap-4 items-start border-l-4 border-l-primary shadow-lg">
            <div className="shrink-0 rounded-lg overflow-hidden size-16 bg-slate-200 dark:bg-slate-800 relative">
              <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                <Icon name="analytics" size={32} className="text-primary" />
              </div>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <Icon name="lightbulb" size={14} className="text-primary" />
                <p className="text-primary text-xs font-bold uppercase tracking-wider">Did you know?</p>
              </div>
              <p className="text-slate-600 dark:text-slate-300 text-sm leading-snug">
                Our AI analyzes over 50k+ data points to ensure the most accurate ROI prediction for your
                campaign.
              </p>
            </div>
          </div>
        </div>

        {/* Safe Area Spacer */}
        <div className="h-5"></div>
      </div>

      <style jsx>{`
        .scanning-grid {
          background-image: linear-gradient(rgba(19, 164, 236, 0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(19, 164, 236, 0.05) 1px, transparent 1px);
          background-size: 30px 30px;
        }

        .scanning-line {
          height: 100px;
          background: linear-gradient(to bottom, transparent, rgba(19, 164, 236, 0.1), transparent);
          animation: scan 3s linear infinite;
        }

        @keyframes scan {
          0% {
            transform: translateY(-100%);
          }
          100% {
            transform: translateY(100%);
          }
        }

        .glass-card {
          background: rgba(255, 255, 255, 0.6);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(0, 0, 0, 0.05);
        }

        @media (prefers-color-scheme: dark) {
          .glass-card {
            background: rgba(30, 41, 59, 0.4);
            border: 1px solid rgba(255, 255, 255, 0.05);
          }
        }

        @keyframes pulse-glow {
          0%,
          100% {
            opacity: 1;
            filter: brightness(1.2);
          }
          50% {
            opacity: 0.8;
            filter: brightness(1);
          }
        }

        .animate-pulse-glow {
          animation: pulse-glow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>
    </div>
  );
}
