"use client";

import { AppLayout } from "@/components/layout/AppLayout";
import { api } from "@/lib/api";
import { formatInrBand } from "@lynk/shared";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

type Campaign = { id: string; title: string; status: string; payMin: string; payMax: string };
type Application = { id: string; campaignId: string; status: string; influencerName?: string };

export default function CampaignAnalyticsPage() {
  const params = useParams<{ id: string }>();
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [applications, setApplications] = useState<Application[]>([]);

  useEffect(() => {
    void api.get<Campaign>(`/api/campaigns/${params.id}`).then((response) => setCampaign(response.data));
    void api.get<Application[]>("/api/applications").then((response) => {
      setApplications(response.data.filter((row) => row.campaignId === params.id));
    });
  }, [params.id]);

  const counts = applications.reduce<Record<string, number>>((acc, row) => {
    acc[row.status] = (acc[row.status] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <AppLayout variant="brand" activeTab="Campaigns">
      <div className="mx-auto max-w-3xl space-y-4 px-4 py-8">
        <Link href="/brand/campaigns" className="text-sm font-semibold text-primary">Campaigns</Link>
        <h1 className="text-2xl font-bold">{campaign?.title ?? "Campaign"}</h1>
        <p className="text-sm text-slate-500">
          Status: {campaign?.status ?? "…"}. Pay band {campaign ? formatInrBand(campaign.payMin, campaign.payMax) : "—"}.
        </p>
        <p className="text-sm text-slate-600">
          Lynk does not invent reach or ROI. These counts are the applications stored for this campaign.
        </p>
        {applications.length === 0 ? <p className="text-sm text-slate-500">No applications yet.</p> : null}
        <ul className="space-y-2">
          {Object.entries(counts).map(([status, count]) => (
            <li key={status} className="text-sm">{status}: {count}</li>
          ))}
        </ul>
        <ul className="space-y-2">
          {applications.map((row) => (
            <li key={row.id}>
              <Link href={`/collab/${row.id}`} className="text-sm font-semibold text-primary">
                {row.influencerName ?? "Creator"} · {row.status}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </AppLayout>
  );
}
