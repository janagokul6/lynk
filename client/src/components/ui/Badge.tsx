import { cn } from "@/lib/utils";
import { Icon } from "./Icon";

export interface BadgeProps {
  children: React.ReactNode;
  variant: "primary" | "success" | "warning" | "secondary" | "ai-match";
  size?: "sm" | "md";
  icon?: string;
  className?: string;
}

const variantStyles = {
  primary: "bg-primary-500/10 text-primary-500 border-primary-500/20",
  success: "bg-success/10 text-success border-success/20",
  warning: "bg-warning/10 text-warning border-warning/20",
  secondary: "bg-secondary-500/10 text-secondary-500 border-secondary-500/20",
  "ai-match": "bg-gradient-to-r from-primary-500/10 to-accent-500/10 text-primary-500 border-primary-500/20",
};

const sizeStyles = {
  sm: "px-2 py-0.5 text-xs",
  md: "px-3 py-1 text-sm",
};

export function Badge({ children, variant, size = "sm", icon, className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border font-medium",
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
    >
      {icon && <Icon name={icon} size={size === "sm" ? 14 : 16} />}
      {children}
    </span>
  );
}
