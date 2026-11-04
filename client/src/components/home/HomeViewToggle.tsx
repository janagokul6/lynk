"use client";

import type { HomeView } from "@/lib/home-view";

export function HomeViewToggle({
  view,
  onToggle,
  testId = "home-view-toggle",
}: {
  view: HomeView;
  onToggle: () => void;
  testId?: string;
}) {
  const showingChat = view === "chat";
  return (
    <button
      type="button"
      data-testid={testId}
      aria-pressed={!showingChat}
      aria-label={showingChat ? "Show dashboard" : "Show chat"}
      onClick={onToggle}
      className="inline-flex items-center gap-1.5 rounded-full border border-border bg-white px-3 py-1.5 text-xs font-semibold text-slate-800 shadow-sm hover:border-primary hover:text-primary dark:bg-surface-dark dark:text-slate-100"
    >
      <span className="material-symbols-outlined text-[18px]">{showingChat ? "dashboard" : "chat"}</span>
      {showingChat ? "Dashboard" : "Chat"}
    </button>
  );
}
