"use client";

import { AppLayout } from "@/components/layout/AppLayout";
import { Icon } from "@/components/ui/Icon";
import { api } from "@/lib/api";
import type { Campaign, CreateCampaignPayload } from "@/types";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

const DEFAULT_FORM = {
  title: "",
  campaignType: "Social Media Integration / Video",
  niches: [] as string[],
  description: "",
  guidelines: "",
  deliverables: [] as string[],
  platforms: [] as string[],
  followerRange: "Micro (10k - 100k)",
  minEngagement: "3",
  location: "Global (Anywhere)",
  minAge: "18",
  maxAge: "35",
  compensationType: "Fixed Payment",
  payMin: "500",
  payMax: "1000",
  totalBudget: "10000",
  creatorsNeeded: "10",
  perks: [] as string[],
  applicationDeadline: "",
  startDate: "",
  endDate: "",
};

function campaignToFormData(c: Campaign): typeof DEFAULT_FORM {
  return {
    title: c.title,
    campaignType: c.campaignType,
    niches: c.niches ?? [],
    description: c.description,
    guidelines: c.guidelines ?? "",
    deliverables: c.deliverables ?? [],
    platforms: c.platforms ?? [],
    followerRange: c.followerRange ?? DEFAULT_FORM.followerRange,
    minEngagement: c.minEngagement ?? "3",
    location: c.location ?? DEFAULT_FORM.location,
    minAge: c.minAge != null ? String(c.minAge) : "18",
    maxAge: c.maxAge != null ? String(c.maxAge) : "35",
    compensationType: c.compensationType,
    payMin: c.payMin,
    payMax: c.payMax,
    totalBudget: c.totalBudget ?? "10000",
    creatorsNeeded: c.creatorsNeeded != null ? String(c.creatorsNeeded) : "10",
    perks: c.perks ?? [],
    applicationDeadline: c.applicationDeadline ?? "",
    startDate: c.startDate ?? "",
    endDate: c.endDate ?? "",
  };
}

function formDataToPayload(formData: typeof DEFAULT_FORM): CreateCampaignPayload {
  return {
    title: formData.title.trim(),
    campaignType: formData.campaignType,
    description: formData.description.trim(),
    guidelines: formData.guidelines.trim() || undefined,
    niches: formData.niches,
    platforms: formData.platforms,
    deliverables: formData.deliverables,
    perks: formData.perks,
    followerRange: formData.followerRange,
    minEngagement: formData.minEngagement,
    location: formData.location,
    minAge: formData.minAge ? parseInt(formData.minAge, 10) : undefined,
    maxAge: formData.maxAge ? parseInt(formData.maxAge, 10) : undefined,
    compensationType: formData.compensationType,
    payMin: formData.payMin,
    payMax: formData.payMax,
    totalBudget: formData.totalBudget,
    creatorsNeeded: formData.creatorsNeeded ? parseInt(formData.creatorsNeeded, 10) : undefined,
    applicationDeadline: formData.applicationDeadline || undefined,
    startDate: formData.startDate || undefined,
    endDate: formData.endDate || undefined,
  };
}

export default function EditCampaignPage() {
  const params = useParams();
  const id = typeof params.id === "string" ? params.id : "";
  const router = useRouter();
  const [formData, setFormData] = useState(DEFAULT_FORM);
  const [loading, setLoading] = useState(!!id);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<"draft" | "live" | "completed">("draft");

  useEffect(() => {
    if (!id) return;
    api
      .get<Campaign>(`/api/campaigns/${id}`)
      .then((res) => {
        const c = res.data;
        if (c) {
          setFormData(campaignToFormData(c));
          setStatus(c.status as "draft" | "live" | "completed");
        }
      })
      .catch(() => setError("Failed to load campaign"))
      .finally(() => setLoading(false));
  }, [id]);

  const updateField = useCallback((field: string, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }, []);

  const handleSave = async () => {
    if (!id || submitting) return;
    setError(null);
    setSubmitting(true);
    try {
      await api.patch(`/api/campaigns/${id}`, formDataToPayload(formData));
      router.push("/brand/campaigns");
    } catch {
      setError("Failed to save");
      setSubmitting(false);
    }
  };

  const handlePublish = async () => {
    if (!id || submitting) return;
    setError(null);
    setSubmitting(true);
    try {
      await api.post(`/api/campaigns/${id}/publish`);
      setStatus("live");
      router.push("/brand/campaigns");
    } catch {
      setError("Failed to publish");
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <AppLayout variant="brand" activeTab="Campaigns">
        <div className="p-8 text-center text-text-muted">Loading…</div>
      </AppLayout>
    );
  }

  if (error && !formData.title) {
    return (
      <AppLayout variant="brand" activeTab="Campaigns">
        <div className="p-8 text-center">
          <p className="text-destructive">{error}</p>
          <Link href="/brand/campaigns" className="mt-4 inline-block text-primary font-medium">
            Back to campaigns
          </Link>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout
      variant="brand"
      activeTab="Campaigns"
      header={
        <div className="bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-md border-b border-border sticky top-0 z-40">
          <div className="flex items-center justify-between px-4 lg:px-8 py-4 max-w-screen-2xl mx-auto">
            <div className="flex items-center gap-4">
              <Link
                href="/brand/campaigns"
                className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-surface-hover text-text-muted transition-colors border border-border bg-surface"
                aria-label="Back to campaigns"
              >
                <Icon name="arrow_back" size={20} />
              </Link>
              <div>
                <h1 className="text-xl font-extrabold tracking-tight text-text">Edit Campaign</h1>
                <p className="text-sm font-medium text-text-muted mt-0.5">{formData.title || id}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {error && <span className="text-sm text-destructive">{error}</span>}
              <button
                type="button"
                onClick={handleSave}
                disabled={submitting}
                className="hidden sm:block px-5 py-2.5 rounded-xl font-bold text-text-muted bg-surface border border-border hover:bg-surface-hover transition-colors disabled:opacity-50"
              >
                {submitting ? "Saving…" : "Save"}
              </button>
              {status === "draft" && (
                <button
                  type="button"
                  onClick={handlePublish}
                  disabled={submitting}
                  className="px-5 py-2.5 rounded-xl font-bold text-white bg-primary hover:bg-primary/90 shadow-lg shadow-primary/25 transition-all disabled:opacity-50"
                >
                  {submitting ? "Publishing…" : "Publish to marketplace"}
                </button>
              )}
            </div>
          </div>
        </div>
      }
    >
      <div className="w-full max-w-screen-2xl mx-auto px-4 lg:px-8 py-6 lg:py-10">
        <div className="max-w-xl space-y-6">
          <section className="bg-surface border border-border rounded-3xl p-6 shadow-sm">
            <label className="block text-sm font-bold text-text mb-2">Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => updateField("title", e.target.value)}
              className="w-full bg-surface-subtle border border-border rounded-xl px-4 py-3 text-text font-medium"
            />
          </section>
          <section className="bg-surface border border-border rounded-3xl p-6 shadow-sm">
            <label className="block text-sm font-bold text-text mb-2">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => updateField("description", e.target.value)}
              rows={4}
              className="w-full bg-surface-subtle border border-border rounded-xl px-4 py-3 text-text font-medium"
            />
          </section>
          <section className="bg-surface border border-border rounded-3xl p-6 shadow-sm">
            <label className="block text-sm font-bold text-text mb-2">Pay band (₹)</label>
            <div className="flex gap-3">
              <input
                type="number"
                value={formData.payMin}
                onChange={(e) => updateField("payMin", e.target.value)}
                className="w-full bg-surface-subtle border border-border rounded-xl px-4 py-3 text-text font-bold"
              />
              <span className="self-center text-text-muted">–</span>
              <input
                type="number"
                value={formData.payMax}
                onChange={(e) => updateField("payMax", e.target.value)}
                className="w-full bg-surface-subtle border border-border rounded-xl px-4 py-3 text-text font-bold"
              />
            </div>
          </section>
          <p className="text-sm text-text-muted">
            For full editing (deliverables, timeline, etc.) use the create flow and republish.
          </p>
        </div>
      </div>
    </AppLayout>
  );
}
