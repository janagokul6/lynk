import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/utils";

export interface StatCardProps {
  icon: string;
  label: string;
  value: string | number;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  iconColor?: string;
}

const changeTypeStyles = {
  positive: "text-success",
  negative: "text-destructive",
  neutral: "text-muted-foreground",
};

export function StatCard({
  icon,
  label,
  value,
  change,
  changeType = "neutral",
  iconColor = "bg-primary-500/10",
}: StatCardProps) {
  return (
    <div className="flex flex-col gap-3 p-4 bg-white dark:bg-background border border-slate-200 dark:border-border rounded-xl shadow-sm">
      {/* Icon with colored background */}
      <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center", iconColor)}>
        <Icon name={icon} size={20} className="text-primary-500" />
      </div>

      {/* Label and value */}
      <div className="flex flex-col gap-1">
        <span className="text-xs uppercase font-medium text-slate-500 dark:text-muted-foreground tracking-wide">
          {label}
        </span>
        <span className="text-2xl font-bold text-slate-900 dark:text-foreground">{value}</span>
      </div>

      {/* Optional change indicator */}
      {change && (
        <div className={cn("text-sm font-medium", changeTypeStyles[changeType])}>
          {change}
        </div>
      )}
    </div>
  );
}
