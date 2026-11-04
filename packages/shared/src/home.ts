import { z } from "zod";
import { applicationSchema } from "./application.js";
import { userPlanSchema } from "./plan.js";
import { userRoleSchema } from "./roles.js";

export const homeCampaignCardSchema = z.object({
  id: z.string().uuid(),
  title: z.string(),
  brandName: z.string().nullable(),
  niches: z.array(z.string()),
  platforms: z.array(z.string()),
  payMin: z.string(),
  payMax: z.string(),
  location: z.string().nullable(),
  compensationType: z.string(),
  status: z.string().optional(),
  description: z.string().optional(),
});
export type HomeCampaignCard = z.infer<typeof homeCampaignCardSchema>;

export const brandBriefingSchema = z.object({
  pendingApplicants: z.number().int().nonnegative(),
  recentApplicants: z.array(applicationSchema),
  liveCampaigns: z.number().int().nonnegative(),
  draftCampaigns: z.number().int().nonnegative(),
  shortlistCount: z.number().int().nonnegative(),
});

export const influencerBriefingSchema = z.object({
  matchedOn: z.enum(["niches", "newest"]),
  nicheNote: z.string(),
  campaigns: z.array(homeCampaignCardSchema),
  applications: z.object({
    pending: z.number().int().nonnegative(),
    accepted: z.number().int().nonnegative(),
    rejected: z.number().int().nonnegative(),
    withdrawn: z.number().int().nonnegative(),
    recent: z.array(applicationSchema),
  }),
});

export const homeResponseSchema = z.object({
  role: userRoleSchema,
  plan: userPlanSchema,
  sideBySide: z.boolean(),
  name: z.string(),
  briefing: z.union([brandBriefingSchema, influencerBriefingSchema]),
});
export type HomeResponse = z.infer<typeof homeResponseSchema>;

export const brandSuggestedPrompts = [
  "Find beauty creators on Instagram",
  "Who is waiting on my campaigns?",
  "Estimate ROI for a creator I shortlist",
  "Draft a skincare campaign, but do not publish it",
] as const;

export const influencerSuggestedPrompts = [
  "Which live campaigns fit me?",
  "What's pending on my applications?",
  "Show public marketplace insights",
  "Do I have any messages?",
] as const;
