"use client";

import { AppLayout } from "@/components/layout/AppLayout";
import { Icon } from "@/components/ui/Icon";
import { api } from "@/lib/api";
import type { ApplicationRecord } from "@lynk/shared";
import type { MarketplaceCampaign } from "@/types";
import {
  CATEGORIES,
  COMPENSATION_TYPES,
  DELIVERABLE_TYPES,
  LOCATIONS,
  PLATFORMS,
  SORT_OPTIONS,
  WORK_TYPES,
  type CompensationType,
  type DeliverableType,
  type Location,
  type Platform,
  type SortOption,
  type WorkType,
} from "@/types";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import type { AxiosError } from "axios";

const PAY_BANDS = [
  { label: "Under ₹500", min: 0, max: 500 },
  { label: "₹500 – ₹1k", min: 500, max: 1000 },
  { label: "₹1k – ₹2.5k", min: 1000, max: 2500 },
  { label: "₹2.5k – ₹5k", min: 2500, max: 5000 },
  { label: "₹5k+", min: 5000, max: 999999 },
] as const;

const DEFAULT_ADVANCED = {
  platforms: [] as Platform[],
  categories: [] as string[],
  compensationTypes: [] as CompensationType[],
  payBand: null as { min: number; max: number } | null,
  locations: [] as Location[],
  deliverableTypes: [] as DeliverableType[],
  posted: "Any" as "7" | "30" | "Any",
  verifiedOnly: false,
  minMatchScore: 0,
};

function ApplyControl({
  campaignId,
  role,
  existing,
  state,
  open,
  pitch,
  error,
  onOpen,
  onPitch,
  onCancel,
  onSubmit,
  onWithdraw,
}: {
  campaignId: string;
  role: string | null;
  existing?: ApplicationRecord;
  state?: "submitting" | "applied" | "error";
  open: boolean;
  pitch: string;
  error: string | null;
  onOpen: () => void;
  onPitch: (value: string) => void;
  onCancel: () => void;
  onSubmit: () => void;
  onWithdraw: (applicationId: string) => void;
}) {
  const applied = existing && existing.status !== "withdrawn";
  if (applied && existing) {
    return (
      <div className="space-y-2">
        <p className="text-sm font-semibold text-text">
          Applied · {existing.status}
        </p>
        {existing.status === "pending" && role === "influencer" && (
          <button
            type="button"
            onClick={() => onWithdraw(existing.id)}
            className="w-full py-2.5 rounded-lg font-bold text-sm border border-border text-text hover:bg-surface-hover"
          >
            Withdraw
          </button>
        )}
      </div>
    );
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={onOpen}
        className="w-full py-2.5 rounded-lg font-bold text-sm bg-primary text-white shadow-lg shadow-primary/25"
      >
        Apply Now
      </button>
    );
  }

  if (role !== "influencer") {
    return (
      <p className="text-sm text-destructive">{error ?? "Only influencer accounts can apply."}</p>
    );
  }

  return (
    <form
      className="space-y-2"
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit();
      }}
    >
      <label className="block text-xs font-semibold text-text-muted" htmlFor={`pitch-${campaignId}`}>
        Short pitch
      </label>
      <textarea
        id={`pitch-${campaignId}`}
        value={pitch}
        maxLength={2000}
        onChange={(event) => onPitch(event.target.value)}
        placeholder="Why you're a fit for this campaign"
        className="w-full min-h-20 rounded-lg border border-border bg-surface-subtle px-3 py-2 text-sm text-text"
      />
      {state === "error" && error && <p className="text-sm text-destructive">{error}</p>}
      {state === "applied" && <p className="text-sm font-semibold text-text">Applied</p>}
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={state === "submitting"}
          className="flex-1 py-2.5 rounded-lg font-bold text-sm bg-primary text-white disabled:opacity-60"
        >
          {state === "submitting" ? "Sending…" : "Send application"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-3 py-2.5 rounded-lg text-sm font-semibold text-text-muted"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

export default function MarketplacePage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [workTypeChips, setWorkTypeChips] = useState<WorkType[]>([]);
  const [sortOption, setSortOption] = useState<SortOption>("Recommended");
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [advancedFilters, setAdvancedFilters] = useState(DEFAULT_ADVANCED);
  const [draftAdvanced, setDraftAdvanced] = useState(DEFAULT_ADVANCED);
  const [campaigns, setCampaigns] = useState<MarketplaceCampaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [myApplications, setMyApplications] = useState<ApplicationRecord[]>([]);
  const [pitchFor, setPitchFor] = useState<string | null>(null);
  const [pitch, setPitch] = useState("");
  const [applyState, setApplyState] = useState<Record<string, "submitting" | "applied" | "error">>({});
  const [applyError, setApplyError] = useState<string | null>(null);
  const sortRef = useRef<HTMLDivElement>(null);

  const loadMine = useCallback(() => {
    api
      .get<ApplicationRecord[]>("/api/applications")
      .then((res) => setMyApplications(Array.isArray(res.data) ? res.data : []))
      .catch(() => setMyApplications([]));
  }, []);

  useEffect(() => {
    api
      .get<{ user?: { role?: string } } | null>("/api/me")
      .then((res) => {
        const nextRole = res.data?.user?.role ?? null;
        setRole(nextRole);
        if (nextRole === "influencer") loadMine();
      })
      .catch(() => setRole(null));
  }, [loadMine]);

  const fetchCampaigns = useCallback(() => {
    const params = new URLSearchParams();
    if (searchTerm.trim()) params.set("search", searchTerm.trim());
    if (workTypeChips.length) workTypeChips.forEach((wt) => params.append("workTypes", wt));
    if (advancedFilters.platforms.length) advancedFilters.platforms.forEach((p) => params.append("platforms", p));
    if (advancedFilters.categories.length) advancedFilters.categories.forEach((c) => params.append("categories", c));
    if (advancedFilters.compensationTypes.length) advancedFilters.compensationTypes.forEach((c) => params.append("compensationTypes", c));
    if (advancedFilters.payBand) {
      params.set("payMin", String(advancedFilters.payBand.min));
      params.set("payMax", String(advancedFilters.payBand.max));
    }
    if (advancedFilters.locations.length) advancedFilters.locations.forEach((l) => params.append("locations", l));
    if (advancedFilters.deliverableTypes.length) advancedFilters.deliverableTypes.forEach((d) => params.append("deliverableTypes", d));
    if (advancedFilters.posted !== "Any") params.set("posted", advancedFilters.posted);
    params.set("sort", sortOption);
    setLoading(true);
    setFetchError(null);
    api
      .get<MarketplaceCampaign[]>(`/api/marketplace?${params.toString()}`)
      .then((res) => setCampaigns(Array.isArray(res.data) ? res.data : []))
      .catch(() => setFetchError("Failed to load campaigns"))
      .finally(() => setLoading(false));
  }, [searchTerm, workTypeChips, advancedFilters, sortOption]);

  useEffect(() => {
    fetchCampaigns();
  }, [fetchCampaigns]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (sortRef.current && !sortRef.current.contains(e.target as Node)) setIsSortOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredCampaigns = campaigns;

  const isFilterActive =
    workTypeChips.length > 0 ||
    advancedFilters.platforms.length > 0 ||
    advancedFilters.categories.length > 0 ||
    advancedFilters.compensationTypes.length > 0 ||
    advancedFilters.payBand != null ||
    advancedFilters.locations.length > 0 ||
    advancedFilters.deliverableTypes.length > 0 ||
    advancedFilters.posted !== "Any" ||
    advancedFilters.verifiedOnly ||
    advancedFilters.minMatchScore > 0;

  const toggleWorkType = (wt: WorkType) => {
    setWorkTypeChips((prev) => (prev.includes(wt) ? prev.filter((x) => x !== wt) : [...prev, wt]));
  };

  const openFilter = () => {
    setDraftAdvanced(advancedFilters);
    setIsFilterOpen(true);
  };
  const applyFilters = () => {
    setAdvancedFilters(draftAdvanced);
    setIsFilterOpen(false);
  };
  const resetFilters = () => {
    setWorkTypeChips([]);
    setAdvancedFilters(DEFAULT_ADVANCED);
    setDraftAdvanced(DEFAULT_ADVANCED);
  };

  return (
    <AppLayout
      variant="influencer"
      activeTab="Find"
      header={
        <div className="bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-md border-b border-border">
          <div className="max-w-screen-lg lg:max-w-6xl mx-auto px-4 lg:px-6 pt-12 lg:pt-4 pb-3">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-text">Marketplace</h1>
                <p className="text-xs text-text-muted mt-1">Find campaigns that match your niche.</p>
              </div>
              <button className="relative p-2 hover:bg-surface-subtle rounded-full transition-colors text-text-muted">
                <Icon name="notifications" size={24} />
                <span className="absolute top-2 right-2 h-2.5 w-2.5 rounded-full bg-destructive border-2 border-background-light dark:border-background-dark" />
              </button>
            </div>
          </div>

          <div className="max-w-screen-lg lg:max-w-6xl mx-auto px-4 lg:px-6 pb-4">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-text-muted">
                  <Icon name="search" size={20} />
                </div>
                <input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="block w-full p-3 pl-10 text-sm bg-surface border border-border rounded-lg focus:ring-primary focus:border-primary placeholder-text-muted text-text transition-colors"
                  placeholder="Search campaigns..."
                  type="text"
                />
              </div>
              <button
                onClick={openFilter}
                className="relative flex items-center justify-center w-11 h-11 bg-surface border border-border rounded-lg hover:bg-surface-subtle transition-colors text-text"
              >
                <Icon name="tune" size={20} />
                {isFilterActive && (
                  <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-primary rounded-full border-2 border-background-light dark:border-background-dark" />
                )}
              </button>
            </div>

            <div className="flex gap-2 mt-3 overflow-x-auto pb-1 hide-scrollbar lg:flex-wrap lg:gap-2">
              {WORK_TYPES.map((wt) => (
                <button
                  key={wt}
                  onClick={() => toggleWorkType(wt)}
                  className={`flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-full whitespace-nowrap ${workTypeChips.includes(wt) ? "bg-primary/10 border border-primary/40 text-primary" : "bg-surface border border-border text-text-muted hover:text-text transition-colors"}`}
                >
                  {wt}
                </button>
              ))}
            </div>
          </div>
        </div>
      }
    >
      <div className="w-full max-w-screen-lg lg:max-w-6xl mx-auto px-4 lg:px-6 lg:py-6 flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="text-lg font-bold text-text">
              {isFilterActive ? "Campaigns" : "Recommended Campaigns"}
            </h2>
            <span className="text-xs font-medium text-text-muted">
              {loading ? "Loading…" : `${filteredCampaigns.length} ${filteredCampaigns.length === 1 ? "campaign" : "campaigns"}`}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative" ref={sortRef}>
              <button
                type="button"
                onClick={() => setIsSortOpen(!isSortOpen)}
                className="text-xs font-semibold text-primary flex items-center gap-1 hover:opacity-90"
              >
                Sort: {sortOption}
                <Icon name="arrow_drop_down" size={16} />
              </button>
              {isSortOpen && (
                <div className="absolute right-0 mt-2 w-52 bg-surface border border-border rounded-xl shadow-lg z-20 py-1">
                  {SORT_OPTIONS.map((opt) => (
                    <button
                      key={opt}
                      onClick={() => {
                        setSortOption(opt);
                        setIsSortOpen(false);
                      }}
                      className={`block w-full text-left px-4 py-2 text-sm ${sortOption === opt ? "text-primary bg-primary/10 font-medium" : "text-text hover:bg-surface-subtle"}`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <a href="#" className="text-xs font-medium text-primary hover:underline">
              View all
            </a>
          </div>
        </div>

        {role === "influencer" && (
          <section className="rounded-xl border border-border bg-surface p-4 space-y-2">
            <h2 className="text-sm font-bold text-text">Your applications</h2>
            {myApplications.length === 0 ? (
              <p className="text-sm text-text-muted">You have not applied to a campaign yet.</p>
            ) : (
              <ul className="space-y-2">
                {myApplications.map((row) => (
                  <li key={row.id} className="flex items-center justify-between gap-3 text-sm">
                    <span className="text-text">
                      {row.campaignTitle ?? "Campaign"} · {row.status}
                    </span>
                    {row.status === "pending" && (
                      <button
                        type="button"
                        className="font-semibold text-primary"
                        onClick={() => api.post(`/api/applications/${row.id}/withdraw`).then(() => loadMine())}
                      >
                        Withdraw
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </section>
        )}
        {fetchError && (
          <p className="text-sm text-destructive">{fetchError}</p>
        )}
        {loading && (
          <p className="text-sm text-text-muted py-8">Loading campaigns…</p>
        )}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 lg:gap-4">
          {!loading && filteredCampaigns.map((campaign) => (
            <div
              key={campaign.id}
              className="group relative flex flex-col gap-4 rounded-xl bg-surface border border-border p-4 hover:border-primary/30 transition-colors shadow-lg"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative h-12 w-12 overflow-hidden rounded-full border border-border bg-surface-subtle">
                    {campaign.brandImage ? (
                      <img alt={campaign.brandName} className="h-full w-full object-cover" src={campaign.brandImage} />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center">
                        <Icon name="store" size={24} className="text-text-muted" />
                      </div>
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-1">
                      <h3 className="text-base font-bold leading-tight text-text">{campaign.brandName}</h3>
                      {campaign.verified && (
                        <Icon name="verified" size={16} className="text-primary" filled />
                      )}
                    </div>
                    <p className="text-xs text-text-muted">{campaign.category}</p>
                  </div>
                </div>
                {campaign.isTrending ? (
                  <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-orange-500/20 border border-orange-500/30">
                    <Icon name="local_fire_department" size={14} className="text-orange-400" />
                    <span className="text-xs font-bold text-orange-400">Trending</span>
                  </div>
                ) : (
                  <div className={`flex items-center gap-1 px-2.5 py-1 rounded-full ${campaign.matchScore >= 90 ? "bg-emerald-500/20 border border-emerald-500/30" : "bg-primary/20 border border-primary/30"}`}>
                    <Icon name="smart_toy" size={14} className={campaign.matchScore >= 90 ? "text-emerald-400" : "text-primary"} />
                    <span className={`text-xs font-bold ${campaign.matchScore >= 90 ? "text-emerald-400" : "text-primary"}`}>{campaign.matchScore}% Match</span>
                  </div>
                )}
              </div>

              <div className="relative h-32 w-full overflow-hidden rounded-lg bg-surface-subtle">
                {campaign.campaignImage ? (
                  <img
                    alt={`${campaign.brandName} campaign`}
                    className="h-full w-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-500"
                    src={campaign.campaignImage}
                  />
                ) : null}
                <div className="absolute inset-0 bg-gradient-to-t from-surface to-transparent" />
                {campaign.location && (
                  <div className="absolute bottom-2 left-2">
                    <span className="px-2 py-0.5 rounded bg-black/60 backdrop-blur-sm text-[10px] font-medium border border-white/10">
                      {campaign.location}
                    </span>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1 p-2 rounded-lg bg-surface-subtle/50 border border-border-subtle">
                  <span className="text-[10px] uppercase tracking-wider text-text-muted font-semibold">Compensation</span>
                  <span className="text-lg font-extrabold text-text">
                    {campaign.compensation}
                    {campaign.compensationExtra && <span className="text-xs font-medium text-text-muted"> {campaign.compensationExtra}</span>}
                  </span>
                </div>
                <div className="flex flex-col gap-1 p-2 rounded-lg bg-surface-subtle/50 border border-border-subtle">
                  <span className="text-[10px] uppercase tracking-wider text-text-muted font-semibold">Deliverables</span>
                  <div className="flex items-center gap-1 text-sm font-medium text-text">
                    <Icon name={campaign.deliverableIcon} size={16} className={campaign.deliverableColor} />
                    {campaign.deliverable}
                  </div>
                </div>
              </div>

              <ApplyControl
                campaignId={campaign.id}
                role={role}
                existing={myApplications.find((row) => row.campaignId === campaign.id)}
                state={applyState[campaign.id]}
                open={pitchFor === campaign.id}
                pitch={pitch}
                error={pitchFor === campaign.id ? applyError : null}
                onOpen={() => {
                  if (!role) {
                    router.push("/login");
                    return;
                  }
                  if (role !== "influencer") {
                    setPitchFor(campaign.id);
                    setApplyError("Only influencer accounts can apply.");
                    setApplyState((prev) => ({ ...prev, [campaign.id]: "error" }));
                    return;
                  }
                  setApplyError(null);
                  setPitch("");
                  setPitchFor(campaign.id);
                }}
                onPitch={setPitch}
                onCancel={() => {
                  setPitchFor(null);
                  setApplyError(null);
                }}
                onSubmit={() => {
                  setApplyState((prev) => ({ ...prev, [campaign.id]: "submitting" }));
                  setApplyError(null);
                  api
                    .post<ApplicationRecord>("/api/applications", {
                      campaignId: campaign.id,
                      message: pitch,
                    })
                    .then(() => {
                      setApplyState((prev) => ({ ...prev, [campaign.id]: "applied" }));
                      setPitchFor(null);
                      loadMine();
                    })
                    .catch((err: AxiosError<{ error?: string }>) => {
                      const message = err.response?.data?.error ?? "Could not apply";
                      const already = err.response?.status === 409;
                      setApplyError(already ? "You already applied to this campaign." : message);
                      setApplyState((prev) => ({
                        ...prev,
                        [campaign.id]: already ? "applied" : "error",
                      }));
                      if (already) loadMine();
                    });
                }}
                onWithdraw={(applicationId) => {
                  api.post(`/api/applications/${applicationId}/withdraw`).then(() => loadMine());
                }}
              />
            </div>
          ))}
        </div>

        {!loading && filteredCampaigns.length === 0 && (
          <div className="py-20 text-center flex flex-col items-center">
            <Icon name="search_off" size={64} className="text-text-muted/30" />
            <p className="mt-4 text-text font-semibold">No campaigns found</p>
            <p className="text-sm text-text-muted mt-1">Try adjusting your filters or search term</p>
            <button onClick={resetFilters} className="mt-6 text-primary font-bold text-sm hover:underline">
              Reset all filters
            </button>
          </div>
        )}
      </div>

      {isFilterOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsFilterOpen(false)} />
          <div className="relative w-full max-w-sm bg-surface h-full flex flex-col shadow-2xl border-l border-border animate-in slide-in-from-right duration-300">
            <div className="flex-none p-4 border-b border-border flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Icon name="tune" size={20} className="text-primary" />
                <h2 className="text-lg font-bold text-text">Refine Results</h2>
              </div>
              <button onClick={() => setIsFilterOpen(false)} className="p-2 rounded-full hover:bg-surface-subtle text-text-muted">
                <Icon name="close" size={24} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-8 hide-scrollbar">
              <div>
                <h3 className="text-xs font-bold text-text-muted uppercase tracking-widest mb-3">Platform</h3>
                <div className="grid grid-cols-2 gap-2">
                  {PLATFORMS.map((p) => (
                    <button
                      key={p}
                      onClick={() =>
                        setDraftAdvanced((prev) => ({
                          ...prev,
                          platforms: prev.platforms.includes(p) ? prev.platforms.filter((x) => x !== p) : [...prev.platforms, p],
                        }))
                      }
                      className={`px-3 py-2.5 rounded-xl text-xs font-bold border ${draftAdvanced.platforms.includes(p) ? "bg-primary/10 border-primary/40 text-primary" : "bg-surface-subtle/50 border-border text-text-muted"}`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-xs font-bold text-text-muted uppercase tracking-widest mb-3">Category</h3>
                <div className="flex flex-wrap gap-2">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      onClick={() =>
                        setDraftAdvanced((prev) => ({
                          ...prev,
                          categories: prev.categories.includes(cat) ? prev.categories.filter((x) => x !== cat) : [...prev.categories, cat],
                        }))
                      }
                      className={`px-3 py-2 rounded-xl text-xs font-bold border ${draftAdvanced.categories.includes(cat) ? "bg-primary/10 border-primary/40 text-primary" : "bg-surface-subtle/50 border-border text-text-muted"}`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-xs font-bold text-text-muted uppercase tracking-widest mb-3">Compensation</h3>
                <div className="grid grid-cols-2 gap-2">
                  {COMPENSATION_TYPES.map((ct) => (
                    <button
                      key={ct}
                      onClick={() =>
                        setDraftAdvanced((prev) => ({
                          ...prev,
                          compensationTypes: prev.compensationTypes.includes(ct) ? prev.compensationTypes.filter((x) => x !== ct) : [...prev.compensationTypes, ct],
                        }))
                      }
                      className={`px-3 py-2.5 rounded-xl text-xs font-bold border ${draftAdvanced.compensationTypes.includes(ct) ? "bg-primary/10 border-primary/40 text-primary" : "bg-surface-subtle/50 border-border text-text-muted"}`}
                    >
                      {ct}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-xs font-bold text-text-muted uppercase tracking-widest mb-3">Pay range</h3>
                <div className="space-y-2">
                  {PAY_BANDS.map((band) => (
                    <button
                      key={band.label}
                      onClick={() =>
                        setDraftAdvanced((prev) => ({
                          ...prev,
                          payBand: prev.payBand?.min === band.min ? null : { min: band.min, max: band.max },
                        }))
                      }
                      className={`block w-full text-left px-4 py-2.5 rounded-xl text-sm font-bold border ${draftAdvanced.payBand?.min === band.min ? "bg-primary/10 border-primary/40 text-primary" : "bg-surface-subtle/50 border-border text-text-muted"}`}
                    >
                      {band.label}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-xs font-bold text-text-muted uppercase tracking-widest mb-3">Location</h3>
                <div className="grid grid-cols-2 gap-2">
                  {LOCATIONS.map((loc) => (
                    <button
                      key={loc}
                      onClick={() =>
                        setDraftAdvanced((prev) => ({
                          ...prev,
                          locations: prev.locations.includes(loc) ? prev.locations.filter((x) => x !== loc) : [...prev.locations, loc],
                        }))
                      }
                      className={`px-3 py-2.5 rounded-xl text-xs font-bold border ${draftAdvanced.locations.includes(loc) ? "bg-primary/10 border-primary/40 text-primary" : "bg-surface-subtle/50 border-border text-text-muted"}`}
                    >
                      {loc}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-xs font-bold text-text-muted uppercase tracking-widest mb-3">Deliverable type</h3>
                <div className="flex flex-wrap gap-2">
                  {DELIVERABLE_TYPES.map((dt) => (
                    <button
                      key={dt}
                      onClick={() =>
                        setDraftAdvanced((prev) => ({
                          ...prev,
                          deliverableTypes: prev.deliverableTypes.includes(dt) ? prev.deliverableTypes.filter((x) => x !== dt) : [...prev.deliverableTypes, dt],
                        }))
                      }
                      className={`px-3 py-2 rounded-xl text-xs font-bold border ${draftAdvanced.deliverableTypes.includes(dt) ? "bg-primary/10 border-primary/40 text-primary" : "bg-surface-subtle/50 border-border text-text-muted"}`}
                    >
                      {dt}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-xs font-bold text-text-muted uppercase tracking-widest mb-3">Posted</h3>
                <div className="flex gap-2">
                  {(["Any", "7", "30"] as const).map((val) => (
                    <button
                      key={val}
                      onClick={() => setDraftAdvanced((prev) => ({ ...prev, posted: val === "Any" ? "Any" : val }))}
                      className={`px-4 py-2.5 rounded-xl text-xs font-bold border ${draftAdvanced.posted === val ? "bg-primary/10 border-primary/40 text-primary" : "bg-surface-subtle/50 border-border text-text-muted"}`}
                    >
                      {val === "Any" ? "Any" : `Last ${val} days`}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex items-center justify-between p-4 rounded-xl bg-surface-subtle/50 border border-border">
                <div>
                  <h3 className="text-sm font-bold text-text">Verified brands only</h3>
                  <p className="text-[11px] text-text-muted mt-0.5">Gold check only</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={draftAdvanced.verifiedOnly}
                    onChange={(e) => setDraftAdvanced((prev) => ({ ...prev, verifiedOnly: e.target.checked }))}
                  />
                  <div className="w-11 h-6 bg-border rounded-full peer peer-checked:bg-primary peer-checked:after:translate-x-5 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all after:border after:border-border" />
                </label>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xs font-bold text-text-muted uppercase tracking-widest">Min. match score</h3>
                  <span className="text-sm font-bold text-primary">{draftAdvanced.minMatchScore}%+</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={100}
                  step={5}
                  value={draftAdvanced.minMatchScore}
                  onChange={(e) => setDraftAdvanced((prev) => ({ ...prev, minMatchScore: Number(e.target.value) }))}
                  className="w-full h-1.5 bg-border rounded-lg appearance-none cursor-pointer accent-primary"
                />
              </div>
            </div>
            <div className="flex-none p-6 border-t border-border flex flex-col gap-3">
              <button
                onClick={applyFilters}
                className="w-full h-14 rounded-xl bg-primary hover:bg-primary/90 text-white text-base font-bold shadow-lg shadow-primary/30 flex items-center justify-center gap-2"
              >
                Show Results
                <Icon name="chevron_right" size={20} />
              </button>
              <button onClick={resetFilters} className="w-full py-3 text-sm font-bold text-text-muted hover:text-text">
                Reset All Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
