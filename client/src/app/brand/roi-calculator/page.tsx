"use client";

import { AppLayout } from "@/components/layout/AppLayout";
import { estimateRoi, formatInr } from "@lynk/shared";
import { useMemo, useState } from "react";

export default function RoiCalculatorPage() {
  const [followers, setFollowers] = useState("10000");
  const [rate, setRate] = useState("3.5");
  const [budget, setBudget] = useState("5000");

  const estimate = useMemo(() => {
    const followerCount = Number(followers);
    const engagementRate = Number(rate);
    const amount = Number(budget);
    if (!Number.isFinite(followerCount) || !Number.isFinite(engagementRate)) return null;
    return estimateRoi({
      creators: [
        {
          id: "00000000-0000-4000-8000-000000000001",
          handle: "example",
          displayName: "Example creator",
          followerCount,
          engagementRate,
        },
      ],
      budget: Number.isFinite(amount) && amount > 0 ? amount : null,
      budgetSource: Number.isFinite(amount) && amount > 0 ? "provided" : "missing",
    });
  }, [followers, rate, budget]);

  const combined = estimate?.combined;

  return (
    <AppLayout variant="brand" activeTab="Campaigns">
      <div className="mx-auto max-w-xl space-y-4 px-4 py-8">
        <h1 className="text-2xl font-bold">Cost estimate</h1>
        <p className="text-sm text-slate-600">
          This estimates cost per engagement from numbers you type. It is not a prediction of revenue, and it is not tied to a live campaign.
        </p>
        <label className="block text-sm font-semibold">
          Followers
          <input className="mt-1 w-full rounded-xl border border-border px-3 py-2" value={followers} onChange={(event) => setFollowers(event.target.value)} />
        </label>
        <label className="block text-sm font-semibold">
          Engagement rate
          <input className="mt-1 w-full rounded-xl border border-border px-3 py-2" value={rate} onChange={(event) => setRate(event.target.value)} />
        </label>
        <label className="block text-sm font-semibold">
          Budget (INR)
          <input className="mt-1 w-full rounded-xl border border-border px-3 py-2" value={budget} onChange={(event) => setBudget(event.target.value)} />
        </label>
        {combined?.costPerEngagement ? (
          <p className="text-sm">
            Estimated cost per engagement: {formatInr(combined.costPerEngagement.low)} – {formatInr(combined.costPerEngagement.high)}
          </p>
        ) : (
          <p className="text-sm text-slate-500">Enter a follower count and an engagement rate to see a range.</p>
        )}
        <ul className="list-disc pl-5 text-xs text-slate-500">
          {estimate?.assumptions.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
    </AppLayout>
  );
}
