import { z } from "zod";

export const creatorPlatformSchema = z.enum(["youtube", "instagram", "profile"]);
export type CreatorPlatform = z.infer<typeof creatorPlatformSchema>;

export const creatorProfileSchema = z.object({
  id: z.string().uuid(),
  platform: creatorPlatformSchema,
  externalId: z.string().min(1),
  handle: z.string().min(1),
  displayName: z.string().min(1),
  imageUrl: z.string().url().nullable(),
  followerCount: z.number().int().nonnegative().nullable(),
  engagementRate: z.number().nonnegative().nullable(),
  niches: z.array(z.string()),
  country: z.string().nullable(),
  syncedAt: z.string().datetime(),
});
export type CreatorProfile = z.infer<typeof creatorProfileSchema>;
