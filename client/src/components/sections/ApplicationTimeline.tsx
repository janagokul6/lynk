import { cn } from "@/lib/utils";

export interface TimelineItem {
  title: string;
  status: "Reviewing" | "Approved" | "Rejected";
  description: string;
  icon: string;
  actionLabel?: string;
}

export interface ApplicationTimelineProps {
  items: TimelineItem[];
}

export function ApplicationTimeline({ items }: ApplicationTimelineProps) {
  const getStatusStyles = (status: TimelineItem["status"]) => {
    switch (status) {
      case "Reviewing":
        return {
          badge: "text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900/30",
          icon: "bg-yellow-500/20 text-yellow-500 border-yellow-500/30 shadow-[0_0_10px_rgba(234,179,8,0.2)]",
          button: "bg-yellow-600/10 text-yellow-600 dark:text-yellow-400 border-yellow-600/20 hover:bg-yellow-600/20",
        };
      case "Approved":
        return {
          badge: "text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30",
          icon: "bg-green-500/20 text-green-500 border-green-500/30 shadow-[0_0_10px_rgba(34,197,94,0.2)]",
          button: "bg-green-600/10 text-green-600 dark:text-green-400 border-green-600/20 hover:bg-green-600/20",
        };
      case "Rejected":
        return {
          badge: "text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30",
          icon: "bg-red-500/20 text-red-500 border-red-500/30 shadow-[0_0_10px_rgba(239,68,68,0.2)]",
          button: "bg-red-600/10 text-red-600 dark:text-red-400 border-red-600/20 hover:bg-red-600/20",
        };
    }
  };

  return (
    <div className="space-y-4">
      {items.map((item, index) => {
        const styles = getStatusStyles(item.status);
        const isLast = index === items.length - 1;

        return (
          <div key={index} className="flex gap-4 relative pl-2">
            {/* Vertical Line */}
            {!isLast && (
              <div className="absolute left-[19px] top-8 bottom-[-16px] w-0.5 bg-slate-200 dark:bg-border"></div>
            )}

            {/* Status Icon */}
            <div className="mt-1 relative z-10">
              <div className={cn("size-9 rounded-full flex items-center justify-center border", styles.icon)}>
                <span className="material-symbols-outlined text-[18px]">{item.icon}</span>
              </div>
            </div>

            {/* Content Card */}
            <div className="flex-1 bg-white dark:bg-surface-card p-3 rounded-xl border border-slate-200 dark:border-border">
              <div className="flex justify-between items-start mb-1">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">{item.title}</h4>
                <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded-full", styles.badge)}>{item.status}</span>
              </div>
              <p className="text-xs text-slate-500 dark:text-muted-foreground">{item.description}</p>

              {/* Optional Action Button */}
              {item.actionLabel && (
                <button className={cn("mt-2 w-full py-1.5 rounded-lg text-[11px] font-bold border", styles.button)}>
                  {item.actionLabel}
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
