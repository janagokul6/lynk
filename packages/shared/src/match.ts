import { z } from "zod";
import { creatorPlatformSchema } from "./creator.js";

export const creatorMatchQuerySchema = z.object({
  q: z
    .string()
    .trim()
    .min(1)
    .max(200)
    .optional()
    .describe("Free-text search across creator niche, handle, or display name"),
  niches: z
    .array(z.string().trim().min(1))
    .max(20)
    .optional()
    .describe("Niche tags such as beauty, tech, fashion"),
  platform: creatorPlatformSchema.optional().describe("youtube or instagram"),
  minFollowers: z.coerce
    .number()
    .int()
    .nonnegative()
    .optional()
    .describe("Minimum follower count"),
  limit: z.coerce.number().int().min(1).max(50).default(20).describe("Max results to return"),
});
export type CreatorMatchQuery = z.infer<typeof creatorMatchQuerySchema>;

export const creatorMatchHitSchema = z.object({
  id: z.string().uuid(),
  platform: creatorPlatformSchema,
  handle: z.string(),
  displayName: z.string(),
  imageUrl: z.string().url().nullable().optional(),
  followerCount: z.number().int().nonnegative().nullable().optional(),
  engagementRate: z.number().nonnegative().nullable().optional(),
  niches: z.array(z.string()).default([]),
  country: z.string().nullable().optional(),
});
export type CreatorMatchHit = z.infer<typeof creatorMatchHitSchema>;

export const creatorMatchResultSchema = z.object({
  count: z.number().int().nonnegative(),
  creators: z.array(creatorMatchHitSchema),
});
export type CreatorMatchResult = z.infer<typeof creatorMatchResultSchema>;
