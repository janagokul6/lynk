"use client";

import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { AccountLinks } from "@/components/account/AccountLinks";
import { cn } from "@/lib/utils";

export interface NavItem {
  label: string;
  icon: string;
  href: string;
  active?: boolean;
  showDot?: boolean;
  filled?: boolean;
}

export interface BottomNavProps {
  items?: NavItem[];
  activeTab?: string;
  logoLabel?: string;
  logoIcon?: string;
  className?: string;
}

export function BottomNav({ items, activeTab, logoLabel = "Lynk", logoIcon = "link", className }: BottomNavProps) {
  const navItems = items ?? [];

  return (
    <nav className={cn("fixed bottom-0 left-0 right-0 z-50 bg-white/95 dark:bg-surface-card border-t border-slate-200 dark:border-[#283339] pb-safe backdrop-blur-md lg:top-0 lg:bottom-0 lg:w-64 lg:border-r lg:border-t-0 lg:flex-col lg:justify-start lg:pb-0", className)}>

      {/* Desktop Logo Header */}
      <div className="hidden lg:flex items-center gap-2 px-6 py-8">
        <div className="flex size-8 items-center justify-center rounded-xl bg-primary text-white">
          <Icon name={logoIcon} size={20} />
        </div>
        <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">{logoLabel}</span>
      </div>

      <div className="flex items-center justify-around h-16 max-w-screen-lg mx-auto lg:h-auto lg:w-full lg:flex-col lg:justify-start lg:items-stretch lg:px-4 lg:gap-2 lg:mt-4">
        {navItems.map((item) => {
          const isActive = activeTab ? item.label.toLowerCase() === activeTab.toLowerCase() : item.active;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center gap-1 px-4 py-2 transition-opacity relative group",
                "lg:flex-row lg:justify-start lg:px-4 lg:py-3 lg:rounded-xl",
                isActive
                  ? "opacity-100 lg:bg-primary/10 dark:lg:bg-primary/20"
                  : "opacity-60 hover:opacity-100 lg:hover:bg-slate-100 dark:lg:hover:bg-white/5"
              )}
            >
              <div className="relative shrink-0">
                {isActive ? (
                  <div className={cn(
                    "flex items-center justify-center rounded-full text-white shadow-lg shadow-primary/40",
                    "h-10 w-10 bg-primary lg:bg-transparent lg:shadow-none lg:text-primary lg:h-6 lg:w-6"
                  )}>
                    <Icon name={item.icon} size={24} className="lg:!text-[22px]" />
                  </div>
                ) : (
                  <Icon name={item.icon} size={24} className="text-slate-600 dark:text-white lg:!text-[22px]" />
                )}
                {item.showDot && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-destructive rounded-full lg:right-0" />
                )}
              </div>
              <span className={cn(
                "text-[10px] font-medium transition-colors",
                "lg:text-sm",
                isActive ? "text-primary font-bold" : "text-slate-600 dark:text-white group-hover:text-slate-900 dark:group-hover:text-white"
              )}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
      <div className="hidden lg:block px-6 pb-6 mt-auto">
        <AccountLinks />
      </div>
    </nav>
  );
}
