import { z } from "zod";
import { marketplaceCategorySchema } from "./marketplace.js";

const optionalUrl = z.union([z.literal(""), z.string().trim().url().max(1024)]).optional();

export const brandProfileInputSchema = z.object({
  companyName: z.string().trim().min(1).max(255),
  logoUrl: optionalUrl,
  category: marketplaceCategorySchema.optional(),
  website: optionalUrl,
});
export type BrandProfileInput = z.infer<typeof brandProfileInputSchema>;

export const brandProfileSchema = z.object({
  companyName: z.string(),
  logoUrl: z.string().nullable(),
  category: z.string().nullable(),
  website: z.string().nullable(),
});
export type BrandProfile = z.infer<typeof brandProfileSchema>;

export const creatorRatesSchema = z.object({
  story: z.string().trim().max(32).optional(),
  reel: z.string().trim().max(32).optional(),
  post: z.string().trim().max(32).optional(),
});
export type CreatorRates = z.infer<typeof creatorRatesSchema>;

export const influencerProfileInputSchema = z.object({
  bio: z.string().trim().max(4000).default(""),
  niches: z.array(z.string().trim().min(1).max(128)).max(12).default([]),
  location: z.string().trim().max(128).optional().or(z.literal("")),
  rates: creatorRatesSchema.default({}),
});
export type InfluencerProfileInput = z.infer<typeof influencerProfileInputSchema>;

export const influencerProfileSchema = influencerProfileInputSchema.extend({
  location: z.string().nullable(),
});
export type InfluencerProfile = z.infer<typeof influencerProfileSchema>;
