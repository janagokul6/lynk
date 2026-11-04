"use client";

import Link from "next/link";

export function PublicChrome({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background-light text-slate-900 dark:bg-background-dark dark:text-slate-100">
      <header className="border-b border-border">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4">
          <Link href="/" className="text-lg font-bold">Lynk</Link>
          <nav className="flex items-center gap-4 text-sm font-semibold">
            <Link href="/pricing">Pricing</Link>
            <Link href="/faq">FAQ</Link>
            <Link href="/about">About</Link>
            <Link href="/login">Log in</Link>
            <Link href="/signup" className="rounded-lg bg-primary-500 px-3 py-2 text-white">Sign up</Link>
          </nav>
        </div>
      </header>
      <div className="mx-auto max-w-5xl px-4 py-10">{children}</div>
      <footer className="border-t border-border py-8">
        <div className="mx-auto flex max-w-5xl flex-wrap gap-4 px-4 text-sm">
          <Link href="/about">About</Link>
          <Link href="/faq">FAQ</Link>
          <Link href="/pricing">Pricing</Link>
          <Link href="/terms">Terms</Link>
          <Link href="/privacy">Privacy</Link>
          <Link href="/login">Log in</Link>
          <Link href="/signup">Sign up</Link>
        </div>
        <p className="mx-auto mt-4 max-w-5xl px-4 text-xs text-slate-500">© 2026 Lynk</p>
      </footer>
    </div>
  );
}
