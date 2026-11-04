import { count, eq, inArray } from "drizzle-orm";
import type { ApplicationRecord, HomeCampaignCard } from "@lynk/shared";
import { normalizePlan, sideBySideForPlan } from "@lynk/shared";
import { db } from "../../lib/db.js";
import { campaign, shortlistItem, user } from "../../db/schema.js";
import * as applications from "../applications/applications.service.js";
import { listCampaignsByUser } from "../campaigns/campaigns.service.js";
import { listMarketplaceCampaigns, type MarketplaceCampaignRow } from "../marketplace/marketplace.service.js";

function toCard(row: MarketplaceCampaignRow | {
  id: string;
  title: string;
  brandName: string | null;
  niches: string[] | null;
  platforms: string[] | null;
  payMin: string;
  payMax: string;
  location: string | null;
  compensationType: string;
}): HomeCampaignCard {
  return {
    id: row.id,
    title: row.title,
    brandName: row.brandName,
    niches: row.niches ?? [],
    platforms: row.platforms ?? [],
    payMin: row.payMin,
    payMax: row.payMax,
    location: row.location,
    compensationType: row.compensationType,
  };
}

function counts(rows: ApplicationRecord[]) {
  return {
    pending: rows.filter((row) => row.status === "pending").length,
    accepted: rows.filter((row) => row.status === "accepted").length,
    rejected: rows.filter((row) => row.status === "rejected").length,
    withdrawn: rows.filter((row) => row.status === "withdrawn").length,
    recent: rows.slice(0, 5),
  };
}

export async function loadAccount(userId: string) {
  const [row] = await db
    .select({ role: user.role, plan: user.plan, name: user.name })
    .from(user)
    .where(eq(user.id, userId))
    .limit(1);
  return row ?? null;
}

export async function brandHome(userId: string, name: string, planValue: unknown) {
  const plan = normalizePlan(planValue);
  const [apps, campaigns, shortlist] = await Promise.all([
    applications.listForBrand(userId),
    listCampaignsByUser(userId),
    db.select({ value: count() }).from(shortlistItem).where(eq(shortlistItem.userId, userId)),
  ]);
  const pending = apps.filter((row) => row.status === "pending");
  return {
    role: "brand" as const,
    plan,
    sideBySide: sideBySideForPlan(plan),
    name,
    briefing: {
      pendingApplicants: pending.length,
      recentApplicants: pending.slice(0, 5),
      liveCampaigns: campaigns.filter((row) => row.status === "live").length,
      draftCampaigns: campaigns.filter((row) => row.status === "draft").length,
      shortlistCount: Number(shortlist[0]?.value ?? 0),
    },
  };
}

export async function influencerHome(userId: string, name: string, planValue: unknown) {
  const plan = normalizePlan(planValue);
  const apps = await applications.listForInfluencer(userId);
  const appliedIds = apps.map((row) => row.campaignId);
  let niches: string[] = [];
  if (appliedIds.length > 0) {
    const rows = await db
      .select({ niches: campaign.niches })
      .from(campaign)
      .where(inArray(campaign.id, appliedIds));
    niches = [...new Set(rows.flatMap((row) => row.niches ?? []))];
  }

  let matchedOn: "niches" | "newest" = niches.length > 0 ? "niches" : "newest";
  let nicheNote =
    matchedOn === "niches"
      ? "Live campaigns overlapping niches from campaigns you already applied to."
      : "No niche profile is stored on your account yet, so these are the newest live campaigns.";

  const filters = {
    categories: matchedOn === "niches" ? niches : undefined,
    sort: "Newest" as const,
    limit: 8,
  };
  let rows = await listMarketplaceCampaigns(filters);
  let cards = rows
    .filter((row) => !appliedIds.includes(row.id))
    .slice(0, 5)
    .map(toCard);
  if (cards.length === 0 && matchedOn === "niches") {
    matchedOn = "newest";
    nicheNote = "No other live campaigns match your previous niches, so these are the newest listings.";
    rows = await listMarketplaceCampaigns({ sort: "Newest", limit: 8 });
    cards = rows
      .filter((row) => !appliedIds.includes(row.id))
      .slice(0, 5)
      .map(toCard);
  }

  return {
    role: "influencer" as const,
    plan,
    sideBySide: sideBySideForPlan(plan),
    name,
    briefing: {
      matchedOn,
      nicheNote,
      campaigns: cards,
      applications: counts(apps),
    },
  };
}
