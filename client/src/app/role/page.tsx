"use client";

import { homePathForRole, type SelfServeRole } from "@lynk/shared";
import { api } from "@/lib/api";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

export default function RoleSelectionPage() {
  const router = useRouter();
  const [role, setRole] = useState<SelfServeRole>("brand");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setPending(true);
    setError(null);
    try {
      await api.patch("/api/me/role", { role });
      router.push(homePathForRole(role));
    } catch {
      const me = await api.get<{ user?: { role?: string } } | null>("/api/me").catch(() => null);
      const current = me?.data?.user?.role;
      if (current === "brand" || current === "influencer" || current === "admin") {
        router.push(homePathForRole(current));
        return;
      }
      setError("Could not save your role. Sign in and try again.");
    } finally {
      setPending(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-4 bg-background-light dark:bg-background-dark">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-md space-y-4 rounded-2xl border border-border bg-white/80 dark:bg-surface-dark p-6"
      >
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Choose your role</h1>
        <p className="text-sm text-slate-500">This choice is locked after you save it.</p>
        <label className="block space-y-1 text-sm">
          <span className="font-medium">I am a</span>
          <select
            className="w-full h-9 rounded-md border border-border bg-background px-3"
            value={role}
            onChange={(event) => setRole(event.target.value as SelfServeRole)}
          >
            <option value="brand">brand</option>
            <option value="influencer">influencer</option>
          </select>
        </label>
        {error && <p className="text-sm text-destructive">{error}</p>}
        <button
          type="submit"
          disabled={pending}
          className="w-full rounded-lg bg-primary py-2.5 text-sm font-bold text-white disabled:opacity-60"
        >
          {pending ? "Saving…" : "Continue"}
        </button>
      </form>
    </main>
  );
}
