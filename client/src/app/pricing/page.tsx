'use client';

import { Icon } from '@/components/ui/Icon';
import { PricingContent } from '@/components/pricing/PricingContent';
import Link from 'next/link';

/**
 * Public pricing route: no sidebar, no bottom nav.
 * Uses the same top header as home/FAQ. For brand or influencer dashboard
 * pricing screens, use <PricingContent /> inside AppLayout (or dashboard layout)
 * so sidebar and nav match the panel design.
 */
export default function PricingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background-light dark:bg-background-dark text-text antialiased">
      {/* Public top nav – same as home / FAQ (no sidebar, no bottom nav) */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass-panel border-b-0 border-b-slate-200/80 dark:border-b-border/50">
        <div className="flex items-center justify-between px-4 h-16 max-w-7xl mx-auto">
          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="flex size-8 items-center justify-center rounded-lg text-text-muted hover:bg-surface-hover transition-colors shrink-0"
              aria-label="Back to home"
            >
              <Icon name="arrow_back" size={20} />
            </Link>
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-blue-600 flex items-center justify-center text-white shrink-0">
                <Icon name="auto_awesome" size={20} />
              </div>
              <span className="text-lg font-bold tracking-tight text-text hidden sm:inline">Lynk</span>
            </Link>
          </div>
          <button type="button" className="text-text-muted hover:text-text text-sm font-semibold transition-colors">
            Login
          </button>
        </div>
      </nav>

      <main className="flex-1 pt-16">
        <PricingContent />
      </main>
    </div>
  );
}
