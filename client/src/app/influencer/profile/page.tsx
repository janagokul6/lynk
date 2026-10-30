'use client';

import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { AppLayout } from "@/components/layout/AppLayout";
import { Icon } from "@/components/ui/Icon";

export default function InfluencerProfilePage() {
  const userData = {
    name: "Sarah Jenkins",
    role: "Content Creator",
    avatarUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuBbfE76chEJIW3_Tk0RLn5gOcVW0stmCX-xrauIsA2-_eyd95qbongV19IeAx73BNJy4LRCDRBfaAsF1wgJEjjMaFWIpmTyxBgVGsH_JkaCbH9GkspuhOWyJg9Cli8QdbZKpxQNQWpqNC_yz93wyeNVsMLPeBuTbhUkIJiraMkJH6bn3NRbUOKQQmBfukM0O8GZxvPrNBRHWKXDLivn1IX1ArpsvaTQ33h-1ejV-wsgfNvi6KMJqCRSlVL1QA8JjnotAP4nvRfmwWY",
    isOnline: true,
  };

  const platformStats = [
    { label: "Instagram", icon: "photo_camera", value: "250k" },
    { label: "TikTok", icon: "music_note", value: "180k" },
    { label: "YouTube", icon: "ondemand_video", value: "95k" },
  ];

  const metrics = [
    { label: "Avg Eng. Rate", value: "5.8%", trend: "Top 10%", trendPositive: true },
    { label: "Avg Reach", value: "280k", trend: "per post", trendPositive: false },
    { label: "Authenticity", value: "92/100", trend: "High", trendPositive: true },
    { label: "Growth (30d)", value: "+12%", trend: "Trending", trendPositive: true },
  ];

  const collabs = [
    {
      brand: "Nike Running",
      campaign: "Summer Run Challenge",
      platforms: ["IG Reels", "TikTok"],
      result: "+3.8x ROI",
    },
    {
      brand: "Glow Skincare",
      campaign: "Morning Routine Series",
      platforms: ["Instagram", "YouTube"],
      result: "+2.4x Sales lift",
    },
    {
      brand: "HelloFresh",
      campaign: "Meal Prep Sundays",
      platforms: ["UGC", "TikTok"],
      result: "Repeat collab",
    },
  ];

  const [activeTab, setActiveTab] = useState<"overview" | "audience" | "collabs" | "content">("overview");

  const tags = ["Fitness", "Wellness", "Lifestyle", "📍 Los Angeles"];

  const audienceRows = [
    {
      label: "Female / Male",
      value: "82% / 18%",
      percentage: 82,
    },
    {
      label: "Top Age: 25-34",
      value: "45%",
      percentage: 45,
    },
    {
      label: "Top Countries",
      value: "USA, UK, Canada",
      percentage: 60,
    },
  ];

  return (
    <AppLayout
      variant="influencer"
      activeTab="Profile"
      header={
        <Header
          userName={userData.name}
          userRole={userData.role}
          avatarUrl={userData.avatarUrl}
          showNotificationDot={false}
          isOnline={userData.isOnline}
        />
      }
    >
      <div className="p-4 flex flex-col gap-6 max-w-screen-lg mx-auto w-full">
        <div className="max-w-md mx-auto w-full flex flex-col gap-6">
          {/* Profile Header Card */}
          <section className="bg-surface-card border border-border rounded-2xl p-4 flex flex-col items-center gap-4">
            <div className="relative">
              <div
                className="size-24 rounded-full bg-surface-card bg-cover bg-center border-4 border-primary-500 shadow-md"
                style={{ backgroundImage: `url('${userData.avatarUrl}')` }}
              />
              <div className="absolute -bottom-1 -right-1 size-6 rounded-full bg-primary text-white flex items-center justify-center border-2 border-surface-card">
                <Icon name="check" size={14} />
              </div>
            </div>
            <div className="text-center space-y-1">
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">{userData.name}</h2>
              <p className="text-sm text-muted-foreground">@sarahfit_official</p>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap justify-center gap-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 rounded-full bg-background-light dark:bg-background-dark text-xs font-medium text-muted-foreground"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Social stats */}
            <div className="flex items-center justify-center gap-4 w-full">
              {platformStats.map((stat) => (
                <div key={stat.label} className="flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-slate-100">
                  <div className="flex items-center justify-center size-7 rounded-full bg-background-light dark:bg-background-dark">
                    <Icon name={stat.icon} size={16} className="text-muted-foreground" />
                  </div>
                  <span>{stat.value}</span>
                </div>
              ))}
            </div>

            {/* Header actions */}
            <div className="grid grid-cols-[minmax(0,1.8fr)_auto_auto] gap-2 w-full mt-2">
              <button className="h-10 rounded-lg bg-primary-500 text-white text-sm font-semibold flex items-center justify-center gap-2 hover:bg-primary-600 transition-colors">
                <Icon name="add" size={18} />
                Add to Campaign
              </button>
              <button className="h-10 w-10 rounded-lg bg-background-light dark:bg-background-dark border border-border flex items-center justify-center hover:bg-surface-card transition-colors">
                <Icon name="chat_bubble" size={18} className="text-muted-foreground" />
              </button>
              <button className="h-10 w-10 rounded-lg bg-background-light dark:bg-background-dark border border-border flex items-center justify-center hover:bg-surface-card transition-colors">
                <Icon name="share" size={18} className="text-muted-foreground" />
              </button>
            </div>
          </section>

          {/* Metrics Grid */}
          <section className="grid grid-cols-2 gap-3">
            {metrics.map((metric) => (
              <div
                key={metric.label}
                className="bg-surface-card border border-border rounded-xl p-4 flex flex-col gap-1"
              >
                <span className="text-xs text-muted-foreground">{metric.label}</span>
                <span className="text-lg font-bold text-slate-900 dark:text-slate-100">{metric.value}</span>
                <span
                  className={`text-[11px] font-semibold flex items-center gap-1 ${
                    metric.trendPositive ? "text-emerald-400" : "text-muted-foreground"
                  }`}
                >
                  {metric.trendPositive && <Icon name="trending_up" size={14} />}
                  {metric.trend}
                </span>
              </div>
            ))}
          </section>

          {/* Tabs Strip */}
          <div className="bg-surface-card border border-border rounded-2xl overflow-hidden">
            <div className="flex overflow-x-auto hide-scrollbar border-b border-border">
              {[
                { id: "overview" as const, label: "Overview" },
                { id: "audience" as const, label: "Audience" },
                { id: "collabs" as const, label: "Collabs" },
                { id: "content" as const, label: "Content" },
              ].map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`relative px-4 py-3 text-sm font-semibold whitespace-nowrap ${
                      isActive
                        ? "text-slate-900 dark:text-slate-100"
                        : "text-muted-foreground hover:text-slate-900 dark:hover:text-slate-100"
                    }`}
                  >
                    {tab.label}
                    {isActive && (
                      <span className="absolute inset-x-2 -bottom-[1px] h-0.5 rounded-full bg-primary-500" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Content Sections (always rendered, tab mainly affects emphasis for now) */}
            <div className="flex flex-col gap-4 p-4">
              {/* Overview */}
              <section className="flex flex-col gap-3">
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">About creator</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Hi! I&apos;m Sarah, a certified personal trainer and nutrition coach based in LA. I share daily workout
                  routines, healthy meal preps, and wellness tips to help women build strength and confidence.
                </p>
                <div className="flex flex-col gap-2 mt-1">
                  <h4 className="text-xs font-semibold text-slate-900 dark:text-slate-100 uppercase tracking-wide">
                    Content themes
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {["Home Workouts", "Meal Prep", "Mental Health", "Athleisure"].map((theme) => (
                      <span
                        key={theme}
                        className="px-3 py-1.5 rounded-full bg-primary-500/10 text-primary-500 text-xs font-semibold"
                      >
                        {theme}
                      </span>
                    ))}
                  </div>
                </div>
              </section>

              {/* Audience Snapshot */}
              <section className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Audience snapshot</h3>
                  <button className="text-xs font-semibold text-primary-500 hover:text-primary-400">
                    View full report
                  </button>
                </div>
                <div className="flex flex-col gap-3">
                  {audienceRows.map((row) => (
                    <div key={row.label}>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">{row.label}</span>
                        <span className="font-semibold text-slate-900 dark:text-slate-100">{row.value}</span>
                      </div>
                      <div className="mt-1 h-1.5 w-full rounded-full bg-surface-card">
                        <div
                          className="h-full rounded-full bg-primary-500"
                          style={{ width: `${row.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Recent Collabs */}
              <section className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Recent collabs</h3>
                  <button className="text-xs font-semibold text-primary-500 hover:text-primary-400">
                    View all
                  </button>
                </div>
                <div className="flex flex-col gap-3">
                  {collabs.map((collab) => (
                    <article
                      key={collab.brand + collab.campaign}
                      className="bg-surface-card border border-border rounded-xl p-3 flex items-start gap-3"
                    >
                      <div className="flex items-center justify-center size-10 rounded-full bg-background-light dark:bg-background-dark border border-border text-xs font-bold text-slate-900 dark:text-slate-100">
                        {collab.brand
                          .split(" ")
                          .map((part) => part[0])
                          .join("")
                          .slice(0, 2)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate">
                          {collab.brand}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">{collab.campaign}</p>
                        <div className="mt-2 flex flex-wrap items-center gap-2">
                          {collab.platforms.map((platform) => (
                            <span
                              key={platform}
                              className="px-2 py-0.5 rounded-full bg-background-light dark:bg-background-dark text-[11px] font-medium text-muted-foreground"
                            >
                              {platform}
                            </span>
                          ))}
                          <span className="ml-auto text-[11px] font-semibold text-emerald-400 whitespace-nowrap">
                            {collab.result}
                          </span>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </section>

              {/* Optional bottom action row */}
              <section className="flex items-center gap-3 pt-2">
                <button className="flex-1 h-11 rounded-lg border border-border bg-background-light dark:bg-background-dark text-sm font-semibold text-slate-900 dark:text-slate-100 hover:bg-surface-card transition-colors">
                  Save profile
                </button>
                <button className="flex-[1.4] h-11 rounded-lg bg-primary-500 text-white text-sm font-semibold flex items-center justify-center gap-2 hover:bg-primary-600 transition-colors">
                  <Icon name="handshake" size={18} />
                  Contact for collab
                </button>
              </section>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
