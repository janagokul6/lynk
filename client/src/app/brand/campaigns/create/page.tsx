"use client";

import { AppLayout } from "@/components/layout/AppLayout";
import { Icon } from "@/components/ui/Icon";
import { api } from "@/lib/api";
import type { CreateCampaignPayload, Campaign } from "@/types";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

// Types and Options mirroring Marketplace
const CAMPAIGN_TYPES = [
  "Product Review / Unboxing",
  "Social Media Integration / Video",
  "Sponsored Post",
  "Affiliate Partnership"
];

const NICHES = [
  "Fitness", "Beauty", "Wellness", "Tech", "Lifestyle", "Gaming", "Food"
];

const PLATFORMS = ["Instagram", "YouTube", "X"];
const FOLLOWER_RANGES = ["Nano (1k - 10k)", "Micro (10k - 100k)", "Macro (100k - 500k)", "Mega (500k+)"];
const LOCATIONS = ["Global (Anywhere)", "US Only", "UK", "Europe"];
const COMPENSATION_TYPES = ["Fixed Payment", "Product / Barter", "Affiliate", "Hybrid"];

const DELIVERABLE_OPTIONS = [
  "Instagram Post",
  "Reels / Shorts",
  "Instagram Stories",
  "Product Feature Video",
  "In-Video Ad",
  "Dedicated Video",
  "Multi-Platform Integration",
  "UGC",
  "Brand Ambassador",
  "Representative / Spokesperson",
  "Unboxing / Review",
  "Affiliate / Link in Bio",
];

export default function CreateCampaignPage() {
  const [formData, setFormData] = useState({
    title: "Summer Fitness Product Launch - UGC",
    campaignType: "Social Media Integration / Video",
    niches: ["Fitness", "Wellness"],
    description: "We're launching a new line of premium fitness supplements and looking for authentic fitness creators to create engaging social integration videos.",
    deliverables: ["1 Instagram Reel (15-60 seconds)", "2 Instagram Stories"],
    guidelines: "- Must show product clearly in first 3 seconds\n- Include brand mention and tag",
    platforms: ["Instagram"],
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
    perks: ["Free product sample (~₹150)"],
    applicationDeadline: "2024-06-15",
    startDate: "2024-06-20",
    endDate: "2024-06-30"
  });

  const [customNiche, setCustomNiche] = useState("");
  const [customDeliverable, setCustomDeliverable] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const router = useRouter();

  const buildPayload = (status: "draft" | "live"): CreateCampaignPayload => ({
    status,
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
  });

  const handleSaveDraft = async () => {
    if (submitting) return;
    setSubmitError(null);
    setSubmitting(true);
    try {
      const { data } = await api.post<Campaign>("/api/campaigns", buildPayload("draft"));
      router.push(data?.id ? `/brand/campaigns/${data.id}/edit` : "/brand/campaigns");
    } catch {
      setSubmitError("Failed to save draft");
      setSubmitting(false);
    }
  };

  const handlePublish = async () => {
    if (submitting) return;
    setSubmitError(null);
    setSubmitting(true);
    try {
      const { data } = await api.post<Campaign>("/api/campaigns", buildPayload("live"));
      router.push(data?.id ? `/brand/campaigns/${data.id}/edit` : "/brand/campaigns");
    } catch {
      setSubmitError("Failed to publish");
      setSubmitting(false);
    }
  };

  const updateField = (field: string, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const toggleArrayItem = (field: "niches" | "deliverables" | "platforms" | "perks", item: string) => {
    setFormData((prev) => {
      const arr = prev[field] as string[];
      return {
        ...prev,
        [field]: arr.includes(item) ? arr.filter((i) => i !== item) : [...arr, item],
      };
    });
  };

  const addCustomNiche = () => {
    if (customNiche.trim() && !formData.niches.includes(customNiche.trim())) {
      setFormData((prev) => ({ ...prev, niches: [...prev.niches, customNiche.trim()] }));
    }
    setCustomNiche("");
  };

  const addCustomDeliverable = () => {
    if (customDeliverable.trim() && !formData.deliverables.includes(customDeliverable.trim())) {
      setFormData((prev) => ({ ...prev, deliverables: [...prev.deliverables, customDeliverable.trim()] }));
    }
    setCustomDeliverable("");
  };

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
                <h1 className="text-xl font-extrabold tracking-tight text-text">Launch Campaign</h1>
                <p className="text-sm font-medium text-text-muted mt-0.5">Post an opportunity to the marketplace</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {submitError && (
                <span className="text-sm text-destructive">{submitError}</span>
              )}
              <button
                type="button"
                onClick={handleSaveDraft}
                disabled={submitting}
                className="hidden sm:block px-5 py-2.5 rounded-xl font-bold text-text-muted bg-surface border border-border hover:bg-surface-hover transition-colors disabled:opacity-50"
              >
                {submitting ? "Saving…" : "Save Draft"}
              </button>
              <button
                type="button"
                onClick={handlePublish}
                disabled={submitting}
                className="px-5 py-2.5 rounded-xl font-bold text-white bg-primary hover:bg-primary/90 shadow-lg shadow-primary/25 transition-all disabled:opacity-50"
              >
                {submitting ? "Publishing…" : "Publish"}
              </button>
            </div>
          </div>
        </div>
      }
    >
      <div className="w-full max-w-screen-2xl mx-auto px-4 lg:px-8 py-6 lg:py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* Left Column: Guidelines / Navigation (Sticky) */}
          <div className="hidden lg:block lg:col-span-4 sticky top-32 space-y-6">
            <div className="bg-surface border border-border rounded-3xl p-6 lg:p-8 shadow-sm">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
                <Icon name="rocket_launch" size={28} className="text-primary" />
              </div>
              <h2 className="text-2xl font-bold tracking-tight text-text mb-3">
                Create a high-performing campaign
              </h2>
              <p className="text-sm text-text-muted leading-relaxed mb-6">
                The best campaigns are specific, fair, and offer creative freedom. Ensure your requirements match your budget to attract top-tier creators.
              </p>

              <ul className="space-y-4">
                {[
                  { icon: "check_circle", title: "Be clear about deliverables", text: "Specify lengths, formats, and key messages." },
                  { icon: "currency_rupee", title: "Offer competitive pay", text: "Fair pay bands attract more applicants." },
                  { icon: "group", title: "Set realistic criteria", text: "Don't ask for Mega influencers on a Nano budget." }
                ].map((item, idx) => (
                  <li key={idx} className="flex gap-3 items-start">
                    <Icon name={item.icon} size={20} className="text-primary mt-0.5 shrink-0" />
                    <div>
                      <span className="block text-sm font-bold text-text">{item.title}</span>
                      <span className="block text-xs text-text-muted mt-0.5">{item.text}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right Column: Multi-section Form */}
          <div className="lg:col-span-8 space-y-6 pb-24 lg:pb-10">

            {/* 1. Campaign Basics */}
            <section className="bg-surface border border-border rounded-3xl p-6 lg:p-8 shadow-sm flex flex-col gap-6">
              <div className="flex items-center gap-2 mb-2">
                <Icon name="design_services" size={20} className="text-primary" />
                <h3 className="text-lg font-bold text-text uppercase tracking-wider text-xs">Campaign Basics</h3>
              </div>

              <div>
                <label className="block text-sm font-bold text-text mb-2">Campaign Title <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => updateField("title", e.target.value)}
                  placeholder="e.g. Summer Skincare Routine"
                  className="w-full bg-surface-subtle border border-border rounded-xl px-4 py-3 text-text placeholder:text-text-muted focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all font-medium"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-text mb-3">Campaign Type <span className="text-red-500">*</span></label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {CAMPAIGN_TYPES.map(type => (
                    <label key={type} className={`cursor-pointer flex items-center gap-3 p-3 rounded-xl border transition-all ${formData.campaignType === type ? "border-primary bg-primary/5 shadow-sm" : "border-border bg-surface-subtle hover:border-text-muted/30"}`}>
                      <input
                        type="radio"
                        name="campaignType"
                        checked={formData.campaignType === type}
                        onChange={() => updateField("campaignType", type)}
                        className="w-4 h-4 text-primary bg-surface-subtle border-border focus:ring-primary focus:ring-offset-background"
                      />
                      <span className={`text-sm font-medium ${formData.campaignType === type ? "text-primary font-bold" : "text-text"}`}>{type}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-text mb-3">Primary Niche <span className="text-red-500">*</span></label>
                <div className="flex flex-wrap gap-2">
                  {NICHES.map(niche => (
                    <button
                      key={niche}
                      onClick={() => toggleArrayItem("niches", niche)}
                      className={`px-4 py-2 rounded-full text-sm font-bold border transition-all ${formData.niches.includes(niche) ? "bg-primary text-white border-primary shadow-md shadow-primary/20" : "bg-surface-subtle border-border text-text-muted hover:text-text hover:border-text-muted/30"}`}
                    >
                      {niche} {formData.niches.includes(niche) && "✓"}
                    </button>
                  ))}
                </div>
                <div className="flex items-center gap-2 mt-3 w-full sm:max-w-xs">
                  <input
                    type="text"
                    value={customNiche}
                    onChange={(e) => setCustomNiche(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addCustomNiche())}
                    placeholder="Custom niche..."
                    className="flex-1 bg-surface-subtle border border-border rounded-lg px-3 py-1.5 text-sm text-text placeholder:text-text-muted outline-none focus:border-primary transition-colors font-medium"
                  />
                  <button
                    onClick={addCustomNiche}
                    className="px-3 py-1.5 rounded-lg text-sm font-bold bg-surface border border-border text-text-muted hover:text-text hover:bg-surface-subtle flex items-center gap-1 transition-colors"
                  >
                    <Icon name="add" size={16} /> Add
                  </button>
                </div>
              </div>
            </section>

            {/* 2. Campaign Description */}
            <section className="bg-surface border border-border rounded-3xl p-6 lg:p-8 shadow-sm flex flex-col gap-6">
              <div className="flex items-center gap-2 mb-2">
                <Icon name="description" size={20} className="text-primary" />
                <h3 className="text-lg font-bold text-text uppercase tracking-wider text-xs">Campaign Description</h3>
              </div>

              <div className="relative group">
                <div className="flex items-center gap-2 p-2 border border-b-0 border-border rounded-t-xl bg-surface-subtle">
                  {["format_bold", "format_italic", "link", "format_list_bulleted", "code"].map((icon, i) => (
                    <button key={i} className="p-1.5 text-text-muted hover:text-text hover:bg-border rounded">
                      <Icon name={icon} size={18} />
                    </button>
                  ))}
                  <div className="flex-1" />
                  <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-xs font-bold hover:bg-primary/20 transition-colors">
                    <Icon name="auto_awesome" size={14} /> AI Enhance
                  </button>
                </div>
                <textarea
                  value={formData.description}
                  onChange={(e) => updateField("description", e.target.value)}
                  rows={4}
                  className="w-full bg-surface border border-border rounded-b-xl px-4 py-3 text-text placeholder:text-text-muted focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all resize-y font-medium text-sm leading-relaxed"
                  placeholder="Describe your brand and what you are looking for..."
                />
              </div>
            </section>

            {/* 3. Deliverables & Content Guidelines */}
            <section className="bg-surface border border-border rounded-3xl p-6 lg:p-8 shadow-sm flex flex-col gap-6">
              <div className="flex items-center gap-2 mb-2">
                <Icon name="perm_media" size={20} className="text-primary" />
                <h3 className="text-lg font-bold text-text uppercase tracking-wider text-xs">Deliverables & Content Guidelines</h3>
              </div>

              <div>
                <label className="block text-sm font-bold text-text mb-3">Required Deliverables <span className="text-red-500">*</span></label>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                  {DELIVERABLE_OPTIONS.map(item => (
                    <label key={item} className={`flex items-center gap-3 p-3 rounded-xl border transition-all cursor-pointer ${formData.deliverables.includes(item) ? "border-primary bg-primary/5" : "border-border bg-surface-subtle/50 hover:bg-surface-subtle"}`}>
                      <input
                        type="checkbox"
                        checked={formData.deliverables.includes(item)}
                        onChange={() => toggleArrayItem("deliverables", item)}
                        className="w-4.5 h-4.5 rounded border-border text-primary focus:ring-primary focus:ring-offset-background bg-surface"
                      />
                      <span className={`text-sm font-medium ${formData.deliverables.includes(item) ? "text-text font-bold" : "text-text-muted"}`}>{item}</span>
                    </label>
                  ))}
                  {/* Render any manually added custom deliverables that aren't in the default set */}
                  {formData.deliverables.filter(d => !DELIVERABLE_OPTIONS.includes(d)).map(customItem => (
                    <label key={customItem} className="flex items-center gap-3 p-3 rounded-xl border transition-all cursor-pointer border-primary bg-primary/5">
                      <input
                        type="checkbox"
                        checked={true}
                        onChange={() => toggleArrayItem("deliverables", customItem)}
                        className="w-4.5 h-4.5 rounded border-border text-primary focus:ring-primary focus:ring-offset-background bg-surface"
                      />
                      <span className="text-sm font-medium text-text font-bold">{customItem}</span>
                    </label>
                  ))}
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-2 mt-4 max-w-lg">
                  <input
                    type="text"
                    value={customDeliverable}
                    onChange={(e) => setCustomDeliverable(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addCustomDeliverable())}
                    placeholder="E.g. 1 Blog Post"
                    className="w-full sm:flex-1 bg-surface-subtle border border-border rounded-lg px-4 py-2.5 text-sm text-text placeholder:text-text-muted outline-none focus:border-primary transition-colors font-medium"
                  />
                  <button
                    onClick={addCustomDeliverable}
                    className="w-full sm:w-auto px-4 py-2.5 rounded-lg text-sm font-bold bg-primary/10 text-primary hover:bg-primary/20 flex items-center justify-center gap-1 transition-colors whitespace-nowrap"
                  >
                    <Icon name="add_circle" size={16} /> Add Custom
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-text mb-2">Content Guidelines</label>
                <textarea
                  value={formData.guidelines}
                  onChange={(e) => updateField("guidelines", e.target.value)}
                  rows={3}
                  className="w-full bg-surface-subtle border border-border rounded-xl px-4 py-3 text-text placeholder:text-text-muted focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all font-mono text-xs leading-relaxed"
                  placeholder="- Must show product clearly in first 3 seconds&#10;- Include brand mention and tag"
                />
              </div>

              <div className="pt-2">
                <button className="w-full py-4 border-2 border-dashed border-border rounded-xl flex flex-col items-center justify-center gap-2 text-text-muted hover:text-text hover:border-text-muted/50 hover:bg-surface-subtle transition-all">
                  <Icon name="cloud_upload" size={24} />
                  <span className="text-sm font-bold">Upload Brand Assets</span>
                  <span className="text-xs">Moodboards, logos, or product images (Max 50MB)</span>
                </button>
              </div>
            </section>

            {/* 4. Influencer Criteria */}
            <section className="bg-surface border border-border rounded-3xl p-6 lg:p-8 shadow-sm flex flex-col gap-6">
              <div className="flex items-center gap-2 mb-2">
                <Icon name="group_add" size={20} className="text-primary" />
                <h3 className="text-lg font-bold text-text uppercase tracking-wider text-xs">Influencer Criteria</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-text mb-3">Platform Preference</label>
                  <div className="flex flex-wrap gap-2">
                    {PLATFORMS.map(platform => (
                      <button
                        key={platform}
                        onClick={() => toggleArrayItem("platforms", platform)}
                        className={`px-3 py-1.5 rounded-lg text-sm font-bold border transition-all flex items-center gap-1.5 ${formData.platforms.includes(platform) ? "bg-text text-background border-text" : "bg-surface-subtle border-border text-text-muted hover:text-text"}`}
                      >
                        {formData.platforms.includes(platform) && <Icon name="check" size={14} />} {platform}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-text mb-3">Follower Range</label>
                  <select
                    value={formData.followerRange}
                    onChange={(e) => updateField("followerRange", e.target.value)}
                    className="w-full bg-surface-subtle border border-border rounded-xl px-4 py-2.5 text-text focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all font-medium appearance-none"
                  >
                    {FOLLOWER_RANGES.map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-text mb-3">Min. Engagement Rate <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <input
                      type="number"
                      value={formData.minEngagement}
                      onChange={(e) => updateField("minEngagement", e.target.value)}
                      className="w-full bg-surface-subtle border border-border rounded-xl px-4 py-2.5 text-text focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all font-medium"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted font-bold">%</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-text mb-3">Location <span className="text-red-500">*</span></label>
                  <select
                    value={formData.location}
                    onChange={(e) => updateField("location", e.target.value)}
                    className="w-full bg-surface-subtle border border-border rounded-xl px-4 py-2.5 text-text focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all font-medium appearance-none"
                  >
                    {LOCATIONS.map(l => <option key={l} value={l}>{l}</option>)}
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-sm font-bold text-text mb-3">Audience Age</label>
                  <div className="flex items-center gap-4">
                    <div className="relative flex-1">
                      <input type="number" value={formData.minAge} onChange={(e) => updateField("minAge", e.target.value)} className="w-full bg-surface-subtle border border-border rounded-xl pl-4 pr-10 py-2.5 text-text font-medium text-center" />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted text-xs">yrs</span>
                    </div>
                    <span className="text-text-muted font-bold">to</span>
                    <div className="relative flex-1">
                      <input type="number" value={formData.maxAge} onChange={(e) => updateField("maxAge", e.target.value)} className="w-full bg-surface-subtle border border-border rounded-xl pl-4 pr-10 py-2.5 text-text font-medium text-center" />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted text-xs">yrs</span>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* 5. Budget & Compensation */}
            <section className="bg-surface border border-border rounded-3xl p-6 lg:p-8 shadow-sm flex flex-col gap-6">
              <div className="flex items-center gap-2 mb-2">
                <Icon name="currency_rupee" size={20} className="text-primary" />
                <h3 className="text-lg font-bold text-text uppercase tracking-wider text-xs">Budget & Compensation</h3>
              </div>

              <div>
                <label className="block text-sm font-bold text-text mb-3">Compensation Type <span className="text-red-500">*</span></label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {COMPENSATION_TYPES.map(type => (
                    <label key={type} className={`cursor-pointer flex flex-col items-center text-center justify-center gap-2 p-3 rounded-xl border transition-all ${formData.compensationType === type ? "border-primary bg-primary/5 shadow-sm text-primary" : "border-border bg-surface-subtle text-text hover:border-text-muted/30"}`}>
                      <input
                        type="radio"
                        name="compensationType"
                        checked={formData.compensationType === type}
                        onChange={() => updateField("compensationType", type)}
                        className="sr-only"
                      />
                      <Icon name={type === "Fixed Payment" ? "currency_rupee" : type === "Affiliate" ? "link" : type === "Hybrid" ? "join_inner" : "card_giftcard"} size={24} className={formData.compensationType === type ? "text-primary" : "text-text-muted"} />
                      <span className="text-xs font-bold leading-tight">{type}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-text mb-3">Budget per Influencer (Band)</label>
                  <div className="flex items-center gap-3">
                    <div className="relative flex-1">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted font-bold">₹</span>
                      <input type="number" value={formData.payMin} onChange={(e) => updateField("payMin", e.target.value)} className="w-full bg-surface-subtle border border-border rounded-xl pl-8 pr-4 py-3 text-text font-bold" />
                    </div>
                    <span className="text-text-muted font-bold">-</span>
                    <div className="relative flex-1">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted font-bold">₹</span>
                      <input type="number" value={formData.payMax} onChange={(e) => updateField("payMax", e.target.value)} className="w-full bg-surface-subtle border border-border rounded-xl pl-8 pr-4 py-3 text-text font-bold" />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-text mb-3">Total Budget</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted font-bold">₹</span>
                      <input type="number" value={formData.totalBudget} onChange={(e) => updateField("totalBudget", e.target.value)} className="w-full bg-surface-subtle border border-border rounded-xl pl-8 pr-4 py-3 text-text font-bold" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-text mb-3">Creators</label>
                    <input type="number" value={formData.creatorsNeeded} onChange={(e) => updateField("creatorsNeeded", e.target.value)} className="w-full bg-surface-subtle border border-border rounded-xl px-4 py-3 text-text font-bold text-center" />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-text mb-3">Additional Perks</label>
                <div className="flex flex-col gap-2">
                  {["Free product sample (~₹150)", "Affiliate commission (10%)", "Long-term partnership potential"].map(item => (
                    <label key={item} className={`flex items-center gap-3 p-3 rounded-xl border transition-all cursor-pointer ${formData.perks.includes(item) ? "border-primary bg-primary/5" : "border-border bg-surface-subtle/50 hover:bg-surface-subtle"}`}>
                      <input
                        type="checkbox"
                        checked={formData.perks.includes(item)}
                        onChange={() => toggleArrayItem("perks", item)}
                        className="w-4.5 h-4.5 rounded border-border text-primary focus:ring-primary focus:ring-offset-background bg-surface"
                      />
                      <span className={`text-sm font-medium ${formData.perks.includes(item) ? "text-text font-bold" : "text-text-muted"}`}>{item}</span>
                    </label>
                  ))}
                </div>
              </div>
            </section>

            {/* 6. Timeline */}
            <section className="bg-surface border border-border rounded-3xl p-6 lg:p-8 shadow-sm flex flex-col gap-6">
              <div className="flex items-center gap-2 mb-2">
                <Icon name="event" size={20} className="text-primary" />
                <h3 className="text-lg font-bold text-text uppercase tracking-wider text-xs">Timeline</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-bold text-text mb-2">Application Deadline</label>
                  <input type="date" value={formData.applicationDeadline} onChange={(e) => updateField("applicationDeadline", e.target.value)} className="w-full bg-surface-subtle border border-border rounded-xl px-4 py-2.5 text-text font-medium" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-text mb-2">Start Date</label>
                  <input type="date" value={formData.startDate} onChange={(e) => updateField("startDate", e.target.value)} className="w-full bg-surface-subtle border border-border rounded-xl px-4 py-2.5 text-text font-medium" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-text mb-2">End Date</label>
                  <input type="date" value={formData.endDate} onChange={(e) => updateField("endDate", e.target.value)} className="w-full bg-surface-subtle border border-border rounded-xl px-4 py-2.5 text-text font-medium" />
                </div>
              </div>
            </section>

          </div>
        </div>
      </div>
    </AppLayout>
  );
}
