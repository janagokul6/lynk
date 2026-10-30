import { cn } from "@/lib/utils";

export interface CampaignCardProps {
  brandName: string;
  campaignTitle: string;
  brandLogo: string;
  tags: string[];
  compensation: string;
  matchScore: number;
  isPrimary?: boolean;
}

export function CampaignCard({
  brandName,
  campaignTitle,
  brandLogo,
  tags,
  compensation,
  matchScore,
  isPrimary = false,
}: CampaignCardProps) {
  return (
    <div className="group relative overflow-hidden rounded-2xl bg-white dark:bg-surface-card border border-slate-200 dark:border-border p-5 shadow-lg transition-all hover:border-primary-500/50">
      {/* Match Score Badge */}
      <div className="absolute top-0 right-0 p-3">
        <span
          className={cn(
            "inline-flex items-center justify-center px-2.5 py-1 rounded-full text-[10px] font-bold border",
            matchScore >= 90
              ? "bg-primary-500/10 text-primary-500 border-primary-500/20"
              : "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
          )}
        >
          {matchScore}% Match
        </span>
      </div>

      {/* Brand Info */}
      <div className="flex items-start gap-4 mb-4">
        <div className="size-14 rounded-xl bg-black flex items-center justify-center shrink-0 border border-border">
          <span className="material-symbols-outlined text-white text-3xl">{brandLogo}</span>
        </div>
        <div className="pt-1">
          <h3 className="text-base font-bold text-slate-900 dark:text-white">{campaignTitle}</h3>
          <p className="text-sm text-slate-500 dark:text-muted-foreground font-medium">{brandName}</p>
        </div>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-4">
        {tags.map((tag, index) => (
          <span
            key={index}
            className="px-2 py-1 rounded-md bg-slate-100 dark:bg-background text-[11px] font-medium text-slate-600 dark:text-muted-foreground border border-slate-200 dark:border-border"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Compensation & Action */}
      <div className="flex items-center justify-between mt-2 pt-4 border-t border-slate-200 dark:border-border/50">
        <div className="flex flex-col">
          <span className="text-[10px] text-slate-500 dark:text-muted-foreground uppercase tracking-wider font-semibold">Compensation</span>
          <span className="text-sm font-bold text-slate-900 dark:text-white">{compensation}</span>
        </div>
        <button
          className={cn(
            "px-4 py-2 rounded-lg text-xs font-bold transition-transform active:scale-95",
            isPrimary
              ? "bg-primary-500 text-white shadow-lg shadow-primary-500/20 hover:bg-primary-600"
              : "bg-slate-100 dark:bg-surface-dark border border-slate-200 dark:border-border hover:bg-slate-200 dark:hover:bg-surface-dark/80 text-slate-900 dark:text-white"
          )}
        >
          {isPrimary ? "Apply Now" : "View Details"}
        </button>
      </div>
    </div>
  );
}
