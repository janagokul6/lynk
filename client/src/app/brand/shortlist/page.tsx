"use client";

import { AppLayout } from "@/components/layout/AppLayout";
import { api } from "@/lib/api";
import { formatInr } from "@lynk/shared";
import Link from "next/link";
import { useEffect, useState } from "react";

type Item = {
  id: string;
  creatorId: string;
  creator: {
    handle: string;
    displayName: string;
    platform: string;
    followerCount: number | null;
    engagementRate: number | null;
    niches: string[];
    country: string | null;
  };
};

export default function ShortlistPage() {
  const [items, setItems] = useState<Item[] | null>(null);

  useEffect(() => {
    void api.get<{ items: Item[] }>("/api/shortlist").then((response) => setItems(response.data.items));
  }, []);

  return (
    <AppLayout variant="brand" activeTab="Discover">
      <div className="mx-auto max-w-4xl space-y-4 px-4 py-8">
        <h1 className="text-2xl font-bold">Shortlist</h1>
        <p className="text-sm text-slate-500">These are creators you saved. Figures come from their profiles.</p>
        {items == null ? <p className="text-sm text-slate-500">Loading…</p> : null}
        {items?.length === 0 ? <p className="text-sm text-slate-500">Your shortlist is empty.</p> : null}
        <div className="grid gap-3 md:grid-cols-2">
          {items?.map((item) => (
            <article key={item.id} className="rounded-2xl border border-border p-4">
              <h2 className="font-semibold">{item.creator.displayName}</h2>
              <p className="text-sm text-slate-500">@{item.creator.handle} · {item.creator.platform}</p>
              <p className="mt-2 text-sm">Followers: {item.creator.followerCount ?? "—"}</p>
              <p className="text-sm">Engagement: {item.creator.engagementRate ?? "—"}%</p>
              <p className="text-sm">Location: {item.creator.country ?? "—"}</p>
              <p className="text-sm">{item.creator.niches.join(", ") || "No niches stored"}</p>
              <Link href={`/creators/${item.creatorId}`} className="mt-3 inline-block text-sm font-semibold text-primary">View profile</Link>
            </article>
          ))}
        </div>
        <p className="text-xs text-slate-500">Rates, when a creator has set them, are in INR ({formatInr(1000)} is one thousand rupees).</p>
      </div>
    </AppLayout>
  );
}
