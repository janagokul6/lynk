import { and, eq, inArray } from "drizzle-orm";
import type {
  CampaignDraftInput,
  CreatorMatchHit,
  RoiEstimate,
} from "@lynk/shared";
import { estimateRoi } from "@lynk/shared";
import { db } from "../../lib/db.js";
import { campaign, creatorProfile } from "../../db/schema.js";
import { createApplication, decideApplication, getApplicationById, listForBrand, listForInfluencer } from "../applications/applications.service.js";
import { createCampaign } from "../campaigns/campaigns.service.js";
import { listMarketplaceCampaigns } from "../marketplace/marketplace.service.js";
import { addToShortlist, createGroup, listShortlist, removeFromShortlist } from "../shortlist/shortlist.service.js";
import { confirmationProposal, ToolError } from "./tools.errors.js";

function publicImage(value: string | null): string | null {
  if (!value) return null;
  try {
    const url = new URL(value);
    if (url.protocol === "http:" || url.protocol === "https:") return value;
  } catch {
    return null;
  }
  return null;
}

function asHit(row: typeof creatorProfile.$inferSelect): CreatorMatchHit {
  const rate = row.engagementRate == null ? null : Number(row.engagementRate);
  return {
    id: row.id,
    platform: row.platform as "youtube" | "instagram",
    handle: row.handle,
    displayName: row.displayName,
    imageUrl: publicImage(row.imageUrl),
    followerCount: row.followerCount,
    engagementRate: rate != null && Number.isFinite(rate) ? rate : null,
    niches: row.niches ?? [],
    country: row.country,
  };
}

function requireUser(userId: string | undefined): string {
  if (!userId) throw new ToolError("Unauthorized", 401);
  return userId;
}

export async function compareCreators(input: { creatorIds: string[] }) {
  const rows = await db
    .select()
    .from(creatorProfile)
    .where(inArray(creatorProfile.id, input.creatorIds));
  const byId = new Map(rows.map((row) => [row.id, row]));
  const creators = input.creatorIds.flatMap((id) => {
    const row = byId.get(id);
    return row ? [asHit(row)] : [];
  });
  const missingIds = input.creatorIds.filter((id) => !byId.has(id));
  return { creators, missingIds };
}

export async function estimateBrandRoi(
  userId: string | undefined,
  input: { creatorIds: string[]; budget?: number; campaignId?: string }
): Promise<RoiEstimate> {
  const owner = requireUser(userId);
  let budget = input.budget ?? null;
  let budgetSource: "provided" | "campaign-pay-midpoint" | "missing" = budget != null ? "provided" : "missing";
  if (input.campaignId) {
    const [owned] = await db
      .select({ payMin: campaign.payMin, payMax: campaign.payMax })
      .from(campaign)
      .where(and(eq(campaign.id, input.campaignId), eq(campaign.userId, owner)))
      .limit(1);
    if (!owned) throw new ToolError("Campaign not found", 404);
    if (budget == null) {
      const low = Number(owned.payMin);
      const high = Number(owned.payMax);
      if (Number.isFinite(low) && Number.isFinite(high)) {
        budget = (low + high) / 2;
        budgetSource = "campaign-pay-midpoint";
      }
    }
  }
  const rows = await db.select().from(creatorProfile).where(inArray(creatorProfile.id, input.creatorIds));
  const byId = new Map(rows.map((row) => [row.id, row]));
  const creators = input.creatorIds.map((id) => {
    const row = byId.get(id);
    if (!row) {
      return {
        id,
        handle: "unknown",
        displayName: "Unknown creator",
        followerCount: null,
        engagementRate: null,
      };
    }
    return {
      id: row.id,
      handle: row.handle,
      displayName: row.displayName,
      followerCount: row.followerCount,
      engagementRate: row.engagementRate == null ? null : Number(row.engagementRate),
    };
  });
  return estimateRoi({ creators, budget, budgetSource });
}

export async function previewCampaign(input: CampaignDraftInput) {
  return {
    published: false as const,
    saved: false as const,
    note: "Preview only. Nothing was saved or posted to the marketplace.",
    draft: input,
  };
}

export async function createCampaignFromTool(
  userId: string | undefined,
  input: CampaignDraftInput,
  confirmed: boolean
) {
  const owner = requireUser(userId);
  if (!confirmed) {
    return confirmationProposal(
      input.publish ? "Post campaign" : "Save campaign draft",
      input.publish
        ? `Post “${input.title}” to the marketplace. Creators will be able to apply.`
        : `Save “${input.title}” as a draft. It will not be listed.`,
      input
    );
  }
  const row = await createCampaign({
    userId: owner,
    status: input.publish ? "live" : "draft",
    title: input.title,
    campaignType: input.campaignType,
    description: input.description,
    guidelines: input.guidelines,
    niches: input.niches,
    platforms: input.platforms,
    deliverables: input.deliverables,
    perks: input.perks,
    location: input.location,
    compensationType: input.compensationType,
    payMin: input.payMin,
    payMax: input.payMax,
    totalBudget: input.totalBudget,
    creatorsNeeded: input.creatorsNeeded,
    brandName: input.brandName,
  });
  return {
    id: row.id,
    title: row.title,
    status: row.status === "live" ? ("live" as const) : ("draft" as const),
    published: row.status === "live",
  };
}

export async function searchMarketplace(input: {
  q?: string;
  niches?: string[];
  platforms?: string[];
  limit?: number;
}) {
  const rows = await listMarketplaceCampaigns({
    search: input.q,
    categories: input.niches,
    platforms: input.platforms,
    sort: "Newest",
    limit: input.limit ?? 8,
  });
  return {
    count: rows.length,
    campaigns: rows.map((row) => ({
      id: row.id,
      title: row.title,
      brandName: row.brandName,
      niches: row.niches ?? [],
      platforms: row.platforms ?? [],
      payMin: row.payMin,
      payMax: row.payMax,
      location: row.location,
      compensationType: row.compensationType,
    })),
  };
}

export async function publicInsights() {
  const rows = await db
    .select({
      niches: campaign.niches,
      payMin: campaign.payMin,
      payMax: campaign.payMax,
    })
    .from(campaign)
    .where(eq(campaign.status, "live"))
    .limit(500);
  const nicheCounts = new Map<string, number>();
  let lowestMin = Number.POSITIVE_INFINITY;
  let highestMax = 0;
  let campaignsWithPay = 0;
  for (const row of rows) {
    for (const niche of row.niches ?? []) {
      nicheCounts.set(niche, (nicheCounts.get(niche) ?? 0) + 1);
    }
    const min = Number(row.payMin);
    const max = Number(row.payMax);
    if (Number.isFinite(min) && Number.isFinite(max)) {
      campaignsWithPay += 1;
      lowestMin = Math.min(lowestMin, min);
      highestMax = Math.max(highestMax, max);
    }
  }
  const niches = [...nicheCounts.entries()]
    .map(([niche, campaigns]) => ({ niche, campaigns }))
    .sort((a, b) => b.campaigns - a.campaigns)
    .slice(0, 12);
  return {
    scope: "public-marketplace" as const,
    liveCampaigns: rows.length,
    niches,
    pay:
      campaignsWithPay > 0
        ? { lowestMin, highestMax, campaignsWithPay }
        : null,
    note: "Public marketplace aggregates only. Other creators' applications, earnings, and messages are not included.",
  };
}

export async function myApplications(userId: string | undefined) {
  const applications = await listForInfluencer(requireUser(userId));
  return { count: applications.length, applications };
}

export async function incomingApplications(userId: string | undefined) {
  const applications = await listForBrand(requireUser(userId));
  return { count: applications.length, applications };
}

export async function applyToCampaign(
  userId: string | undefined,
  input: { campaignId: string; message?: string },
  confirmed: boolean
) {
  const influencerId = requireUser(userId);
  const [live] = await db
    .select({ id: campaign.id, title: campaign.title })
    .from(campaign)
    .where(and(eq(campaign.id, input.campaignId), eq(campaign.status, "live")))
    .limit(1);
  if (!live) throw new ToolError("Campaign not found", 404);
  if (!confirmed) {
    return confirmationProposal(
      "Apply to campaign",
      `Apply to “${live.title}”. The brand will see your application.`,
      input
    );
  }
  const result = await createApplication({
    influencerId,
    campaignId: input.campaignId,
    message: input.message,
  });
  if (!result.ok) throw new ToolError(result.error, result.status);
  return result.application;
}

export async function decideApplicant(
  userId: string | undefined,
  input: { applicationId: string; decision: "accepted" | "rejected" },
  confirmed: boolean
) {
  const brandId = requireUser(userId);
  const existing = await getApplicationById(input.applicationId);
  if (!existing) throw new ToolError("Application not found", 404);
  const [owned] = await db
    .select({ id: campaign.id, title: campaign.title })
    .from(campaign)
    .where(and(eq(campaign.id, existing.campaignId), eq(campaign.userId, brandId)))
    .limit(1);
  if (!owned) throw new ToolError("Application not found", 404);
  if (!confirmed) {
    return confirmationProposal(
      input.decision === "accepted" ? "Accept applicant" : "Reject applicant",
      `${input.decision === "accepted" ? "Accept" : "Reject"} ${existing.influencerName} on “${owned.title}”.`,
      input
    );
  }
  const result = await decideApplication(input.applicationId, brandId, input.decision);
  if (!result.ok) throw new ToolError(result.error, result.status);
  return result.application;
}

export function messagingStatus() {
  return {
    available: false as const,
    message: "Messaging is not available yet.",
  };
}

export const shortlistHandlers = {
  list: listShortlist,
  add: addToShortlist,
  remove: removeFromShortlist,
  group: createGroup,
};
