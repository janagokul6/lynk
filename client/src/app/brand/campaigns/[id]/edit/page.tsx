"use client";

import { AppLayout } from "@/components/layout/AppLayout";
import { api } from "@/lib/api";
import type { Campaign } from "@/types";
import { CATEGORIES, LOCATIONS, PLATFORMS, WORK_TYPES } from "@/types";
import { DISCLOSURE_CHECKS } from "@lynk/shared";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const CAMPAIGN_TYPES = ["Sponsored Post", "Product Review / Unboxing", "Social Media Integration / Video", "Affiliate Partnership"];

export default function EditCampaignPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api
      .get<Campaign>(`/api/campaigns/${params.id}`)
      .then((response) => setCampaign(response.data))
      .catch(() => setError("Could not load this campaign"));
  }, [params.id]);

  function update<K extends keyof Campaign>(key: K, value: Campaign[K]) {
    setCampaign((current) => (current ? { ...current, [key]: value } : current));
  }

  function toggle(key: "niches" | "platforms" | "deliverables" | "disclosureChecks", value: string) {
    setCampaign((current) => {
      if (!current) return current;
      const list = (current[key] ?? []) as string[];
      const next = list.includes(value) ? list.filter((item) => item !== value) : [...list, value];
      return { ...current, [key]: next };
    });
  }

  async function save(publish: boolean) {
    if (!campaign) return;
    setSaving(true);
    setError(null);
    try {
      await api.patch(`/api/campaigns/${campaign.id}`, {
        title: campaign.title,
        campaignType: campaign.campaignType,
        description: campaign.description,
        guidelines: campaign.guidelines ?? "",
        niches: campaign.niches,
        platforms: campaign.platforms,
        deliverables: campaign.deliverables,
        perks: campaign.perks,
        location: campaign.location ?? undefined,
        compensationType: campaign.compensationType,
        payMin: campaign.payMin,
        payMax: campaign.payMax,
        totalBudget: campaign.totalBudget ?? undefined,
        creatorsNeeded: campaign.creatorsNeeded ?? undefined,
        applicationDeadline: campaign.applicationDeadline ?? undefined,
        startDate: campaign.startDate ?? undefined,
        endDate: campaign.endDate ?? undefined,
        brandName: campaign.brandName ?? undefined,
        disclosureChecks: campaign.disclosureChecks ?? [],
      });
      if (publish && campaign.status === "draft") {
        await api.post(`/api/campaigns/${campaign.id}/publish`);
      }
      router.push("/brand/campaigns");
    } catch {
      setError("Could not save this campaign");
      setSaving(false);
    }
  }

  return (
    <AppLayout variant="brand" activeTab="Campaigns">
      <div className="mx-auto w-full max-w-3xl space-y-6 px-4 py-8">
        <Link href="/brand/campaigns" className="text-sm font-semibold text-primary">
          Back to campaigns
        </Link>
        <h1 className="text-2xl font-bold">Edit campaign</h1>
        {!campaign && !error ? <p className="text-sm text-slate-500">Loading…</p> : null}
        {error ? <p className="text-sm text-red-600">{error}</p> : null}
        {campaign ? (
          <form
            className="space-y-4"
            onSubmit={(event) => {
              event.preventDefault();
              void save(false);
            }}
          >
            <label className="block text-sm font-semibold">
              Title
              <input className="mt-1 w-full rounded-xl border border-border px-3 py-2" value={campaign.title} onChange={(event) => update("title", event.target.value)} required />
            </label>
            <label className="block text-sm font-semibold">
              Type
              <select className="mt-1 w-full rounded-xl border border-border px-3 py-2" value={campaign.campaignType} onChange={(event) => update("campaignType", event.target.value)}>
                {CAMPAIGN_TYPES.map((type) => (
                  <option key={type}>{type}</option>
                ))}
              </select>
            </label>
            <label className="block text-sm font-semibold">
              Description
              <textarea className="mt-1 w-full rounded-xl border border-border px-3 py-2" rows={4} value={campaign.description} onChange={(event) => update("description", event.target.value)} required />
            </label>
            <label className="block text-sm font-semibold">
              Guidelines
              <textarea className="mt-1 w-full rounded-xl border border-border px-3 py-2" rows={3} value={campaign.guidelines ?? ""} onChange={(event) => update("guidelines", event.target.value)} />
            </label>
            <fieldset>
              <legend className="text-sm font-semibold">Niches</legend>
              <div className="mt-2 flex flex-wrap gap-2">
                {CATEGORIES.map((item) => (
                  <label key={item} className="flex items-center gap-2 text-sm">
                    <input type="checkbox" checked={campaign.niches.includes(item)} onChange={() => toggle("niches", item)} />
                    {item}
                  </label>
                ))}
              </div>
            </fieldset>
            <fieldset>
              <legend className="text-sm font-semibold">Platforms</legend>
              <div className="mt-2 flex flex-wrap gap-2">
                {PLATFORMS.map((item) => (
                  <label key={item} className="flex items-center gap-2 text-sm">
                    <input type="checkbox" checked={campaign.platforms.includes(item)} onChange={() => toggle("platforms", item)} />
                    {item}
                  </label>
                ))}
              </div>
            </fieldset>
            <fieldset>
              <legend className="text-sm font-semibold">Deliverables</legend>
              <div className="mt-2 flex flex-wrap gap-2">
                {WORK_TYPES.map((item) => (
                  <label key={item} className="flex items-center gap-2 text-sm">
                    <input type="checkbox" checked={campaign.deliverables.includes(item)} onChange={() => toggle("deliverables", item)} />
                    {item}
                  </label>
                ))}
              </div>
            </fieldset>
            <label className="block text-sm font-semibold">
              Location
              <select className="mt-1 w-full rounded-xl border border-border px-3 py-2" value={campaign.location ?? "Remote"} onChange={(event) => update("location", event.target.value)}>
                {LOCATIONS.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </label>
            <div className="grid grid-cols-2 gap-3">
              <label className="text-sm font-semibold">
                Pay min (INR)
                <input className="mt-1 w-full rounded-xl border border-border px-3 py-2" value={campaign.payMin} onChange={(event) => update("payMin", event.target.value)} required />
              </label>
              <label className="text-sm font-semibold">
                Pay max (INR)
                <input className="mt-1 w-full rounded-xl border border-border px-3 py-2" value={campaign.payMax} onChange={(event) => update("payMax", event.target.value)} required />
              </label>
            </div>
            <label className="block text-sm font-semibold">
              Brand name
              <input className="mt-1 w-full rounded-xl border border-border px-3 py-2" value={campaign.brandName ?? ""} onChange={(event) => update("brandName", event.target.value)} />
            </label>
            <div className="grid grid-cols-3 gap-3">
              <label className="text-sm font-semibold">
                Deadline
                <input type="date" className="mt-1 w-full rounded-xl border border-border px-3 py-2" value={campaign.applicationDeadline ?? ""} onChange={(event) => update("applicationDeadline", event.target.value)} />
              </label>
              <label className="text-sm font-semibold">
                Start
                <input type="date" className="mt-1 w-full rounded-xl border border-border px-3 py-2" value={campaign.startDate ?? ""} onChange={(event) => update("startDate", event.target.value)} />
              </label>
              <label className="text-sm font-semibold">
                End
                <input type="date" className="mt-1 w-full rounded-xl border border-border px-3 py-2" value={campaign.endDate ?? ""} onChange={(event) => update("endDate", event.target.value)} />
              </label>
            </div>
            <fieldset className="space-y-2">
              <legend className="text-sm font-semibold">FTC and ASCI disclosure</legend>
              {DISCLOSURE_CHECKS.map((item) => (
                <label key={item.id} className="flex items-start gap-2 text-sm">
                  <input type="checkbox" className="mt-1" checked={(campaign.disclosureChecks ?? []).includes(item.id)} onChange={() => toggle("disclosureChecks", item.id)} />
                  <span>{item.label}</span>
                </label>
              ))}
            </fieldset>
            <div className="flex gap-3">
              <button type="submit" disabled={saving} className="rounded-xl border border-border px-4 py-2 text-sm font-bold">
                Save
              </button>
              {campaign.status === "draft" ? (
                <button type="button" disabled={saving} className="rounded-xl bg-primary px-4 py-2 text-sm font-bold text-white" onClick={() => void save(true)}>
                  Publish to marketplace
                </button>
              ) : null}
            </div>
          </form>
        ) : null}
      </div>
    </AppLayout>
  );
}
