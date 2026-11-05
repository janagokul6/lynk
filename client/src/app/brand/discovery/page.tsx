"use client";

import { AppLayout } from "@/components/layout/AppLayout";
import { api } from "@/lib/api";
import Link from "next/link";
import { useState, useEffect, useMemo, useRef } from "react";

type DiscoverySuggestion = {
  id: string;
  name: string;
  handle: string;
  imageUrl: string;
  platform: "youtube" | "instagram";
};

type DiscoveryInfluencer = {
  id: string;
  name: string;
  handle: string;
  category: string;
  imageUrl: string;
  followers: string;
  followersCount: number;
  engagement: string;
  engagementRate: number;
  verified: boolean;
  platform: "YouTube" | "Instagram" | "TikTok" | "Lynk";
  region: string;
  gender: string | null;
  priceRange: string | null;
  priceValue: number | null;
};

const CATEGORIES = ["All", "Fitness", "Gaming", "Fashion", "Wellness", "Technology", "Food"];
const SORT_OPTIONS = ["Relevance", "Followers: High to Low", "Engagement: High to Low"];
const PLATFORMS = ["All", "Instagram", "YouTube", "TikTok"];
const REGIONS = ["All", "USA", "UK", "France", "Canada", "Italy"];
const GENDERS = ["All", "Male", "Female", "Other"];

const DEFAULT_FILTERS = {
  followersMin: 0,
  followersMax: 5000000,
  engagementMin: 0,
  verifiedOnly: false,
  platform: "All",
  region: "All",
  gender: "All",
  priceMin: 1,
  priceMax: 4,
};

export default function DiscoverySearchPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [debouncedSuggestionTerm, setDebouncedSuggestionTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isFocused, setIsFocused] = useState(false);
  const [suggestions, setSuggestions] = useState<DiscoverySuggestion[]>([]);
  const [suggestionsLoading, setSuggestionsLoading] = useState(false);
  const [remoteInfluencers, setRemoteInfluencers] = useState<DiscoveryInfluencer[] | null>(null);
  const [remoteInfluencersLoading, setRemoteInfluencersLoading] = useState(false);

  // Filtering Panel
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [draftFilters, setDraftFilters] = useState(DEFAULT_FILTERS);

  // Sorting
  const [sortOption, setSortOption] = useState("Relevance");
  const [isSortOpen, setIsSortOpen] = useState(false);
  const sortRef = useRef<HTMLDivElement>(null);

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);

    return () => {
      clearTimeout(timer);
    };
  }, [searchTerm]);

  // Debounce suggestions (fires only after user stops typing)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSuggestionTerm(searchTerm.trim());
    }, 3000);

    return () => {
      clearTimeout(timer);
    };
  }, [searchTerm]);

  // Fetch suggestions from backend (YouTube; Instagram stubbed server-side)
  useEffect(() => {
    if (!isFocused) {
      setSuggestions([]);
      setSuggestionsLoading(false);
      return;
    }

    if (!debouncedSuggestionTerm) {
      setSuggestions([]);
      setSuggestionsLoading(false);
      return;
    }

    const controller = new AbortController();
    setSuggestionsLoading(true);

    api
      .get<{ suggestions: DiscoverySuggestion[] }>("/api/discovery/suggestions", {
        params: { q: debouncedSuggestionTerm },
        signal: controller.signal,
      })
      .then((res) => {
        setSuggestions(res.data?.suggestions ?? []);
      })
      .catch((err: unknown) => {
        const maybeAxios = err as { code?: string };
        if (maybeAxios?.code === "ERR_CANCELED") return;
        setSuggestions([]);
      })
      .finally(() => {
        setSuggestionsLoading(false);
      });

    return () => controller.abort();
  }, [debouncedSuggestionTerm, isFocused]);

  useEffect(() => {
    const query = debouncedSearchTerm.trim();
    if (!query) {
      setRemoteInfluencers(null);
      setRemoteInfluencersLoading(false);
      return;
    }

    let active = true;
    setRemoteInfluencersLoading(true);
    api
      .get<{ influencers: DiscoveryInfluencer[] }>("/api/discovery/search", { params: { q: query } })
      .then((res) => {
        if (!active) return;
        setRemoteInfluencers(res.data?.influencers ?? []);
      })
      .catch(() => {
        if (!active) return;
        setRemoteInfluencers([]);
      })
      .finally(() => {
        if (active) setRemoteInfluencersLoading(false);
      });

    return () => {
      active = false;
    };
  }, [debouncedSearchTerm]);

  // Click outside for sorting dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (sortRef.current && !sortRef.current.contains(event.target as Node)) {
        setIsSortOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredInfluencers = useMemo(() => {
    const source = remoteInfluencers ?? [];
    const result = source.filter((inf) => {
      const matchesCategory = selectedCategory === "All" || inf.category === selectedCategory;
      const matchesVerified = !filters.verifiedOnly || inf.verified;
      const matchesFollowers = inf.followersCount >= filters.followersMin && inf.followersCount <= filters.followersMax;
      const matchesEngagement = inf.engagementRate >= filters.engagementMin;
      const matchesPlatform = filters.platform === "All" || inf.platform === filters.platform;
      const matchesRegion = filters.region === "All" || inf.region === filters.region;
      const matchesGender = filters.gender === "All" || inf.gender === filters.gender;
      const matchesPrice =
        inf.priceValue == null || (inf.priceValue >= filters.priceMin && inf.priceValue <= filters.priceMax);
      return (
        matchesCategory &&
        matchesVerified &&
        matchesFollowers &&
        matchesEngagement &&
        matchesPlatform &&
        matchesRegion &&
        matchesGender &&
        matchesPrice
      );
    });

    if (sortOption === "Followers: High to Low") {
      result.sort((a, b) => b.followersCount - a.followersCount);
    } else if (sortOption === "Engagement: High to Low") {
      result.sort((a, b) => b.engagementRate - a.engagementRate);
    }

    return result;
  }, [selectedCategory, filters, sortOption, remoteInfluencers]);

  const openFilter = () => {
    setDraftFilters(filters);
    setIsFilterOpen(true);
  };

  const applyFilters = () => {
    setFilters(draftFilters);
    setIsFilterOpen(false);
  };

  const resetFilters = () => {
    setDraftFilters(DEFAULT_FILTERS);
    setFilters(DEFAULT_FILTERS);
    setSelectedCategory("All");
  };

  const isFilterActive = useMemo(() => {
    return filters.verifiedOnly ||
      filters.engagementMin > 0 ||
      filters.followersMax < 5000000 ||
      filters.followersMin > 0 ||
      filters.platform !== "All" ||
      filters.region !== "All" ||
      filters.gender !== "All" ||
      filters.priceMin > 1 ||
      filters.priceMax < 4;
  }, [filters]);

  return (
    <AppLayout
      variant="brand"
      activeTab="Discover"
      header={
        <div className="flex-none bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-md border-b border-border transition-colors py-3">
          <div className="flex items-center justify-between px-4">
            <div className="flex flex-col gap-0.5">
              <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400 dark:text-muted-foreground">
                Discovery
              </span>
              <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                Find Influencers
              </h1>
            </div>
            <button className="relative p-2 rounded-full hover:bg-slate-100 dark:hover:bg-surface-card transition-colors group text-slate-700 dark:text-slate-200">
              <span className="material-symbols-outlined">notifications</span>
              <span className="absolute top-2 right-2 w-2 h-2 bg-primary-500 rounded-full shadow-[0_0_8px_rgba(19,164,236,0.4)]" />
            </button>
          </div>
        </div>
      }
    >
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 hide-scrollbar relative">
        {/* Search & filters */}
        <div className="bg-white dark:bg-surface-dark border border-slate-200 dark:border-border rounded-2xl px-3.5 py-3 shadow-sm">
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="material-symbols-outlined text-slate-500 dark:text-muted-foreground">
                search
              </span>
            </div>
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") setDebouncedSearchTerm(searchTerm.trim());
              }}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setTimeout(() => setIsFocused(false), 200)}
              className="block w-full pl-10 pr-10 py-2.5 bg-slate-50 dark:bg-surface-dark/60 border border-slate-200 dark:border-border rounded-xl text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-muted-foreground focus:outline-none focus:border-primary-500/50 focus:ring-1 focus:ring-primary-500/50 transition-all"
              placeholder="Search influencer by username or name..."
              type="text"
            />
            <div className="absolute inset-y-0 right-0 pr-2 flex items-center">
              <button
                onClick={openFilter}
                className="relative p-1.5 rounded-lg bg-slate-100 dark:bg-surface-card text-slate-500 dark:text-muted-foreground hover:text-slate-900 dark:hover:text-foreground hover:bg-slate-200 dark:hover:bg-surface-card/80 transition-colors"
                title="Advanced Filters"
              >
                <span className="material-symbols-outlined" style={{ fontSize: 20 }}>
                  tune
                </span>
                {isFilterActive && (
                  <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-primary-500 rounded-full border-2 border-white dark:border-surface-dark" />
                )}
              </button>
            </div>

            {/* Suggestions Dropdown */}
            {isFocused && (suggestionsLoading || suggestions.length > 0) && (
              <div className="absolute z-10 w-full mt-1 bg-white dark:bg-surface-dark border border-slate-200 dark:border-border rounded-xl shadow-lg max-h-60 overflow-auto">
                {suggestionsLoading && (
                  <div className="px-4 py-3 text-sm text-slate-500 dark:text-muted-foreground">
                    Searching…
                  </div>
                )}

                {!suggestionsLoading &&
                  suggestions.map((sug) => (
                    <div
                      key={`${sug.platform}-${sug.id}`}
                      className="flex items-center gap-3 px-4 py-2 hover:bg-slate-50 dark:hover:bg-surface-card cursor-pointer"
                      onClick={() => {
                        setSearchTerm(sug.name);
                        setDebouncedSearchTerm(sug.name);
                        setIsFocused(false);
                        setSuggestions([]);
                      }}
                    >
                      {sug.imageUrl ? (
                        <img src={sug.imageUrl} className="w-8 h-8 rounded-full object-cover" alt="" />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-surface-card" />
                      )}
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                          {sug.name}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-muted-foreground truncate">
                          {sug.platform === "youtube" ? "YouTube" : "Instagram"} • {sug.handle}
                        </p>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>

          <div className="mt-3 flex gap-2 overflow-x-auto hide-scrollbar pb-1">
            {CATEGORIES.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${selectedCategory === category
                  ? "bg-primary-500/10 border border-primary-500/40 text-primary-500 shadow-[0_0_8px_rgba(19,164,236,0.2)]"
                  : "bg-white dark:bg-surface-card border border-slate-200 dark:border-border text-slate-600 dark:text-muted-foreground hover:border-slate-300 dark:hover:border-border/80"
                  }`}
                type="button"
              >
                <span>{category}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Results header & Sorting */}
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-medium text-slate-500 dark:text-muted-foreground">
            {filteredInfluencers.length} influencer{filteredInfluencers.length === 1 ? "" : "s"} found
          </span>
          {remoteInfluencersLoading && (
            <span className="text-xs font-medium text-slate-500 dark:text-muted-foreground">
              Loading…
            </span>
          )}
          <div className="relative" ref={sortRef}>
            <button
              onClick={() => setIsSortOpen(!isSortOpen)}
              type="button"
              className="text-xs font-semibold text-primary-500 flex items-center gap-1 hover:text-primary-600 transition-colors"
            >
              Sort: {sortOption}
              <span className="material-symbols-outlined" style={{ fontSize: 16 }}>
                arrow_drop_down
              </span>
            </button>

            {isSortOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-surface-dark border border-slate-200 dark:border-border rounded-xl shadow-lg z-20 py-1">
                {SORT_OPTIONS.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => {
                      setSortOption(opt);
                      setIsSortOpen(false);
                    }}
                    className={`block w-full text-left px-4 py-2 text-sm ${sortOption === opt
                      ? "text-primary-500 bg-primary-50/50 dark:bg-primary-500/10 font-medium"
                      : "text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-surface-card"
                      }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Influencer grid */}
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
          {filteredInfluencers.map((influencer) => (
            <div
              key={influencer.id}
              className="bg-white dark:bg-surface-dark border border-slate-200 dark:border-border rounded-2xl overflow-hidden flex flex-col active:scale-[0.98] transition-all duration-150 relative z-0 group hover:shadow-md"
            >
              <div className="relative w-full aspect-[4/5] bg-slate-200/60 dark:bg-surface-card">
                <img
                  src={influencer.imageUrl}
                  alt={influencer.name}
                  className="w-full min-h-56 h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />

                {/* Platform Icon Badge */}
                <div className="absolute top-2 left-2 flex items-center gap-1.5">
                  <div className="w-8 h-8 rounded-full bg-white/90 dark:bg-surface-dark/90 backdrop-blur-sm flex items-center justify-center text-slate-900 dark:text-white shadow-sm border border-slate-100 dark:border-border/40">
                    {influencer.platform === "Instagram" && <img src="https://upload.wikimedia.org/wikipedia/commons/e/e7/Instagram_logo_2016.svg" className="w-4 h-4" alt="IG" />}
                    {influencer.platform === "YouTube" && <img src="https://upload.wikimedia.org/wikipedia/commons/0/09/YouTube_full-color_icon_%282017%29.svg" className="w-4 h-4" alt="YT" />}
                    {influencer.platform === "TikTok" && <img src="https://upload.wikimedia.org/wikipedia/en/a/a9/TikTok_logo.svg" className="w-4 h-4" alt="TK" />}
                  </div>
                </div>

                <button
                  type="button"
                  className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/60 transition-colors"
                >
                  <span className="material-symbols-outlined" style={{ fontSize: 18 }}>
                    bookmark
                  </span>
                </button>

                <div className="absolute bottom-2 left-2 flex gap-1">
                  {influencer.verified && (
                    <div className="inline-flex items-center px-2 py-0.5 rounded-full bg-blue-500/90 text-white text-[9px] font-bold shadow-sm">
                      <span className="material-symbols-outlined mr-0.5" style={{ fontSize: 11 }}>verified</span>
                      VERIFIED
                    </div>
                  )}
                  <div className="inline-flex items-center px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-white text-[9px] font-bold uppercase tracking-wider">
                    {influencer.category}
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-2.5 px-3 py-3 flex-1">
                <div className="flex flex-col gap-0.5">
                  <div className="flex items-center justify-between">
                    <p className="text-[14px] font-bold leading-tight text-slate-900 dark:text-white line-clamp-1">
                      {influencer.name}
                    </p>
                    <span className="text-[10px] font-bold text-slate-400 dark:text-muted-foreground uppercase">{influencer.region}</span>
                  </div>
                  <p className="text-[12px] font-medium text-primary-500 dark:text-primary-400 line-clamp-1">
                    {influencer.handle}
                  </p>
                </div>

                {/* Performance Stats */}
                <div className="flex justify-between bg-slate-50/80 dark:bg-surface-card/40 rounded-xl space-y-0.5 border border-slate-100 dark:border-border/30">
                  <div className="flex flex-col items-center justify-between">
                    <span className="text-[10px] font-semibold text-slate-500 dark:text-muted-foreground uppercase tracking-wider">Reach</span>
                    <span className="text-[12px] font-bold text-slate-900 dark:text-white">{influencer.followers}</span>
                  </div>
                  <div className="flex flex-col items-center justify-between">
                    <span className="text-[10px] font-semibold text-slate-500 dark:text-muted-foreground uppercase tracking-wider">Eng. Rate</span>
                    <span className="text-[12px] font-bold text-emerald-600 dark:text-emerald-400">{influencer.engagement}</span>
                  </div>
                </div>

                <div className="mt-auto space-y-2">
                  <Link
                    href={`/creators/${influencer.id}`}
                    className="block w-full py-2 rounded-xl bg-slate-900 dark:bg-primary-500 hover:bg-slate-800 dark:hover:bg-primary-600 text-[12px] font-bold text-white text-center transition-colors shadow-sm"
                  >
                    View Profile
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {remoteInfluencersLoading && (
          <div className="py-16 text-center text-sm font-medium text-slate-500 dark:text-muted-foreground">
            Searching creators…
          </div>
        )}

        {!remoteInfluencersLoading && remoteInfluencers === null && (
          <div className="py-20 text-center flex flex-col items-center">
            <span className="material-symbols-outlined text-slate-300 dark:text-muted-foreground/30" style={{ fontSize: 64 }}>person_search</span>
            <p className="mt-4 text-slate-600 dark:text-slate-300 font-semibold">Search for a creator</p>
            <p className="text-sm text-slate-500 dark:text-muted-foreground mt-1">Results come from Lynk discovery. Try a niche, name, or handle.</p>
          </div>
        )}

        {!remoteInfluencersLoading && remoteInfluencers !== null && filteredInfluencers.length === 0 && (
          <div className="py-20 text-center flex flex-col items-center">
            <span className="material-symbols-outlined text-slate-300 dark:text-muted-foreground/30" style={{ fontSize: 64 }}>person_search</span>
            <p className="mt-4 text-slate-600 dark:text-slate-300 font-semibold">No matching creators</p>
            <p className="text-sm text-slate-500 dark:text-muted-foreground mt-1">Try a closer niche, name, or handle.</p>
            <button
              onClick={resetFilters}
              className="mt-6 text-primary-500 font-bold text-sm hover:underline"
            >
              Reset all filters
            </button>
          </div>
        )}

      </div>

      {/* Filter Drawer Overlay */}
      {isFilterOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
            onClick={() => setIsFilterOpen(false)}
          />
          <div className="relative w-full max-w-sm bg-white dark:bg-surface-dark h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-300 border-l border-slate-200 dark:border-border">
            {/* Drawer Header */}
            <div className="flex-none p-4 border-b border-slate-200 dark:border-border flex items-center justify-between bg-white dark:bg-surface-dark">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary-500">tune</span>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">Refine Results</h2>
              </div>
              <button
                onClick={() => setIsFilterOpen(false)}
                className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-surface-card text-slate-500 transition-colors"
              >
                <span className="material-symbols-outlined" style={{ fontSize: 24 }}>close</span>
              </button>
            </div>

            {/* Drawer Body - Scrollable */}
            <div className="flex-1 overflow-y-auto p-6 space-y-8 scroll-smooth hide-scrollbar">

              {/* Verified Filter */}
              <div className="bg-slate-50 dark:bg-surface-card/30 p-4 rounded-2xl border border-slate-100 dark:border-border/50">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">Verified Creators</h3>
                    <p className="text-[11px] text-slate-500 dark:text-muted-foreground mt-0.5 uppercase font-medium tracking-tighter">Gold Check Only</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={draftFilters.verifiedOnly}
                      onChange={(e) => setDraftFilters({ ...draftFilters, verifiedOnly: e.target.checked })}
                    />
                    <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer dark:bg-surface-card/60 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-primary-500"></div>
                  </label>
                </div>
              </div>

              {/* Platform Filter */}
              <div>
                <h3 className="text-xs font-bold text-slate-400 dark:text-muted-foreground uppercase tracking-widest mb-4">Social Platform</h3>
                <div className="grid grid-cols-2 gap-2">
                  {PLATFORMS.map((p) => (
                    <button
                      key={p}
                      onClick={() => setDraftFilters({ ...draftFilters, platform: p })}
                      className={`px-3 py-2.5 rounded-xl text-xs font-bold transition-all border ${draftFilters.platform === p
                        ? "bg-slate-900 dark:bg-white text-slate-500 dark:text-slate-900 shadow-md shadow-primary-500/20"
                        : "bg-white dark:bg-surface-card border-slate-200 dark:border-border text-slate-600 dark:text-muted-foreground hover:border-primary-500/50"
                        }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              {/* Region Selector */}
              <div>
                <h3 className="text-xs font-bold text-slate-400 dark:text-muted-foreground uppercase tracking-widest mb-4">Region</h3>
                <select
                  value={draftFilters.region}
                  onChange={(e) => setDraftFilters({ ...draftFilters, region: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-surface-dark border border-slate-200 dark:border-border rounded-xl px-4 py-3 text-sm font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition-all appearance-none"
                >
                  {REGIONS.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>

              {/* Gender Radio */}
              <div>
                <h3 className="text-xs font-bold text-slate-400 dark:text-muted-foreground uppercase tracking-widest mb-4">Gender</h3>
                <div className="flex flex-wrap gap-2">
                  {GENDERS.map((g) => (
                    <button
                      key={g}
                      onClick={() => setDraftFilters({ ...draftFilters, gender: g })}
                      className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all border ${draftFilters.gender === g
                        ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-slate-900 dark:border-white"
                        : "bg-white dark:bg-surface-card border-slate-200 dark:border-border text-slate-600 dark:text-muted-foreground"
                        }`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>

              {/* Followers Filter */}
              <div>
                <h3 className="text-xs font-bold text-slate-400 dark:text-muted-foreground uppercase tracking-widest mb-4">Follower Base</h3>
                <div className="flex items-center gap-3">
                  <div className="flex-1">
                    <input
                      type="number"
                      placeholder="Min"
                      value={draftFilters.followersMin || ""}
                      onChange={(e) => setDraftFilters({ ...draftFilters, followersMin: Number(e.target.value) })}
                      className="w-full bg-slate-50 dark:bg-surface-card border border-slate-200 dark:border-border rounded-xl px-4 py-3 text-sm font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                    />
                  </div>
                  <div className="text-slate-400 font-bold">TO</div>
                  <div className="flex-1">
                    <input
                      type="number"
                      placeholder="Max"
                      value={draftFilters.followersMax || ""}
                      onChange={(e) => setDraftFilters({ ...draftFilters, followersMax: Number(e.target.value) })}
                      className="w-full bg-slate-50 dark:bg-surface-card border border-slate-200 dark:border-border rounded-xl px-4 py-3 text-sm font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                    />
                  </div>
                </div>
              </div>

              {/* Engagement Rate Filter */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xs font-bold text-slate-400 dark:text-muted-foreground uppercase tracking-widest">Min Engagement</h3>
                  <span className="text-sm font-black text-primary-500">
                    {draftFilters.engagementMin}%+
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="15"
                  step="0.5"
                  value={draftFilters.engagementMin}
                  onChange={(e) => setDraftFilters({ ...draftFilters, engagementMin: Number(e.target.value) })}
                  className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer dark:bg-surface-card accent-primary-500"
                />
              </div>

            </div>

            {/* Drawer Footer Actions */}
            <div className="flex-none p-6 border-t border-slate-200 dark:border-border flex flex-col gap-3 bg-white dark:bg-surface-dark shadow-[0_-8px_24px_rgba(0,0,0,0.03)]">
              <button
                onClick={applyFilters}
                className="w-full h-14 rounded-2xl bg-primary-500 hover:bg-primary-600 text-white text-base font-bold shadow-lg shadow-primary-500/30 transition-all flex items-center justify-center gap-2"
              >
                Show Results
                <span className="material-symbols-outlined">chevron_right</span>
              </button>
              <button
                onClick={resetFilters}
                className="w-full py-3 h-12 text-sm font-bold text-slate-500 dark:text-muted-foreground hover:text-slate-900 dark:hover:text-white transition-colors"
              >
                Reset All Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
