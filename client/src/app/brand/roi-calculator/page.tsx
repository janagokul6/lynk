"use client";

import { AppLayout } from "@/components/layout/AppLayout";
import { api } from "@/lib/api";
import Link from "next/link";
import { useMemo, useState } from "react";

type RoiInfluencer = {
  id: string;
  name: string;
  handle: string;
  platform: "YouTube" | "Instagram" | "TikTok";
  followersCount: number;
  followersLabel: string;
  engagementRate: number;
  imageUrl: string;
};

type DiscoveryInfluencerResponse = {
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
  platform: "YouTube" | "Instagram" | "TikTok";
  region: string;
  gender: string;
  priceRange: string;
  priceValue: number;
};

type DiscoverySearchResponse = {
  influencers: DiscoveryInfluencerResponse[];
};

export default function ROICalculatorPage() {
  const [budget, setBudget] = useState(15000);
  const [influencerFee, setInfluencerFee] = useState(2500);
  const [productPrice, setProductPrice] = useState(50);
  const [conversionRate, setConversionRate] = useState(2.5);
  const [goal, setGoal] = useState<"awareness" | "sales" | "engagement">("sales");
  const [selectedDeliverables, setSelectedDeliverables] = useState<string[]>(["ig-posts", "ig-stories", "reel"]);
  const [showResults, setShowResults] = useState(false);
  const [showPicker, setShowPicker] = useState(false);
  const [selectedInfluencers, setSelectedInfluencers] = useState<RoiInfluencer[]>([]);
  const hasInfluencers = selectedInfluencers.length > 0;

  const toggleDeliverable = (id: string) => {
    setSelectedDeliverables((prev) => (prev.includes(id) ? prev.filter((d) => d !== id) : [...prev, id]));
  };

  const alternatives = [
    {
      name: "@TechGuru99",
      category: "Tech & Gadgets",
      avatarUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuCM25HMv7rE3dM4fW6d5VP0QeMahjI7ARGhS4qROnqUZ2b0lyN-Rxqkxw7D82gfa6vufEMtu__kT3kSLpaEoAhWZHuY6MGYRb1okogBc6rtgpe14z5kRluS3YYngprybIkSrLVFwO9JQD971x5vwF8IwO81vq53u7PYwWIIobyk3D_Xi4t1O6NxqKG76B3RfPmbzX5bz17OfH1Ig5vSUa27jX3NG-1896Tp4tia67OJdIPMjAxMYzrX1gq5sBzkji9l90m9vrN4t-A",
      roi: "4.8x",
      cpa: "₹10.20",
      matchScore: 92,
    },
    {
      name: "@SarahDigital",
      category: "Lifestyle & Apps",
      avatarUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuBCP29ySxZfv5BZpE_NLLv1ssR7tjw9XC0_26zWX2fReX0Ie8SADVYB5AmoXPtGqUgjzY0YxGjPhs7ihHAdCu7iyDVAn-0fdKv1z_BHtdRfFTbVrUgSsFaNTunnWZvKiScxQo40z6AuWTbOZ2DGzz5lw1N8p1TTNJ62sNBu8LqMb5boXA96YU6u4l9DP-ebcvbvEveYEiQM6XizGFEjsc5HcIswxXF6bFWRdp6y5cEO-ZmOP5J8JVue9L7YVNzg8We6zoTHzg2cM_0",
      roi: "4.5x",
      cpa: "₹11.50",
      matchScore: 89,
    },
  ];

  const calculateMetrics = () => {
    const spend = Math.max(budget + influencerFee, 0);

    // Simple heuristics based on budget to keep numbers in a reasonable range
    const impressions = Math.round(budget * 42); // ~₹10 CPM
    const reach = Math.round(impressions * 0.7);
    const engagementRate = goal === "engagement" ? 0.07 : 0.058;
    const estimatedEngagement = Math.round(impressions * engagementRate);

    const clickThroughRate = goal === "sales" ? 0.03 : 0.02;
    const clicks = Math.round(impressions * clickThroughRate);

    const convRateDecimal = Math.max(conversionRate, 0) / 100;
    const conversions = Math.round(clicks * convRateDecimal);

    const revenue = Math.round(conversions * Math.max(productPrice, 0));
    const netProfit = revenue - spend;
    const roiMultiple = spend > 0 ? revenue / spend : 0;
    const roiPercent = roiMultiple > 0 ? (roiMultiple - 1) * 100 : -100;
    const cpa = conversions > 0 ? spend / conversions : 0;

    // Confidence based on how far above 1x ROI we are, clamped
    const confidence = Math.max(60, Math.min(95, 70 + roiMultiple * 10));

    return {
      reach,
      impressions,
      engagement: estimatedEngagement,
      engagementRate,
      clicks,
      conversions,
      revenue,
      netProfit,
      roiMultiple,
      roiPercent,
      cpa,
      confidence,
    };
  };

  const metrics = useMemo(calculateMetrics, [budget, influencerFee, productPrice, conversionRate, goal]);

  return (
    <AppLayout
      variant="brand"
      activeTab="Calculator"
      header={
        <div className="bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-md border-b border-border">
          <div className="flex items-center justify-between px-4 py-3 max-w-screen-lg mx-auto">
            <div className="flex items-center gap-3">
              <Link
                href="/brand/campaigns"
                className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-surface-hover text-text-muted transition-colors"
                aria-label="Back to campaigns"
              >
                <span className="material-symbols-outlined text-[22px]">arrow_back</span>
              </Link>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-primary-500 mb-1">
                  AI Processing Complete
                </p>
                <h1 className="tracking-tight text-[20px] md:text-[22px] font-bold leading-tight text-text">
                  ROI Calculator
                </h1>
                <p className="text-text-muted text-xs md:text-sm">
                  Campaign: Summer Tech Launch · Prediction Engine v2.0
                </p>
              </div>
            </div>
          </div>
        </div>
      }
    >
      <div className="w-full py-4 md:py-8 lg:py-10">
        <div className="relative w-full bg-background shadow-2xl md:shadow-xl lg:shadow-lg overflow-hidden rounded-none md:rounded-3xl">
          {/* Main Content */}
          <div className="flex-1 overflow-y-auto pb-24 px-4 md:px-6 lg:px-8">
            <div className="w-full max-w-6xl mx-auto space-y-6 md:space-y-8">
              <div className="grid gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] lg:items-start">
                {/* Left column: Influencer summary + inputs */}
                <div className="flex flex-col gap-4">
                  {/* Influencer Summary */}
                  <div className="bg-surface rounded-2xl border border-border-subtle p-4 flex flex-col gap-3">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="relative size-12 rounded-full overflow-hidden bg-surface-card flex items-center justify-center">
                          {hasInfluencers && selectedInfluencers[0]?.imageUrl ? (
                            <img
                              src={selectedInfluencers[0].imageUrl}
                              alt={selectedInfluencers[0].handle}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span className="material-symbols-outlined text-text-muted text-[20px]">person_search</span>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          {hasInfluencers ? (
                            <>
                              <p className="font-semibold text-sm text-text truncate">
                                {selectedInfluencers[0].handle || selectedInfluencers[0].name}
                              </p>
                              <p className="text-xs text-text-muted mt-0.5 truncate">
                                {selectedInfluencers[0].followersLabel} ·{" "}
                                {selectedInfluencers[0].engagementRate.toFixed(1)}% ER ·{" "}
                                {selectedInfluencers[0].platform}
                                {selectedInfluencers.length > 1 && ` · +${selectedInfluencers.length - 1} more`}
                              </p>
                            </>
                          ) : (
                            <>
                              <p className="font-semibold text-sm text-text truncate">No influencers selected yet</p>
                              <p className="text-xs text-text-muted mt-0.5 truncate">
                                Start by choosing the creators you want to model this campaign around.
                              </p>
                            </>
                          )}
                        </div>
                      </div>
                      {hasInfluencers && (
                        <div className="hidden sm:flex flex-col items-end gap-1">
                          <span className="text-[11px] font-semibold uppercase tracking-wide text-text-muted">
                            Est. ROI
                          </span>
                          <span className="text-base font-bold text-primary-500">
                            {metrics.roiMultiple > 0 ? `${metrics.roiMultiple.toFixed(2)}x` : "—"}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="flex justify-between items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setShowPicker(true)}
                        className="inline-flex items-center gap-1.5 rounded-full border border-primary-500  px-3 py-1.5 text-xs font-semibold text-primary-500 hover:bg-surface-card transition-colors"
                      >
                        <span className="material-symbols-outlined text-[16px]">group_add</span>
                        {hasInfluencers ? "Change influencers" : "Select influencers"}
                      </button>
                      {hasInfluencers && (
                        <span className="text-[11px] text-text-muted">
                          {selectedInfluencers.length} selected
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Campaign Inputs */}
                  <section className="pt-2 pb-6 space-y-3">
                    <p className="text-xs font-semibold uppercase tracking-wide text-text-muted">
                      Campaign inputs
                    </p>
                    <div className="bg-surface-dark rounded-2xl border border-border p-4 lg:py-3 space-y-4">
                      <div className="space-y-2">
                        <label className="text-xs font-medium text-text-muted">Campaign Budget</label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-text-muted">
                            ₹
                          </span>
                          <input
                            type="number"
                            min={0}
                            value={budget}
                            onChange={(e) => setBudget(Number(e.target.value) || 0)}
                            className="w-full rounded-xl bg-surface-card border border-border-subtle pl-7 pr-3 py-2.5 text-sm text-text placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            placeholder="10,000"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-medium text-text-muted">Influencer Fee</label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-text-muted">
                            ₹
                          </span>
                          <input
                            type="number"
                            min={0}
                            value={influencerFee}
                            onChange={(e) => setInfluencerFee(Number(e.target.value) || 0)}
                            className="w-full rounded-xl bg-surface-card border border-border-subtle pl-7 pr-3 py-2.5 text-sm text-text placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            placeholder="2,500"
                          />
                        </div>
                        <p className="text-[11px] text-text-muted">
                          Suggested range: <span className="font-medium">₹2,000 – ₹3,000</span>
                        </p>
                      </div>

                      {/* Deliverables */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between gap-2">
                          <label className="text-xs font-medium text-text-muted">Deliverables</label>
                          <button
                            type="button"
                            className="text-[11px] font-semibold text-primary-500 hover:text-primary-600"
                          >
                            Add custom
                          </button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {[
                            { id: "ig-posts", label: "2 Instagram Posts" },
                            { id: "ig-stories", label: "3 Instagram Stories" },
                            { id: "reel", label: "1 Reel" },
                          ].map((item) => {
                            const active = selectedDeliverables.includes(item.id);
                            return (
                              <button
                                key={item.id}
                                type="button"
                                onClick={() => toggleDeliverable(item.id)}
                                className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${active
                                    ? "bg-primary-500/10 border-primary-500 text-primary-500"
                                    : "bg-surface-card border-border text-text-muted hover:bg-surface-card/80"
                                  }`}
                              >
                                {item.label}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Campaign Goal */}
                      <div className="space-y-2">
                        <label className="text-xs font-medium text-text-muted">Campaign Goal</label>
                        <div className="inline-flex rounded-full bg-surface-card p-1 gap-1">
                          {[
                            { id: "awareness", label: "Brand Awareness" },
                            { id: "engagement", label: "Engagement" },
                            { id: "sales", label: "Sales" },
                          ].map((option) => (
                            <button
                              key={option.id}
                              type="button"
                              onClick={() => setGoal(option.id as typeof goal)}
                              className={`px-3 py-1.5 rounded-full text-[11px] font-semibold transition-colors ${goal === option.id
                                  ? "bg-primary-500 text-white"
                                  : "text-text-muted hover:bg-surface-dark"
                                }`}
                            >
                              {option.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Product & Conversion */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="space-y-2">
                          <label className="text-xs font-medium text-text-muted">Product Price</label>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-text-muted">
                              ₹
                            </span>
                            <input
                              type="number"
                              min={0}
                              value={productPrice}
                              onChange={(e) => setProductPrice(Number(e.target.value) || 0)}
                              className="w-full rounded-xl bg-surface-card border border-border-subtle pl-7 pr-3 py-2.5 text-sm text-text placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                              placeholder="50"
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-medium text-text-muted">Conv. Rate (%)</label>
                          <div className="relative">
                            <input
                              type="number"
                              min={0}
                              step={0.1}
                              value={conversionRate}
                              onChange={(e) => setConversionRate(Number(e.target.value) || 0)}
                              className="w-full rounded-xl bg-surface-card border border-border-subtle pr-8 pl-3 py-2.5 text-sm text-text placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                              placeholder="2.5"
                            />
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-text-muted">
                              %
                            </span>
                          </div>
                          <p className="text-[11px] text-text-muted">
                            Auto-calculate based on past campaign data.
                          </p>
                        </div>
                      </div>

                      {/* Calculate button */}
                      <div className="pt-2 space-y-1">
                        {!hasInfluencers && (
                          <p className="text-[11px] text-text-muted">
                            Select at least one influencer to unlock full ROI projections.
                          </p>
                        )}
                        <button
                          type="button"
                          disabled={!hasInfluencers}
                          onClick={() => setShowResults(true)}
                          className={`w-full h-11 rounded-xl font-semibold text-sm shadow-[0_0_18px_rgba(19,164,236,0.35)] transition-colors ${hasInfluencers
                              ? "bg-primary-500 hover:bg-primary-600 text-white"
                              : "bg-surface-card text-text-muted cursor-not-allowed border border-border-subtle"
                            }`}
                        >
                          Calculate ROI
                        </button>
                      </div>
                    </div>
                  </section>
                </div>

                {/* Right column: results & insights */}
                <div className="flex flex-col gap-4 mt-4 lg:mt-0">
                  {/* Right column placeholder / preview */}
                  <div className="bg-surface rounded-2xl border border-border-subtle p-4">
                    {!hasInfluencers ? (
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-text-muted text-[20px]">insights</span>
                          <h2 className="text-sm font-semibold text-text">ROI preview</h2>
                        </div>
                        <p className="text-xs text-text-muted">
                          Once you’ve selected influencers and configured your inputs, we'll project reach, conversions
                          and ROI in this panel.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-[11px] font-semibold uppercase tracking-wide text-text-muted">
                              Live preview
                            </p>
                            <p className="text-sm font-bold text-text">
                              Approximate performance with current inputs
                            </p>
                          </div>
                          <span className="inline-flex items-center rounded-full bg-primary-500/10 text-primary-500 text-[11px] font-semibold px-3 py-1">
                            {metrics.roiMultiple > 0 ? `${metrics.roiMultiple.toFixed(2)}x ROI` : "ROI preview"}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-3 text-xs">
                          <div className="space-y-1">
                            <div className="flex justify-between">
                              <span className="text-text-muted">Reach</span>
                              <span className="font-medium">~{metrics.reach.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-text-muted">Impressions</span>
                              <span className="font-medium">~{metrics.impressions.toLocaleString()}</span>
                            </div>
                          </div>
                          <div className="space-y-1">
                            <div className="flex justify-between">
                              <span className="text-text-muted">Conversions</span>
                              <span className="font-medium">~{metrics.conversions.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-text-muted">Revenue</span>
                              <span className="font-medium">
                                ₹{metrics.revenue.toLocaleString()}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Expected Results */}
                  {showResults && hasInfluencers && (
                    <section>
                      <div className="bg-surface rounded-2xl border border-border-subtle p-4 md:p-5 space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-[11px] font-semibold uppercase tracking-wide text-text-muted">
                              Projected performance
                            </p>
                            <h2 className="text-base md:text-lg font-bold text-text">Expected Results</h2>
                          </div>
                          <span className="hidden sm:inline-flex items-center rounded-full bg-primary-500/10 text-primary-500 text-[11px] font-semibold px-3 py-1">
                            Single influencer
                          </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="space-y-1 text-sm">
                            <div className="flex justify-between">
                              <span className="text-text-muted">Total Reach</span>
                              <span className="font-medium">~{metrics.reach.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-text-muted">Est. Impressions</span>
                              <span className="font-medium">~{metrics.impressions.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-text-muted">Est. Engagement</span>
                              <span className="font-medium">~{metrics.engagement.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-text-muted">Engagement Rate</span>
                              <span className="font-medium text-green-500">
                                {(metrics.engagementRate * 100).toFixed(1)}%
                              </span>
                            </div>
                          </div>

                          <div className="space-y-1 text-sm">
                            <div className="flex justify-between">
                              <span className="text-text-muted">Est. Clicks</span>
                              <span className="font-medium">~{metrics.clicks.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-text-muted">Est. Conversions</span>
                              <span className="font-medium">~{metrics.conversions.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-text-muted">Proj. Revenue</span>
                              <span className="font-medium">
                                ₹{metrics.revenue.toLocaleString()}
                              </span>
                            </div>
                          </div>

                          <div className="rounded-xl bg-primary-500/5 border border-primary-500/30 p-3 flex flex-col justify-between">
                            <div>
                              <p className="text-[11px] font-semibold uppercase tracking-wide text-primary-500 mb-1">
                                Projected ROI
                              </p>
                              <p className="text-2xl md:text-3xl font-extrabold text-primary-500">
                                {metrics.roiMultiple > 0 ? `${metrics.roiMultiple.toFixed(2)}x` : "—"}
                              </p>
                              <p className="text-[11px] text-text-muted mt-1">
                                Net profit{" "}
                                <span className="font-semibold text-text">
                                  ₹{metrics.netProfit.toLocaleString()}
                                </span>
                              </p>
                            </div>
                            <div className="flex justify-between items-center mt-3 text-[11px]">
                              <span className="text-text-muted">
                                CPA{" "}
                                <span className="font-semibold text-text">
                                  {metrics.cpa > 0 ? `₹${metrics.cpa.toFixed(2)}` : "—"}
                                </span>
                              </span>
                              <span className="text-text-muted">
                                Confidence{" "}
                                <span className="font-semibold text-green-500">
                                  {metrics.confidence.toFixed(0)}% High
                                </span>
                              </span>
                            </div>
                          </div>
                        </div>

                        <p className="text-[10px] text-text-muted pt-1">
                          Projections based on historical campaign data and niche benchmarks. Actual results may vary.
                        </p>
                      </div>
                    </section>
                  )}

                  {/* Confidence Score */}
                  <div
                    className={`bg-surface rounded-2xl border border-border-subtle p-4 flex justify-center ${!hasInfluencers ? "opacity-60" : ""
                      }`}
                  >
                    <div className="relative flex items-center justify-center size-56 md:size-64 text-primary-500">
                      <svg className="transform -rotate-90 w-full h-full" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" fill="transparent" r="40" stroke="#283339" strokeLinecap="round" strokeWidth="8"></circle>
                        <circle
                          className="drop-shadow-[0_0_8px_rgba(19,164,236,0.6)]"
                          cx="50"
                          cy="50"
                          fill="transparent"
                          r="40"
                          stroke="currentColor"
                          strokeDasharray="251.2"
                          strokeDashoffset="32.65"
                          strokeLinecap="round"
                          strokeWidth="8"
                        ></circle>
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                        <span className="text-muted-foreground text-sm font-medium uppercase tracking-widest mb-1">
                          Confidence
                        </span>
                        <h1 className="text-6xl font-bold tracking-tighter shadow-[0_0_10px_rgba(19,164,236,0.3)]">
                          {metrics.confidence.toFixed(0)}
                          <span className="text-2xl text-primary-500">%</span>
                        </h1>
                        <p className="text-muted-foreground text-xs mt-2 max-w-[160px] leading-relaxed">
                          {hasInfluencers
                            ? "Based on 3.2M data points and similar campaigns."
                            : "Select influencers and configure inputs to get a confidence estimate."}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* AI Insight */}
                  {hasInfluencers && (
                    <div className="bg-primary-500/5 rounded-2xl border border-primary-500/20 p-5 relative overflow-hidden group">
                      <div className="absolute top-0 right-0 p-3 opacity-20">
                        <span className="material-symbols-outlined text-primary-500 text-6xl">psychology</span>
                      </div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="material-symbols-outlined text-primary-500 text-[20px]">auto_awesome</span>
                        <p className="text-primary-500 text-sm font-bold uppercase tracking-wider">AI Analysis</p>
                      </div>
                      <p className="text-muted-foreground text-sm leading-relaxed z-10 relative">
                        This influencer's audience retention peaks during product demos, suggesting a{" "}
                        <span className="font-semibold">high conversion probability</span> for your tech accessory
                        category.
                      </p>
                    </div>
                  )}

                  {/* Financial Projections */}
                  <div className="grid grid-cols-2 gap-4 max-w-xl">
                    <div className="bg-surface-dark rounded-xl p-4 border border-border flex flex-col justify-between h-32">
                      <div className="flex items-start justify-between">
                        <p className="text-muted-foreground text-xs font-medium uppercase">Est. ROI</p>
                        <span className="material-symbols-outlined text-green-500 text-[20px]">trending_up</span>
                      </div>
                      <div>
                        <p className="text-2xl font-bold">
                          {metrics.roiMultiple > 0 && hasInfluencers ? `${metrics.roiMultiple.toFixed(2)}x` : "—"}
                        </p>
                        <p className="text-muted-foreground text-xs font-medium mt-1">
                          {hasInfluencers ? "Target: 3.5x" : "Add influencers to estimate ROI vs. target"}
                        </p>
                      </div>
                    </div>
                    <div className="bg-surface-dark rounded-xl p-4 border border-border flex flex-col justify-between h-32">
                      <div className="flex items-start justify-between">
                        <p className="text-muted-foreground text-xs font-medium uppercase">Est. CPA</p>
                        <span className="material-symbols-outlined text-primary-500 text-[20px]">currency_rupee</span>
                      </div>
                      <div>
                        <p className="text-2xl font-bold">
                          {metrics.cpa > 0 && hasInfluencers ? `₹${metrics.cpa.toFixed(2)}` : "—"}
                        </p>
                        <p className="text-muted-foreground text-xs font-medium mt-1">
                          {hasInfluencers ? "Avg: ₹15.20" : "CPA will appear after we have projections"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Budget & spend overview (no chart) */}
                  <div className="bg-surface-dark rounded-xl border border-border p-5 space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="font-semibold text-lg">Budget & Spend Overview</h3>
                      <span className="text-xs text-muted-foreground">
                        Adjust budget on the left to update projections
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="space-y-1">
                        <p className="text-muted-foreground text-xs font-medium uppercase">Total Budget</p>
                        <p className="font-bold">₹{budget.toLocaleString()}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-muted-foreground text-xs font-medium uppercase">Influencer Fee</p>
                        <p className="font-bold">₹{influencerFee.toLocaleString()}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-muted-foreground text-xs font-medium uppercase">Estimated Spend</p>
                        <p className="font-bold">
                          ₹{(Math.max(budget + influencerFee, 0)).toLocaleString()}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-muted-foreground text-xs font-medium uppercase">Projected Revenue</p>
                        <p className="font-bold">
                          {hasInfluencers ? `₹${metrics.revenue.toLocaleString()}` : "—"}
                        </p>
                      </div>
                    </div>
                    <p className="text-[11px] text-muted-foreground">
                      These numbers are approximate and update as you tweak your campaign budget and inputs.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {showPicker && (
        <InfluencerPickerOverlay
          initialSelection={selectedInfluencers}
          onClose={() => setShowPicker(false)}
          onApply={(next) => {
            setSelectedInfluencers(next);
            if (next.length === 0) {
              setShowResults(false);
            }
            setShowPicker(false);
          }}
        />
      )}
    </AppLayout>
  );
}

type InfluencerPickerOverlayProps = {
  initialSelection: RoiInfluencer[];
  onClose: () => void;
  onApply: (selection: RoiInfluencer[]) => void;
};

function InfluencerPickerOverlay({ initialSelection, onClose, onApply }: InfluencerPickerOverlayProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<RoiInfluencer[]>([]);
  const [selection, setSelection] = useState<RoiInfluencer[]>(initialSelection);

  const toggleSelection = (inf: RoiInfluencer) => {
    setSelection((prev) => {
      const exists = prev.some((p) => p.id === inf.id && p.platform === inf.platform);
      return exists ? prev.filter((p) => !(p.id === inf.id && p.platform === inf.platform)) : [...prev, inf];
    });
  };

  const runSearch = async () => {
    const query = searchTerm.trim();
    if (!query) return;
    setLoading(true);
    try {
      const res = await api.get<DiscoverySearchResponse>("/api/discovery/search", {
        params: { q: query },
      });
      const influencers = res.data?.influencers ?? [];
      const mapped: RoiInfluencer[] = influencers.map((inf) => ({
        id: inf.id,
        name: inf.name,
        handle: inf.handle,
        platform: inf.platform,
        followersCount: inf.followersCount,
        followersLabel: inf.followers,
        engagementRate: inf.engagementRate,
        imageUrl: inf.imageUrl,
      }));
      setResults(mapped);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const isSelected = (inf: RoiInfluencer) =>
    selection.some((p) => p.id === inf.id && p.platform === inf.platform);

  const selectedCount = selection.length;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative w-full max-w-xl bg-background-light dark:bg-background-dark h-full flex flex-col shadow-2xl border-l border-border animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary-500">group_add</span>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-text-muted">
                ROI Influencer Selection
              </p>
              <h2 className="text-sm font-bold text-text">Select influencers for this calculation</h2>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full hover:bg-surface-card text-text-muted transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Search */}
          <div className="bg-surface rounded-2xl border border-border-subtle p-3">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="material-symbols-outlined text-text-muted">search</span>
              </div>
              <input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    runSearch();
                  }
                }}
                className="block w-full pl-10 pr-24 py-2.5 bg-surface-card border border-border-subtle rounded-xl text-sm text-text placeholder:text-text-muted focus:outline-none focus:border-primary-500/50 focus:ring-1 focus:ring-primary-500/50 transition-all"
                placeholder="Search by username or name..."
                type="text"
              />
              <div className="absolute inset-y-0 right-0 pr-2 flex items-center">
                <button
                  type="button"
                  onClick={runSearch}
                  className="px-3 py-1.5 rounded-lg bg-primary-500 text-white text-xs font-semibold hover:bg-primary-600 transition-colors"
                >
                  Search
                </button>
              </div>
            </div>
            <p className="mt-2 text-[11px] text-text-muted">
              Uses the same discovery engine (YouTube + Instagram) to find creators for this ROI scenario.
            </p>
          </div>

          {/* Results */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-wide text-text-muted">
                Search Results
              </p>
              <p className="text-[11px] text-text-muted">
                {loading
                  ? "Searching..."
                  : results.length > 0
                    ? `${results.length} creators found`
                    : "No results yet"}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {results.map((inf) => {
                const active = isSelected(inf);
                return (
                  <button
                    key={`${inf.platform}-${inf.id}`}
                    type="button"
                    onClick={() => toggleSelection(inf)}
                    className={`flex items-center gap-3 rounded-2xl border p-3 text-left transition-all ${active
                        ? "border-primary-500 bg-primary-500/5 shadow-[0_0_0_1px_rgba(19,164,236,0.3)]"
                        : "border-border-subtle bg-surface hover:border-border"
                      }`}
                  >
                    <div className="relative size-10 rounded-full overflow-hidden bg-surface-card flex items-center justify-center">
                      {inf.imageUrl ? (
                        <img src={inf.imageUrl} alt={inf.handle} className="w-full h-full object-cover" />
                      ) : (
                        <span className="material-symbols-outlined text-text-muted text-[18px]">person</span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-text truncate">
                        {inf.name}
                      </p>
                      <p className="text-xs text-text-muted truncate">
                        {inf.handle} · {inf.followersLabel} · {inf.platform}
                      </p>
                    </div>
                    <div>
                      <span
                        className={`inline-flex items-center justify-center rounded-full border px-2 py-0.5 text-[10px] font-semibold ${active
                            ? "bg-primary-500 text-white border-primary-500"
                            : "border-border-subtle text-text-muted"
                          }`}
                      >
                        {active ? "Selected" : "Add"}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex-none border-t border-border bg-surface-card/95 backdrop-blur-md px-4 py-3">
          <div className="flex items-center justify-between gap-3">
            <div className="text-[11px] text-text-muted">
              {selectedCount > 0 ? (
                <>
                  <span className="font-semibold">{selectedCount}</span> influencer
                  {selectedCount > 1 ? "s" : ""} selected
                </>
              ) : (
                "No influencers selected"
              )}
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3 py-1.5 rounded-xl border border-border-subtle bg-surface text-xs font-semibold text-text hover:bg-surface-card transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={selectedCount === 0}
                onClick={() => onApply(selection)}
                className={`px-4 py-1.5 rounded-xl text-xs font-semibold shadow-[0_0_14px_rgba(19,164,236,0.35)] transition-colors ${selectedCount === 0
                    ? "bg-surface-card text-text-muted border border-border-subtle cursor-not-allowed"
                    : "bg-primary-500 hover:bg-primary-600 text-white"
                  }`}
              >
                Use {selectedCount || ""} creator{selectedCount > 1 ? "s" : ""}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

