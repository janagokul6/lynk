import { Icon } from '@/components/ui/Icon';

export function ROIAnalysisTransition() {
  const progress = 85;
  const circumference = 289;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  const metrics = [
    {
      icon: 'groups',
      title: 'Audience Fit',
      subtitle: 'Deep analysis complete',
      status: 'complete',
    },
    {
      icon: 'thumb_up',
      title: 'Engagement Quality',
      subtitle: 'Filtering bot activity...',
      status: 'loading',
    },
    {
      icon: 'trending_up',
      title: 'Conversion Benchmarks',
      subtitle: 'Waiting for queue...',
      status: 'pending',
    },
  ];

  return (
    <div className="bg-background-light dark:bg-background-dark font-display min-h-screen flex flex-col overflow-hidden text-slate-900 dark:text-slate-100">
      {/* Top Navigation */}
      <header className="flex items-center justify-between p-4 pt-6 bg-transparent z-10">
        <button className="flex items-center justify-center w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-slate-100 hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors">
          <Icon name="arrow_back" size={20} />
        </button>
        <h2 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">ROI Analysis</h2>
        <div className="w-10"></div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col items-center justify-center relative w-full max-w-md mx-auto px-6 py-4">
        {/* Background Decor: Grid hint */}
        <div
          className="absolute inset-0 z-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(#13a4ec 1px, transparent 1px)',
            backgroundSize: '32px 32px',
          }}
        ></div>

        {/* Central Visualization */}
        <div className="relative z-10 flex flex-col items-center justify-center mb-10 w-full">
          {/* Progress Ring Container */}
          <div className="relative w-64 h-64 flex items-center justify-center">
            {/* SVG Progress Ring */}
            <svg className="w-full h-full" viewBox="0 0 100 100">
              {/* Background Circle */}
              <circle
                className="text-slate-300 dark:text-slate-700 stroke-current opacity-20"
                cx="50"
                cy="50"
                fill="transparent"
                r="46"
                strokeWidth="4"
              ></circle>
              {/* Progress Circle (85%) */}
              <circle
                className="text-primary stroke-current drop-shadow-[0_0_10px_rgba(19,164,236,0.5)]"
                cx="50"
                cy="50"
                fill="transparent"
                r="46"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                strokeWidth="4"
                style={{
                  transition: 'stroke-dashoffset 0.35s',
                  transform: 'rotate(-90deg)',
                  transformOrigin: '50% 50%',
                }}
              ></circle>
            </svg>

            {/* Inner Brain Visual */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative w-32 h-32 bg-slate-200/50 dark:bg-slate-800/50 backdrop-blur-sm rounded-full flex items-center justify-center border border-primary/30 shadow-[0_0_20px_rgba(19,164,236,0.3)]">
                {/* Pulsating glow behind */}
                <div className="absolute inset-0 rounded-full bg-primary/20 animate-pulse"></div>
                <Icon
                  name="neurology"
                  size={60}
                  className="relative z-10 text-primary drop-shadow-[0_0_15px_rgba(19,164,236,0.8)]"
                />
              </div>
            </div>

            {/* Floating Data Nodes (Decorative) */}
            <div className="absolute top-4 right-8 w-3 h-3 bg-primary rounded-full animate-pulse shadow-[0_0_10px_#13a4ec]"></div>
            <div
              className="absolute bottom-8 left-6 w-2 h-2 bg-primary/60 rounded-full animate-pulse"
              style={{ animationDelay: '0.75s' }}
            ></div>
            <div
              className="absolute top-12 left-4 w-1.5 h-1.5 bg-primary/40 rounded-full animate-pulse"
              style={{ animationDelay: '1.5s' }}
            ></div>
          </div>

          {/* Percentage Display */}
          <div className="flex flex-col items-center mt-6">
            <h1 className="text-5xl font-extrabold text-slate-900 dark:text-white tracking-tighter drop-shadow-lg">
              {progress}
              <span className="text-2xl text-primary align-top">%</span>
            </h1>
            <p className="text-primary font-medium mt-2 animate-pulse">Finalizing Predictions...</p>
          </div>
        </div>

        {/* Metric Cards */}
        <div className="w-full flex flex-col gap-4 z-10">
          {metrics.map((metric, index) => (
            <div
              key={index}
              className={`bg-white/60 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/50 rounded-lg p-4 flex items-center justify-between backdrop-blur-sm ${
                metric.status === 'pending' ? 'opacity-60' : ''
              }`}
            >
              <div className="flex items-center gap-4">
                <div
                  className={`p-2 rounded-md ${
                    metric.status === 'pending'
                      ? 'bg-slate-200 dark:bg-slate-700/50 text-slate-500 dark:text-slate-400'
                      : 'bg-primary/10 text-primary'
                  }`}
                >
                  <Icon name={metric.icon} size={20} />
                </div>
                <div className="flex flex-col">
                  <span
                    className={`text-xs uppercase tracking-wider font-semibold ${
                      metric.status === 'pending' ? 'text-slate-500' : 'text-slate-500 dark:text-slate-400'
                    }`}
                  >
                    {metric.title}
                  </span>
                  <span
                    className={`text-sm font-medium ${
                      metric.status === 'pending' ? 'text-slate-500 dark:text-slate-400' : 'text-slate-700 dark:text-slate-200'
                    }`}
                  >
                    {metric.subtitle}
                  </span>
                </div>
              </div>
              <div className="text-emerald-400 flex items-center">
                {metric.status === 'complete' && <Icon name="check_circle" size={20} />}
                {metric.status === 'loading' && (
                  <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                )}
                {metric.status === 'pending' && <div className="w-2 h-2 bg-slate-400 dark:bg-slate-600 rounded-full"></div>}
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Footer Status / Micro-copy */}
      <footer className="p-6 text-center z-10">
        <p className="text-xs text-slate-500 font-mono">PROCESS_ID: 8X92-AI • EST. TIME: 2S</p>
      </footer>
    </div>
  );
}
