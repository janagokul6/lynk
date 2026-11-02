import { z } from "zod";
import {
  marketplaceCategorySchema,
  marketplaceLocationSchema,
  marketplacePlatformSchema,
  marketplaceWorkTypeSchema,
} from "./marketplace.js";

export const campaignStatusSchema = z.enum([
  "draft",
  "live",
  "completed",
]);
export type CampaignStatus = z.infer<typeof campaignStatusSchema>;

export const campaignCreateSchema = z.object({
  title: z.string().trim().min(1).max(512),
  campaignType: z.string().trim().min(1).max(128),
  description: z.string().trim().min(1),
  guidelines: z.string().trim().max(10000).optional(),
  niches: z.array(marketplaceCategorySchema).default([]),
  platforms: z.array(marketplacePlatformSchema).default([]),
  deliverables: z.array(marketplaceWorkTypeSchema).default([]),
  perks: z.array(z.string().trim().min(1)).default([]),
  followerRange: z.string().trim().max(64).optional(),
  minEngagement: z.number().min(0).max(100).optional(),
  location: marketplaceLocationSchema.optional(),
  minAge: z.number().int().min(13).max(100).optional(),
  maxAge: z.number().int().min(13).max(100).optional(),
  compensationType: z.string().trim().min(1).max(64),
  payMin: z.number().nonnegative(),
  payMax: z.number().nonnegative(),
  totalBudget: z.number().nonnegative().optional(),
  creatorsNeeded: z.number().int().positive().optional(),
  applicationDeadline: z.string().date().optional(),
  startDate: z.string().date().optional(),
  endDate: z.string().date().optional(),
  brandName: z.string().trim().max(255).optional(),
  brandImage: z.string().url().max(1024).optional(),
  campaignImage: z.string().url().max(1024).optional(),
});
export type CampaignCreateInput = z.infer<typeof campaignCreateSchema>;
