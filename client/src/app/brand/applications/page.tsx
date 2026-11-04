"use client";

import { AppLayout } from "@/components/layout/AppLayout";
import { api } from "@/lib/api";
import type { ApplicationRecord } from "@lynk/shared";
import { useCallback, useEffect, useState } from "react";

export default function ApplicationReviewPage() {
  const [applications, setApplications] = useState<ApplicationRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(() => {
    setLoading(true);
    api
      .get<ApplicationRecord[]>("/api/applications")
      .then((res) => {
        setApplications(Array.isArray(res.data) ? res.data : []);
        setError(null);
      })
      .catch(() => setError("Could not load applications"))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function decide(id: string, action: "accept" | "reject") {
    await api.post(`/api/applications/${id}/${action}`);
    load();
  }

  return (
    <AppLayout
      variant="brand"
      activeTab="Campaigns"
      header={
        <div className="border-b border-border px-4 py-3">
          <h1 className="text-xl font-bold text-text">Applications</h1>
          <p className="text-xs text-text-muted mt-1">People who applied to your live campaigns.</p>
        </div>
      }
    >
      <div className="mx-auto w-full max-w-3xl px-4 py-6 space-y-3">
        {loading && <p className="text-sm text-text-muted">Loading applications…</p>}
        {error && <p className="text-sm text-destructive">{error}</p>}
        {!loading && !error && applications.length === 0 && (
          <div className="rounded-xl border border-dashed border-border px-4 py-12 text-center">
            <p className="font-semibold text-text">No applications yet</p>
            <p className="mt-1 text-sm text-text-muted">
              When an influencer applies to one of your live campaigns, it will show up here.
            </p>
          </div>
        )}
        {applications.map((row) => (
          <article key={row.id} className="rounded-xl border border-border bg-surface p-4 space-y-2">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="font-bold text-text">{row.influencerName ?? "Influencer"}</h2>
                <p className="text-sm text-text-muted">{row.influencerEmail}</p>
              </div>
              <span className="text-xs font-bold uppercase tracking-wide text-primary">{row.status}</span>
            </div>
            <p className="text-sm font-semibold text-text">{row.campaignTitle}</p>
            <p className="text-sm text-text-muted whitespace-pre-wrap">
              {row.message?.trim() ? row.message : "No pitch."}
            </p>
            {row.status === "pending" && (
              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => decide(row.id, "accept")}
                  className="rounded-lg bg-primary px-3 py-2 text-sm font-bold text-white"
                >
                  Accept
                </button>
                <button
                  type="button"
                  onClick={() => decide(row.id, "reject")}
                  className="rounded-lg border border-border px-3 py-2 text-sm font-bold text-text"
                >
                  Reject
                </button>
              </div>
            )}
          </article>
        ))}
      </div>
    </AppLayout>
  );
}
