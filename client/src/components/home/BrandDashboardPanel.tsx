"use client";

import { useEffect, useState } from "react";
import type { ShortlistList } from "@lynk/shared";
import { formatInrBand } from "@lynk/shared";
import { api } from "@/lib/api";

type CampaignRow = {
  id: string;
  title?: string;
  name?: string;
  status?: string;
  payMin?: string;
  payMax?: string;
};

type ApplicationRow = {
  id: string;
  status: string;
  campaignTitle?: string;
  influencerName?: string;
  message?: string | null;
};

function Empty({ children }: { children: string }) {
  return <p className="rounded-xl border border-dashed border-border px-4 py-6 text-sm text-slate-500">{children}</p>;
}

export function BrandDashboardPanel() {
  const [campaigns, setCampaigns] = useState<CampaignRow[] | null>(null);
  const [applications, setApplications] = useState<ApplicationRow[] | null>(null);
  const [shortlist, setShortlist] = useState<ShortlistList | null>(null);

  useEffect(() => {
    api.get<CampaignRow[]>("/api/campaigns").then((res) => setCampaigns(res.data)).catch(() => setCampaigns([]));
    api.get<ApplicationRow[]>("/api/applications").then((res) => setApplications(res.data)).catch(() => setApplications([]));
    api.get<ShortlistList>("/api/shortlist").then((res) => setShortlist(res.data)).catch(() => setShortlist({ groups: [], items: [] }));
  }, []);

  const groupName = new Map((shortlist?.groups ?? []).map((group) => [group.id, group.name]));

  return (
    <div className="flex flex-col gap-6 p-4">
      <section className="space-y-3">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">Campaigns</h2>
        {campaigns == null ? (
          <p className="text-sm text-slate-500">Loading campaigns…</p>
        ) : campaigns.length === 0 ? (
          <Empty>No campaigns yet. Ask the assistant to draft one, or create one from Campaigns.</Empty>
        ) : (
          <ul className="space-y-2">
            {campaigns.map((campaign) => (
              <li key={campaign.id} className="rounded-xl border border-border bg-white px-4 py-3 dark:bg-surface-dark">
                <p className="font-semibold text-slate-900 dark:text-white">{campaign.title || campaign.name}</p>
                <p className="text-xs text-slate-500">
                  {campaign.status} · {formatInrBand(campaign.payMin ?? "", campaign.payMax ?? "")}
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">Applicants</h2>
        {applications == null ? (
          <p className="text-sm text-slate-500">Loading applications…</p>
        ) : applications.length === 0 ? (
          <Empty>No applications yet.</Empty>
        ) : (
          <ul className="space-y-2">
            {applications.map((application) => (
              <li key={application.id} className="rounded-xl border border-border bg-white px-4 py-3 dark:bg-surface-dark">
                <div className="flex items-center justify-between gap-2">
                  <p className="font-semibold text-slate-900 dark:text-white">
                    {application.influencerName || "Applicant"}
                  </p>
                  <span className="text-[11px] font-bold uppercase text-slate-500">{application.status}</span>
                </div>
                <p className="text-xs text-slate-500">{application.campaignTitle}</p>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">Shortlist</h2>
        {shortlist == null ? (
          <p className="text-sm text-slate-500">Loading shortlist…</p>
        ) : shortlist.items.length === 0 ? (
          <Empty>Your shortlist is empty. Search creators in chat and shortlist them.</Empty>
        ) : (
          <ul className="space-y-2">
            {shortlist.items.map((item) => (
              <li key={item.id} className="rounded-xl border border-border bg-white px-4 py-3 dark:bg-surface-dark">
                <p className="font-semibold text-slate-900 dark:text-white">{item.creator.displayName}</p>
                <p className="text-xs text-slate-500">
                  @{item.creator.handle}
                  {item.groupId ? ` · ${groupName.get(item.groupId) ?? "Group"}` : " · Wishlist"}
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">Performance</h2>
        <Empty>Reach, spend, and ROI trends are not available yet. Lynk does not have campaign performance data.</Empty>
      </section>
    </div>
  );
}
