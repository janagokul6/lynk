"use client";

import { AppLayout } from "@/components/layout/AppLayout";
import { Icon } from "@/components/ui/Icon";
import Link from "next/link";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { formatInrBand } from "@lynk/shared";
import type { CampaignSummary, CampaignStatus } from "@/types";

function statusStyles(status: CampaignStatus) {
  if (status === "live") {
    return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
  }
  if (status === "draft") {
    return "bg-amber-500/10 text-amber-500 border-amber-500/20";
  }
  return "bg-slate-500/10 text-slate-400 border-slate-500/20";
}

function statusLabel(s: CampaignStatus) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function formatPeriod(start: string | null, end: string | null) {
  if (!start && !end) return "—";
  if (start && end) return `${start} – ${end}`;
  return start ?? end ?? "—";
}

export default function BrandCampaignsIndexPage() {
  const [campaigns, setCampaigns] = useState<CampaignSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api
      .get<CampaignSummary[]>("/api/campaigns")
      .then((res) => setCampaigns(res.data ?? []))
      .catch(() => setError("Failed to load campaigns"))
      .finally(() => setLoading(false));
  }, []);

  const liveCount = campaigns.filter((c) => c.status === "live").length;

  return (
    <AppLayout
      variant="brand"
      activeTab="Campaigns"
      header={
        <div className="bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-md border-b border-border">
          <div className="flex items-center justify-between px-4 py-3 max-w-screen-lg mx-auto">
            <div>
              <h1 className="text-xl font-bold tracking-tight text-text">Campaigns</h1>
              <p className="text-xs text-text-muted mt-1">
                Manage live campaigns and explore AI ROI predictions.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Link
                href="/marketplace"
                className="inline-flex items-center gap-2 rounded-full border border-border text-text text-sm font-semibold px-4 py-2 hover:bg-slate-100 dark:hover:bg-surface-subtle transition-colors lg:px-5 lg:py-2.5 lg:text-base"
              >
                <Icon name="explore" size={18} />
                <span className="hidden sm:inline">Marketplace</span>
                <span className="sm:hidden">Market</span>
              </Link>
              <Link
                href="/brand/campaigns/create"
                className="inline-flex items-center gap-2 rounded-full bg-primary text-white text-sm font-semibold px-4 py-2 shadow-md shadow-primary/30 hover:brightness-110 transition-colors lg:px-5 lg:py-2.5 lg:text-base"
              >
                <Icon name="add" size={18} />
                <span className="hidden sm:inline">New campaign</span>
                <span className="sm:hidden">Create</span>
              </Link>
            </div>
          </div>
        </div>
      }
    >
      <div className="w-full max-w-screen-lg lg:max-w-6xl mx-auto px-4 lg:px-6 lg:py-6 flex flex-col gap-4">
        <section className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-wide text-text-muted">
              Overview
            </span>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            <div className="rounded-xl bg-surface border border-border-subtle p-3 flex flex-col gap-1">
              <span className="text-[11px] font-medium text-text-muted uppercase tracking-wide">
                Live campaigns
              </span>
              <span className="text-lg font-bold text-text">{loading ? "—" : liveCount}</span>
            </div>
            <div className="rounded-xl bg-surface border border-border-subtle p-3 flex flex-col gap-1">
              <span className="text-[11px] font-medium text-text-muted uppercase tracking-wide">
                Total campaigns
              </span>
              <span className="text-lg font-bold text-text">{loading ? "—" : campaigns.length}</span>
            </div>
            <div className="rounded-xl bg-surface border border-border-subtle p-3 flex flex-col gap-1 sm:col-span-1 col-span-2">
              <span className="text-[11px] font-medium text-text-muted uppercase tracking-wide">
                Drafts
              </span>
              <span className="text-lg font-bold text-text">
                {loading ? "—" : campaigns.filter((c) => c.status === "draft").length}
              </span>
            </div>
          </div>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="text-sm font-semibold text-text">All campaigns</h2>
          {error && (
            <p className="text-sm text-destructive">{error}</p>
          )}
          {loading && (
            <p className="text-sm text-text-muted">Loading…</p>
          )}
          {!loading && !error && campaigns.length === 0 && (
            <div className="rounded-xl bg-surface border border-border-subtle p-8 text-center">
              <p className="text-text font-medium">No campaigns yet</p>
              <p className="text-sm text-text-muted mt-1">Create your first campaign to get started.</p>
              <Link
                href="/brand/campaigns/create"
                className="inline-flex items-center gap-2 mt-4 rounded-full bg-primary text-white text-sm font-semibold px-4 py-2"
              >
                <Icon name="add" size={18} />
                New campaign
              </Link>
            </div>
          )}
          {!loading && !error && campaigns.length > 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 lg:gap-4">
              {campaigns.map((campaign) => (
                <article
                  key={campaign.id}
                  className="rounded-xl bg-surface border border-border-subtle p-4 flex flex-col gap-3 hover:border-primary/30 transition-colors"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-semibold text-text">{campaign.title}</h3>
                        <span
                          className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${statusStyles(
                            campaign.status,
                          )}`}
                        >
                          {statusLabel(campaign.status)}
                        </span>
                      </div>
                      <p className="text-xs text-text-muted">{campaign.campaignType}</p>
                    </div>
                    <div className="flex flex-col items-end text-right gap-1">
                      <span className="text-xs text-text-muted">Pay band</span>
                      <span className="text-sm font-semibold text-text">
                        {formatInrBand(campaign.payMin, campaign.payMax)}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-text-muted">
                    <span className="inline-flex items-center gap-1">
                      <Icon name="calendar_today" size={14} />
                      {formatPeriod(campaign.startDate, campaign.endDate)}
                    </span>
                  </div>

                  <div className="flex gap-2 pt-1">
                    <Link
                      href={`/brand/campaigns/${campaign.id}/edit`}
                      className="inline-flex flex-1 items-center justify-center gap-1 rounded-lg border border-border-subtle px-3 py-2 text-xs font-semibold text-text hover:bg-surface-subtle transition-colors"
                    >
                      <Icon name="edit" size={16} />
                      Edit
                    </Link>
                    <Link
                      href={`/brand/campaigns/${campaign.id}/analytics`}
                      className="inline-flex flex-1 items-center justify-center gap-1 rounded-lg border border-border-subtle px-3 py-2 text-xs font-semibold text-text hover:bg-surface-subtle transition-colors"
                    >
                      <Icon name="insights" size={16} />
                      Analytics
                    </Link>
                    <Link
                      href={`/brand/campaigns/${campaign.id}/roi-comparison`}
                      className="inline-flex flex-1 items-center justify-center gap-1 rounded-lg bg-primary/10 text-primary px-3 py-2 text-xs font-semibold hover:bg-primary/15 transition-colors"
                    >
                      <Icon name="trending_up" size={16} />
                      ROI
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </AppLayout>
  );
}
