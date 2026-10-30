import { Icon } from '@/components/ui/Icon';

export function SkeletonGrid() {
  return (
    <div className="relative flex h-screen w-full flex-col overflow-hidden max-w-md mx-auto bg-white dark:bg-slate-900 shadow-2xl">
      {/* Header Section */}
      <header className="flex flex-col gap-4 px-4 pt-6 pb-2 bg-white dark:bg-slate-900 sticky top-0 z-10">
        {/* Top Row: Title & Icons */}
        <div className="flex items-center justify-between">
          <div className="h-8 w-48 skeleton rounded-lg"></div>
          <div className="flex gap-3">
            <div className="h-10 w-10 skeleton rounded-full"></div>
            <div className="h-10 w-10 skeleton rounded-full"></div>
          </div>
        </div>

        {/* Search Bar Skeleton */}
        <div className="h-12 w-full skeleton rounded-xl"></div>
      </header>

      {/* Main Scrollable Content */}
      <main className="flex-1 overflow-y-auto hide-scrollbar pb-20">
        {/* Filters Section */}
        <div className="flex gap-3 px-4 py-2 overflow-x-hidden">
          <div className="h-9 w-24 skeleton rounded-full shrink-0"></div>
          <div className="h-9 w-20 skeleton rounded-full shrink-0"></div>
          <div className="h-9 w-28 skeleton rounded-full shrink-0"></div>
          <div className="h-9 w-24 skeleton rounded-full shrink-0"></div>
          <div className="h-9 w-20 skeleton rounded-full shrink-0"></div>
        </div>

        {/* ROI Calculator Widgets (Horizontal Scroll) */}
        <div className="mt-6 pl-4">
          <div className="flex items-center justify-between pr-4 mb-3">
            <div className="h-5 w-32 skeleton rounded"></div>
            <div className="h-4 w-16 skeleton rounded"></div>
          </div>
          <div className="flex gap-4 overflow-x-hidden pb-4 pr-4">
            {/* Widget Card 1 */}
            <div className="w-72 h-40 shrink-0 border border-slate-100 dark:border-slate-800 rounded-xl p-4 bg-white dark:bg-slate-900 shadow-sm flex flex-col justify-between">
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <div className="h-4 w-24 skeleton rounded"></div>
                  <div className="h-8 w-16 skeleton rounded"></div>
                </div>
                <div className="h-8 w-8 skeleton rounded-full"></div>
              </div>
              <div className="flex items-end gap-2 h-16">
                <div className="flex-1 h-8 skeleton rounded-t bg-opacity-50"></div>
                <div className="flex-1 h-12 skeleton rounded-t"></div>
                <div className="flex-1 h-6 skeleton rounded-t bg-opacity-50"></div>
                <div className="flex-1 h-10 skeleton rounded-t bg-opacity-70"></div>
                <div className="flex-1 h-14 skeleton rounded-t"></div>
              </div>
            </div>

            {/* Widget Card 2 */}
            <div className="w-72 h-40 shrink-0 border border-slate-100 dark:border-slate-800 rounded-xl p-4 bg-white dark:bg-slate-900 shadow-sm flex flex-col justify-between">
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <div className="h-4 w-24 skeleton rounded"></div>
                  <div className="h-8 w-16 skeleton rounded"></div>
                </div>
                <div className="h-8 w-8 skeleton rounded-full"></div>
              </div>
              <div className="flex items-end gap-2 h-16">
                <div className="flex-1 h-10 skeleton rounded-t bg-opacity-50"></div>
                <div className="flex-1 h-14 skeleton rounded-t"></div>
                <div className="flex-1 h-8 skeleton rounded-t bg-opacity-50"></div>
                <div className="flex-1 h-12 skeleton rounded-t bg-opacity-70"></div>
                <div className="flex-1 h-6 skeleton rounded-t"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Influencer Grid Section */}
        <div className="px-4 mt-2">
          <div className="h-6 w-40 skeleton rounded mb-4"></div>
          <div className="grid grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="flex flex-col gap-3">
                <div className="aspect-[4/5] w-full skeleton rounded-xl relative overflow-hidden">
                  <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-black/10 to-transparent"></div>
                </div>
                <div className="space-y-2">
                  <div className={`h-5 skeleton rounded ${item % 2 === 0 ? 'w-2/3' : 'w-3/4'}`}></div>
                  <div className="h-4 w-1/2 skeleton rounded opacity-70"></div>
                  <div className="flex gap-2 mt-1">
                    <div className="h-6 w-16 skeleton rounded-full"></div>
                    {item % 2 === 1 && <div className="h-6 w-12 skeleton rounded-full"></div>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Bottom Navigation Bar */}
      <div className="flex gap-2 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 pb-6 pt-3 sticky bottom-0 z-20">
        <div className="flex flex-1 flex-col items-center justify-end gap-1">
          <Icon name="home" size={24} className="text-slate-400 dark:text-slate-600" />
          <div className="h-3 w-8 skeleton rounded mt-1"></div>
        </div>
        <div className="flex flex-1 flex-col items-center justify-end gap-1">
          <Icon name="search" size={24} className="text-primary" />
          <div className="h-3 w-10 skeleton rounded mt-1"></div>
        </div>
        <div className="flex flex-1 flex-col items-center justify-end gap-1">
          <Icon name="chat_bubble" size={24} className="text-slate-400 dark:text-slate-600" />
          <div className="h-3 w-12 skeleton rounded mt-1"></div>
        </div>
        <div className="flex flex-1 flex-col items-center justify-end gap-1">
          <Icon name="person" size={24} className="text-slate-400 dark:text-slate-600" />
          <div className="h-3 w-8 skeleton rounded mt-1"></div>
        </div>
      </div>

      <style jsx>{`
        .skeleton {
          background: #e2e8f0;
          background-image: linear-gradient(to right, #e2e8f0 0%, #f1f5f9 20%, #e2e8f0 40%, #e2e8f0 100%);
          background-repeat: no-repeat;
          background-size: 1000px 100%;
          animation: shimmer 1.5s infinite linear forwards;
        }

        @media (prefers-color-scheme: dark) {
          .skeleton {
            background: #1e293b;
            background-image: linear-gradient(to right, #1e293b 0%, #334155 20%, #1e293b 40%, #1e293b 100%);
          }
        }

        @keyframes shimmer {
          0% {
            background-position: -1000px 0;
          }
          100% {
            background-position: 1000px 0;
          }
        }
      `}</style>
    </div>
  );
}
