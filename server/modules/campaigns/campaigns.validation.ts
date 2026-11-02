import { z } from "zod";
import {
  marketplaceCategorySchema,
  marketplaceLocationSchema,
  marketplacePlatformSchema,
  marketplaceWorkTypeSchema,
} from "@lynk/shared";

const campaignStatusSchema = z.enum(["draft", "live", "completed"]);

export const createCampaignBodySchema = z.object({
  status: campaignStatusSchema.optional(),
  title: z.string().trim().min(1).max(512),
  campaignType: z.string().trim().min(1).max(128),
  description: z.string().trim().min(1),
  guidelines: z.string().trim().optional(),
  niches: z.array(marketplaceCategorySchema).default([]),
  platforms: z.array(marketplacePlatformSchema).default([]),
  deliverables: z.array(marketplaceWorkTypeSchema).default([]),
  perks: z.array(z.string()).default([]),
  followerRange: z.string().trim().max(64).optional(),
  minEngagement: z.string().trim().optional(),
  location: marketplaceLocationSchema.optional(),
  minAge: z.number().int().min(0).optional(),
  maxAge: z.number().int().min(0).optional(),
  compensationType: z.string().trim().min(1).max(64),
  payMin: z.string().trim(),
  payMax: z.string().trim(),
  totalBudget: z.string().trim().optional(),
  creatorsNeeded: z.number().int().min(0).optional(),
  applicationDeadline: z.string().trim().optional(),
  startDate: z.string().trim().optional(),
  endDate: z.string().trim().optional(),
  brandName: z.string().trim().max(255).optional(),
  brandImage: z.string().trim().max(1024).optional(),
  campaignImage: z.string().trim().max(1024).optional(),
});

export const updateCampaignBodySchema = createCampaignBodySchema.partial().extend({
  status: campaignStatusSchema.optional(),
});

export const listCampaignsQuerySchema = z.object({
  status: campaignStatusSchema.optional(),
});

export type CreateCampaignBody = z.infer<typeof createCampaignBodySchema>;
export type UpdateCampaignBody = z.infer<typeof updateCampaignBodySchema>;
