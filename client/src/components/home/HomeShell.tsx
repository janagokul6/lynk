"use client";

import { CopilotKit } from "@copilotkit/react-core";
import "@copilotkit/react-ui/styles.css";
import { brandSuggestedPrompts, homePathForRole, influencerSuggestedPrompts, type HomeResponse } from "@lynk/shared";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { RoleAgentChat } from "@/components/agent/RoleAgentChat";
import { BrandDashboardNav } from "@/components/layout/nav/BrandDashboardNav";
import { InfluencerDashboardNav } from "@/components/layout/nav/InfluencerDashboardNav";
import { api } from "@/lib/api";
import { readAgentLlm } from "@/lib/agent-status";
import { clientEnv } from "@/lib/env";
import { readHomeView, toggleHomeView, writeHomeView, type HomeView } from "@/lib/home-view";
import { cn } from "@/lib/utils";
import { BrandDashboardPanel } from "./BrandDashboardPanel";
import { HomeViewToggle } from "./HomeViewToggle";
import { InfluencerDashboardPanel } from "./InfluencerDashboardPanel";

type MeUser = { id?: string; role?: string; name?: string; plan?: string };

function Briefing({ role, home }: { role: "brand" | "influencer"; home: HomeResponse | null }) {
  if (!home) return <p className="text-sm text-slate-500">Loading your briefing…</p>;
  if (role === "brand" && "pendingApplicants" in home.briefing) {
    const briefing = home.briefing;
    return (
      <div className="rounded-2xl border border-border bg-white p-4 text-sm dark:bg-surface-dark">
        <p className="text-xs font-bold uppercase tracking-wide text-primary">Today</p>
        <p className="mt-1 text-slate-800 dark:text-slate-100">
          {briefing.pendingApplicants} applicant{briefing.pendingApplicants === 1 ? "" : "s"} waiting ·{" "}
          {briefing.liveCampaigns} live · {briefing.draftCampaigns} draft · {briefing.shortlistCount} shortlisted
        </p>
      </div>
    );
  }
  if (role === "influencer" && "applications" in home.briefing) {
    const briefing = home.briefing;
    return (
      <div className="rounded-2xl border border-border bg-white p-4 text-sm dark:bg-surface-dark">
        <p className="text-xs font-bold uppercase tracking-wide text-primary">Today</p>
        <p className="mt-1 text-slate-800 dark:text-slate-100">
          {briefing.applications.pending} pending · {briefing.applications.accepted} accepted ·{" "}
          {briefing.campaigns.length} live campaign{briefing.campaigns.length === 1 ? "" : "s"} to look at
        </p>
        <p className="mt-1 text-xs text-slate-500">{briefing.nicheNote}</p>
      </div>
    );
  }
  return null;
}

export function HomeShell({ role }: { role: "brand" | "influencer" }) {
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [home, setHome] = useState<HomeResponse | null>(null);
  const [view, setView] = useState<HomeView>("chat");
  const [llm, setLlm] = useState<{ llm: boolean; reason: string } | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const me = await api.get<{ user?: MeUser } | null>("/api/me");
      const user = me.data?.user;
      if (!user?.role || !user.id) {
        router.replace("/login");
        return;
      }
      if (user.role !== role) {
        router.replace(homePathForRole(user.role));
        return;
      }
      const [homeRes, status] = await Promise.all([
        api.get<HomeResponse>("/api/home"),
        readAgentLlm(clientEnv.NEXT_PUBLIC_COPILOTKIT_RUNTIME_URL),
      ]);
      if (cancelled) return;
      setUserId(user.id);
      setName(user.name || (role === "brand" ? "Brand" : "Creator"));
      setHome(homeRes.data);
      setLlm(status);
      setView(readHomeView(window.localStorage, user.id));
      setReady(true);
    })().catch(() => {
      if (!cancelled) router.replace("/login");
    });
    return () => {
      cancelled = true;
    };
  }, [role, router]);

  function onToggle() {
    setView((current) => {
      const next = toggleHomeView(current);
      if (userId) writeHomeView(window.localStorage, userId, next);
      return next;
    });
  }

  const pro = home?.sideBySide === true;
  const prompts = role === "brand" ? brandSuggestedPrompts : influencerSuggestedPrompts;
  const chat = (
    <div className="flex h-full flex-col gap-3 p-3">
      <Briefing role={role} home={home} />
      {llm == null ? (
        <p className="text-sm text-slate-500">Checking the assistant…</p>
      ) : llm.llm ? (
        <CopilotKit
          runtimeUrl={clientEnv.NEXT_PUBLIC_COPILOTKIT_RUNTIME_URL}
          agent={role === "brand" ? "brandAgent" : "influencerAgent"}
          credentials="include"
        >
          <RoleAgentChat role={role} prompts={prompts} view={view} onToggle={onToggle} />
        </CopilotKit>
      ) : (
        <div className="space-y-3">
          <div className="rounded-2xl border border-dashed border-border bg-white p-4 text-sm text-slate-700 dark:bg-surface-dark dark:text-slate-200">
            {llm.reason}
          </div>
          <div className="flex flex-wrap gap-2">
            {prompts.map((prompt) => (
              <span key={prompt} className="rounded-full border border-border px-3 py-1 text-[11px] text-slate-500">
                {prompt}
              </span>
            ))}
          </div>
          <div className="flex justify-end">
            <HomeViewToggle view={view} onToggle={onToggle} testId="home-view-toggle-composer" />
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark lg:pl-64">
      {role === "brand" ? <BrandDashboardNav activeTab="Home" /> : <InfluencerDashboardNav activeTab="Home" />}
      <header className="flex h-14 items-center justify-between gap-3 border-b border-border px-4">
        <div>
          <p className="text-sm font-bold text-slate-900 dark:text-white">{ready ? name : "Lynk"}</p>
          <p className="text-[11px] text-slate-500">
            {role === "brand" ? "Brand" : "Creator"}
            {home ? ` · ${home.plan === "pro" ? "Pro · chat and dashboard together on wide screens" : "Free · chat or dashboard"}` : ""}
          </p>
        </div>
        <HomeViewToggle view={view} onToggle={onToggle} />
      </header>
      <div className={cn("min-h-[calc(100vh-3.5rem)] pb-20 lg:pb-4", pro && "lg:grid lg:grid-cols-2")}>
        <section className={cn("flex h-[calc(100vh-3.5rem)] min-h-[32rem] flex-col", view === "dashboard" && (pro ? "hidden lg:flex" : "hidden"))}>{chat}</section>
        <section
          className={cn(
            "min-h-[70vh] border-border lg:border-l",
            view === "chat" && (pro ? "hidden lg:block" : "hidden")
          )}
        >
          {role === "brand" ? <BrandDashboardPanel key={view} /> : <InfluencerDashboardPanel key={view} />}
        </section>
      </div>
    </div>
  );
}
