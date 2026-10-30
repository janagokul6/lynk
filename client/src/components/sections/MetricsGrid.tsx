import { StatCard } from "@/components/cards/StatCard";
import { cn } from "@/lib/utils";

export interface Metric {
  icon: string;
  label: string;
  value: string;
  iconColor?: string;
}

export interface MetricsGridProps {
  metrics: Metric[];
  scrollable?: boolean;
}

export function MetricsGrid({ metrics, scrollable = true }: MetricsGridProps) {
  return (
    <div
      className={cn(
        "flex gap-3",
        scrollable && "overflow-x-auto hide-scrollbar -mx-4 px-4"
      )}
    >
      {metrics.map((metric, index) => (
        <div key={index} className="flex-shrink-0 w-40">
          <StatCard
            icon={metric.icon}
            label={metric.label}
            value={metric.value}
            iconColor={metric.iconColor}
          />
        </div>
      ))}
    </div>
  );
}
