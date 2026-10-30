"use client";

import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";
import { Icon } from "./Icon";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  icon?: string;
  iconPosition?: "left" | "right";
  fullWidth?: boolean;
}

const variantStyles = {
  primary: "bg-primary-500 text-white hover:bg-primary-600 focus-visible:ring-primary-500",
  secondary: "border border-slate-300 dark:border-border bg-transparent text-slate-900 dark:text-foreground hover:bg-slate-100 dark:hover:bg-muted focus-visible:ring-slate-400 dark:focus-visible:ring-border",
  ghost: "hover:bg-slate-100 dark:hover:bg-muted text-slate-900 dark:text-foreground focus-visible:ring-slate-400 dark:focus-visible:ring-muted-foreground",
};

const sizeStyles = {
  sm: "px-3 py-1.5 text-xs",
  md: "px-4 py-2 text-sm",
  lg: "px-6 py-3 text-base",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", icon, iconPosition = "left", fullWidth = false, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background-light dark:focus-visible:ring-offset-background-dark disabled:pointer-events-none disabled:opacity-50",
          variantStyles[variant],
          sizeStyles[size],
          fullWidth && "w-full",
          className
        )}
        {...props}
      >
        {icon && iconPosition === "left" && <Icon name={icon} size={size === "sm" ? 16 : size === "lg" ? 24 : 20} />}
        {children}
        {icon && iconPosition === "right" && <Icon name={icon} size={size === "sm" ? 16 : size === "lg" ? 24 : 20} />}
      </button>
    );
  }
);

Button.displayName = "Button";
