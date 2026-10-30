import { cn } from "@/lib/utils";

export interface ROIChartProps {
  title: string;
  value: string;
  change: string;
  changeType: "positive" | "negative";
  dataPoints: number[];
  labels: string[];
}

export function ROIChart({
  title,
  value,
  change,
  changeType,
  dataPoints,
  labels,
}: ROIChartProps) {
  // Normalize data points to fit in SVG viewBox
  const maxValue = Math.max(...dataPoints);
  const minValue = Math.min(...dataPoints);
  const range = maxValue - minValue;
  
  const normalizedPoints = dataPoints.map((point) => {
    return 100 - ((point - minValue) / range) * 80; // Scale to 0-80 range, inverted for SVG
  });

  // Create SVG path
  const pathData = normalizedPoints
    .map((y, i) => {
      const x = (i / (dataPoints.length - 1)) * 100;
      return `${i === 0 ? "M" : "L"} ${x} ${y}`;
    })
    .join(" ");

  // Create area path (filled under the line)
  const areaPathData = `${pathData} L 100 100 L 0 100 Z`;

  return (
    <div className="flex flex-col gap-4 p-4 bg-white dark:bg-background border border-slate-200 dark:border-border rounded-xl shadow-sm">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-1">
          <span className="text-xs uppercase font-medium text-slate-500 dark:text-muted-foreground tracking-wide">
            {title}
          </span>
          <span className="text-3xl font-bold text-slate-900 dark:text-foreground">{value}</span>
        </div>
        <span
          className={cn(
            "text-sm font-semibold",
            changeType === "positive" ? "text-success" : "text-destructive"
          )}
        >
          {change}
        </span>
      </div>

      {/* Chart */}
      <div className="relative w-full h-32">
        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          className="w-full h-full"
        >
          {/* Gradient definition */}
          <defs>
            <linearGradient id="chartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="rgb(var(--primary-500))" stopOpacity="0.3" />
              <stop offset="100%" stopColor="rgb(var(--primary-500))" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Area fill */}
          <path
            d={areaPathData}
            fill="url(#chartGradient)"
          />

          {/* Line */}
          <path
            d={pathData}
            fill="none"
            stroke="rgb(var(--primary-500))"
            strokeWidth="2"
            vectorEffect="non-scaling-stroke"
          />

          {/* Data points */}
          {normalizedPoints.map((y, i) => {
            const x = (i / (dataPoints.length - 1)) * 100;
            return (
              <circle
                key={i}
                cx={x}
                cy={y}
                r="1.5"
                fill="rgb(var(--primary-500))"
                vectorEffect="non-scaling-stroke"
              />
            );
          })}
        </svg>
      </div>

      {/* Labels */}
      <div className="flex justify-between">
        {labels.map((label, index) => (
          <span key={index} className="text-xs text-slate-500 dark:text-muted-foreground">
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}
