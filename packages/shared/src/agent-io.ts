import { z } from "zod";
import { applicationSchema } from "./application.js";
import { creatorMatchHitSchema } from "./match.js";
import { roiEstimateSchema } from "./roi.js";
import { shortlistAddSchema, shortlistGroupCreateSchema, shortlistListSchema, shortlistRemoveSchema } from "./shortlist.js";
import { homeCampaignCardSchema } from "./home.js";

export const TOOL_CONFIRM_HEADER = "x-lynk-confirm";

export const confirmToolNames = [
  "campaigns.create",
  "applications.decide",
  "applications.apply",
] as const;
export type ConfirmToolName = (typeof confirmToolNames)[number];

export function toolNeedsConfirmation(name: string): boolean {
  return (confirmToolNames as readonly string[]).includes(name);
}

export const confirmationProposalSchema = z
  .object({
    needsConfirmation: z.literal(true),
    action: z.string(),
    summary: z.string(),
    input: z.record(z.string(), z.unknown()),
  })
  .strict();
export type ConfirmationProposal = z.infer<typeof confirmationProposalSchema>;

export const compareCreatorsInputSchema = z
  .object({
    creatorIds: z.array(z.string().uuid()).min(2).max(4),
  })
  .strict();

export const compareCreatorsResultSchema = z.object({
  creators: z.array(creatorMatchHitSchema),
  missingIds: z.array(z.string()),
});

export const campaignDraftSchema = z
  .object({
    title: z.string().trim().min(1).max(512),
    campaignType: z.string().trim().min(1).max(128),
    description: z.string().trim().min(1).max(8000),
    guidelines: z.string().trim().max(8000).optional(),
    niches: z.array(z.string().trim().min(1).max(128)).max(20).default([]),
    platforms: z.array(z.string().trim().min(1).max(64)).max(10).default([]),
    deliverables: z.array(z.string().trim().min(1).max(128)).max(20).default([]),
    perks: z.array(z.string().trim().min(1).max(128)).max(20).default([]),
    location: z.string().trim().max(128).optional(),
    compensationType: z.string().trim().min(1).max(64),
    payMin: z.string().trim().min(1).max(32),
    payMax: z.string().trim().min(1).max(32),
    totalBudget: z.string().trim().max(32).optional(),
    creatorsNeeded: z.number().int().min(1).max(1000).optional(),
    brandName: z.string().trim().max(255).optional(),
    publish: z.boolean().default(false),
  })
  .strict();
export type CampaignDraftInput = z.infer<typeof campaignDraftSchema>;

export const campaignPreviewSchema = z.object({
  published: z.literal(false),
  saved: z.literal(false),
  note: z.string(),
  draft: campaignDraftSchema,
});

export const campaignCreatedSchema = z.object({
  id: z.string().uuid(),
  title: z.string(),
  status: z.enum(["draft", "live"]),
  published: z.boolean(),
});

export const roiToolInputSchema = z
  .object({
    creatorIds: z.array(z.string().uuid()).min(1).max(5),
    budget: z.number().positive().optional(),
    campaignId: z.string().uuid().optional(),
  })
  .strict();

export const marketplaceSearchInputSchema = z
  .object({
    q: z.string().trim().min(1).max(200).optional(),
    niches: z.array(z.string().trim().min(1).max(128)).max(20).optional(),
    platforms: z.array(z.string().trim().min(1).max(64)).max(10).optional(),
    limit: z.number().int().min(1).max(20).default(8),
  })
  .strict();

export const marketplaceSearchResultSchema = z.object({
  count: z.number().int().nonnegative(),
  campaigns: z.array(homeCampaignCardSchema),
});

export const applicationListSchema = z.object({
  count: z.number().int().nonnegative(),
  applications: z.array(applicationSchema),
});

export const applicationDecideSchema = z
  .object({
    applicationId: z.string().uuid(),
    decision: z.enum(["accepted", "rejected"]),
  })
  .strict();

export const applicationApplySchema = z
  .object({
    campaignId: z.string().uuid(),
    message: z.string().trim().max(2000).optional(),
  })
  .strict();

export const publicInsightsSchema = z.object({
  scope: z.literal("public-marketplace"),
  liveCampaigns: z.number().int().nonnegative(),
  niches: z.array(z.object({ niche: z.string(), campaigns: z.number().int().nonnegative() })),
  pay: z
    .object({
      lowestMin: z.number(),
      highestMax: z.number(),
      campaignsWithPay: z.number().int().nonnegative(),
    })
    .nullable(),
  note: z.string(),
});

export const messagesStatusSchema = z.object({
  available: z.literal(false),
  message: z.string(),
});

export const agentToolInputSchemas = {
  "creators.compare": compareCreatorsInputSchema,
  "shortlist.list": z.object({}).strict(),
  "shortlist.add": shortlistAddSchema,
  "shortlist.remove": shortlistRemoveSchema,
  "shortlist.group": shortlistGroupCreateSchema,
  "roi.estimate": roiToolInputSchema,
  "campaigns.preview": campaignDraftSchema,
  "campaigns.create": campaignDraftSchema,
  "applications.incoming": z.object({}).strict(),
  "applications.decide": applicationDecideSchema,
  "marketplace.search": marketplaceSearchInputSchema,
  "applications.mine": z.object({}).strict(),
  "applications.apply": applicationApplySchema,
  "insights.public": z.object({}).strict(),
  "messages.status": z.object({}).strict(),
} as const;

export const agentToolOutputSchemas = {
  "creators.compare": compareCreatorsResultSchema,
  "shortlist.list": shortlistListSchema,
  "shortlist.add": shortlistListSchema,
  "shortlist.remove": shortlistListSchema,
  "shortlist.group": shortlistListSchema,
  "roi.estimate": roiEstimateSchema,
  "campaigns.preview": campaignPreviewSchema,
  "campaigns.create": z.union([confirmationProposalSchema, campaignCreatedSchema]),
  "applications.incoming": applicationListSchema,
  "applications.decide": z.union([confirmationProposalSchema, applicationSchema]),
  "marketplace.search": marketplaceSearchResultSchema,
  "applications.mine": applicationListSchema,
  "applications.apply": z.union([confirmationProposalSchema, applicationSchema]),
  "insights.public": publicInsightsSchema,
  "messages.status": messagesStatusSchema,
} as const;
