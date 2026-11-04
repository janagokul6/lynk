"use client";

import { useEffect, useState } from "react";
import type { HomeCampaignCard } from "@lynk/shared";
import { api } from "@/lib/api";

type ApplicationRow = {
  id: string;
  status: string;
  campaignTitle?: string;
  message?: string | null;
};

type HomePayload = {
  briefing?: {
    nicheNote?: string;
    campaigns?: HomeCampaignCard[];
  };
};

function Empty({ children }: { children: string }) {
  return <p className="rounded-xl border border-dashed border-border px-4 py-6 text-sm text-slate-500">{children}</p>;
}

export function InfluencerDashboardPanel() {
  const [applications, setApplications] = useState<ApplicationRow[] | null>(null);
  const [campaigns, setCampaigns] = useState<HomeCampaignCard[] | null>(null);
  const [note, setNote] = useState<string>("");

  useEffect(() => {
    api.get<ApplicationRow[]>("/api/applications").then((res) => setApplications(res.data)).catch(() => setApplications([]));
    api
      .get<HomePayload>("/api/home")
      .then((res) => {
        setCampaigns(res.data.briefing?.campaigns ?? []);
        setNote(res.data.briefing?.nicheNote ?? "");
      })
      .catch(() => setCampaigns([]));
  }, []);

  return (
    <div className="flex flex-col gap-6 p-4">
      <section className="space-y-3">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">Live campaigns</h2>
        {note ? <p className="text-xs text-slate-500">{note}</p> : null}
        {campaigns == null ? (
          <p className="text-sm text-slate-500">Loading campaigns…</p>
        ) : campaigns.length === 0 ? (
          <Empty>No live campaigns to show yet.</Empty>
        ) : (
          <ul className="space-y-2">
            {campaigns.map((campaign) => (
              <li key={campaign.id} className="rounded-xl border border-border bg-white px-4 py-3 dark:bg-surface-dark">
                <p className="font-semibold text-slate-900 dark:text-white">{campaign.title}</p>
                <p className="text-xs text-slate-500">
                  {campaign.brandName || "Brand"} · {campaign.payMin}–{campaign.payMax}
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">My applications</h2>
        {applications == null ? (
          <p className="text-sm text-slate-500">Loading applications…</p>
        ) : applications.length === 0 ? (
          <Empty>You have not applied to a campaign yet.</Empty>
        ) : (
          <ul className="space-y-2">
            {applications.map((application) => (
              <li key={application.id} className="rounded-xl border border-border bg-white px-4 py-3 dark:bg-surface-dark">
                <div className="flex items-center justify-between gap-2">
                  <p className="font-semibold text-slate-900 dark:text-white">{application.campaignTitle || "Campaign"}</p>
                  <span className="text-[11px] font-bold uppercase text-slate-500">{application.status}</span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">Earnings and messages</h2>
        <Empty>Earnings are not available yet. Messaging is not available yet.</Empty>
      </section>
    </div>
  );
}
