"use client";

import { AppLayout } from "@/components/layout/AppLayout";
import { api } from "@/lib/api";
import Link from "next/link";
import { useEffect, useState } from "react";

type Summary = { users: number; campaigns: number; applications: number; unverified: number; note: string };

export default function AdminDashboardPage() {
  const [summary, setSummary] = useState<Summary | null>(null);

  useEffect(() => {
    void api.get<Summary>("/api/admin/summary").then((response) => setSummary(response.data));
  }, []);

  return (
    <AppLayout variant="admin" activeTab="Dashboard">
      <div className="mx-auto max-w-3xl space-y-4 px-4 py-8">
        <h1 className="text-2xl font-bold">Admin</h1>
        <p className="text-sm text-slate-500">{summary?.note}</p>
        {summary ? (
          <ul className="grid grid-cols-2 gap-3 text-sm">
            <li className="rounded-xl border border-border p-4">Users: {summary.users}</li>
            <li className="rounded-xl border border-border p-4">Campaigns: {summary.campaigns}</li>
            <li className="rounded-xl border border-border p-4">Applications: {summary.applications}</li>
            <li className="rounded-xl border border-border p-4">Unverified emails: {summary.unverified}</li>
          </ul>
        ) : (
          <p className="text-sm text-slate-500">Loading…</p>
        )}
        <div className="flex gap-4 text-sm font-semibold text-primary">
          <Link href="/admin/user-management">Users</Link>
          <Link href="/admin/verification-queue">Unverified</Link>
          <Link href="/admin/fraud-control">Fraud</Link>
        </div>
      </div>
    </AppLayout>
  );
}
