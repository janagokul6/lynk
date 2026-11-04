import Link from "next/link";
import { BrandAgentChat } from "@/components/agent/BrandAgentChat";
import { APP_NAME } from "@/lib/constants";

export default function AgentPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background-light dark:bg-background-dark">
      <header className="h-14 border-b border-border px-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-primary">{APP_NAME}</span>
          <span className="text-xs text-slate-500">Brand agent</span>
        </div>
        <nav className="flex items-center gap-3 text-xs font-semibold">
          <Link href="/brand/home" className="text-slate-600 dark:text-slate-300 hover:text-primary">
            Home
          </Link>
          <Link href="/brand/discovery" className="text-slate-600 dark:text-slate-300 hover:text-primary">
            Discovery
          </Link>
          <Link href="/" className="text-slate-600 dark:text-slate-300 hover:text-primary">
            Home
          </Link>
        </nav>
      </header>
      <main className="flex-1 min-h-0">
        <div className="h-[calc(100vh-3.5rem)] max-w-3xl mx-auto px-2 sm:px-4 py-3">
          <BrandAgentChat />
        </div>
      </main>
    </div>
  );
}
