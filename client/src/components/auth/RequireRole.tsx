"use client";

import { api } from "@/lib/api";
import { homePathForRole } from "@lynk/shared";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export function RequireRole({
  role,
  children,
}: {
  role: "brand" | "influencer" | "admin";
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    api
      .get<{ user?: { role?: string } } | null>("/api/me")
      .then((response) => {
        const actual = response.data?.user?.role;
        if (!actual) {
          router.replace("/login");
          return;
        }
        if (actual !== role) {
          router.replace(homePathForRole(actual));
          return;
        }
        if (!cancelled) setReady(true);
      })
      .catch(() => router.replace("/login"));
    return () => {
      cancelled = true;
    };
  }, [role, router]);

  if (!ready) {
    return <p className="p-6 text-sm text-slate-500">Checking your session…</p>;
  }
  return children;
}
