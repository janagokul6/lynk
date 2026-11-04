"use client";

import { AppLayout } from "@/components/layout/AppLayout";
import { api } from "@/lib/api";
import Link from "next/link";
import { useEffect, useState } from "react";

type Me = {
  user?: {
    name?: string;
    email?: string;
    role?: string;
    image?: string | null;
  };
} | null;

export default function BrandProfilePage() {
  const [me, setMe] = useState<Me | undefined>(undefined);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    api
      .get<Me>("/api/me")
      .then((res) => setMe(res.data))
      .catch(() => setFailed(true));
  }, []);

  const user = me?.user;

  return (
    <AppLayout
      variant="brand"
      activeTab="Profile"
      header={
        <div className="border-b border-border px-4 py-3">
          <h1 className="text-xl font-bold text-text">Profile</h1>
        </div>
      }
    >
      <div className="mx-auto w-full max-w-lg px-4 py-6">
        {failed && <p className="text-sm text-destructive">Could not load your profile.</p>}
        {!failed && me === undefined && <p className="text-sm text-text-muted">Loading profile…</p>}
        {!failed && me !== undefined && !user && (
          <div className="space-y-3">
            <p className="text-sm text-text-muted">Sign in to see your brand profile.</p>
            <Link href="/login" className="text-sm font-semibold text-primary">
              Log in
            </Link>
          </div>
        )}
        {user && (
          <dl className="space-y-4 rounded-xl border border-border bg-surface p-4">
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-text-muted">Name</dt>
              <dd className="text-base font-semibold text-text">{user.name || "—"}</dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-text-muted">Email</dt>
              <dd className="text-base text-text">{user.email || "—"}</dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-text-muted">Role</dt>
              <dd className="text-base capitalize text-text">{user.role || "—"}</dd>
            </div>
          </dl>
        )}
      </div>
    </AppLayout>
  );
}
