import { Icon } from '@/components/ui/Icon';

export interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  onContactSupport?: () => void;
}

export function ErrorState({
  title = 'Signal Lost',
  message = "Our AI seems to have lost the thread. Check your internet connection and let's try reconnecting. Don't worry, your campaigns are safe.",
  onRetry,
  onContactSupport,
}: ErrorStateProps) {
  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-hidden max-w-md mx-auto">
      {/* Header */}
      <header className="flex items-center justify-between p-4 bg-transparent z-10">
        <button className="flex size-10 items-center justify-center rounded-full bg-slate-200/5 dark:bg-slate-800/50 text-slate-900 dark:text-white hover:bg-slate-200/10 dark:hover:bg-slate-800/80 transition-colors">
          <Icon name="arrow_back" size={24} />
        </button>
        <div className="flex-1"></div>
        <button className="flex size-10 items-center justify-center rounded-full bg-slate-200/5 dark:bg-slate-800/50 text-slate-900 dark:text-white hover:bg-slate-200/10 dark:hover:bg-slate-800/80 transition-colors">
          <Icon name="more_vert" size={24} />
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 pb-12 relative z-0">
        {/* Background Glow Effect for Depth */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary/10 rounded-full blur-[80px] pointer-events-none"></div>

        {/* Illustration Container */}
        <div className="relative mb-10 w-full max-w-[280px] aspect-square flex items-center justify-center">
          {/* Abstract visual representing disconnected nodes */}
          <div className="w-full h-full bg-slate-800/30 rounded-full flex items-center justify-center relative overflow-hidden backdrop-blur-sm border border-slate-700/30">
            {/* Using CSS shapes to mimic a disconnected tech illustration */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent"></div>

            <div className="relative z-10 flex flex-col items-center gap-4">
              <Icon name="wifi_off" size={80} className="text-slate-500/50" />
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.5)]"></div>
                <span className="text-xs font-bold text-red-400 uppercase tracking-widest">Offline</span>
              </div>
            </div>

            {/* Decorative tech lines */}
            <svg
              className="absolute inset-0 w-full h-full opacity-20 pointer-events-none"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
            >
              <path d="M0,50 Q25,40 50,50 T100,50" fill="none" stroke="#13a4ec" strokeWidth="0.5" />
              <path d="M0,60 Q25,50 50,60 T100,60" fill="none" stroke="#13a4ec" strokeWidth="0.5" />
              <circle cx="50" cy="50" r="40" fill="none" stroke="#13a4ec" strokeWidth="0.2" strokeDasharray="4 4" />
            </svg>
          </div>
        </div>

        {/* Text Content */}
        <div className="flex flex-col items-center text-center space-y-4 max-w-xs mx-auto">
          <h1 className="text-3xl font-display font-extrabold tracking-tight text-slate-900 dark:text-white">
            {title}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-base leading-relaxed font-medium">{message}</p>
        </div>

        {/* Actions */}
        <div className="flex flex-col w-full max-w-[320px] gap-4 mt-10">
          <button
            onClick={onRetry}
            className="group relative flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-xl h-14 px-8 bg-primary hover:bg-primary/90 active:bg-primary/80 transition-all duration-200 shadow-[0_0_20px_rgba(19,164,236,0.3)] hover:shadow-[0_0_30px_rgba(19,164,236,0.5)]"
          >
            <span className="relative z-10 flex items-center gap-2 text-white font-bold text-lg tracking-wide">
              <Icon name="refresh" size={20} />
              Try Again
            </span>
            {/* Button sheen effect */}
            <div className="absolute inset-0 -translate-x-full group-hover:animate-shimmer bg-gradient-to-r from-transparent via-white/20 to-transparent z-0"></div>
          </button>

          <button
            onClick={onContactSupport}
            className="flex w-full cursor-pointer items-center justify-center rounded-xl h-12 px-4 text-slate-500 dark:text-slate-400 hover:text-primary dark:hover:text-primary transition-colors text-sm font-semibold"
          >
            Contact Support
          </button>
        </div>
      </main>

      {/* Bottom Status Indicator (Simulated Toast/Status Bar) */}
      <div className="w-full px-6 py-4 bg-transparent">
        <div className="w-full flex justify-center pb-2">
          <div className="w-1/3 h-1.5 rounded-full bg-slate-200 dark:bg-slate-700"></div>
        </div>
      </div>

      <style jsx>{`
        @keyframes shimmer {
          100% {
            transform: translateX(100%);
          }
        }

        .animate-shimmer {
          animation: shimmer 1.5s infinite;
        }
      `}</style>
    </div>
  );
}
