import { z } from "zod";

export const shortlistGroupCreateSchema = z
  .object({
    name: z.string().trim().min(1).max(80),
  })
  .strict();
export type ShortlistGroupCreate = z.infer<typeof shortlistGroupCreateSchema>;

export const shortlistAddSchema = z
  .object({
    creatorId: z.string().uuid(),
    groupId: z.string().uuid().optional(),
    groupName: z.string().trim().min(1).max(80).optional(),
  })
  .strict();
export type ShortlistAddInput = z.infer<typeof shortlistAddSchema>;

export const shortlistRemoveSchema = z
  .object({
    creatorId: z.string().uuid(),
  })
  .strict();

export const shortlistCreatorSchema = z.object({
  id: z.string().uuid(),
  platform: z.string(),
  handle: z.string(),
  displayName: z.string(),
  followerCount: z.number().int().nullable(),
  engagementRate: z.number().nullable(),
  niches: z.array(z.string()),
  country: z.string().nullable(),
});

export const shortlistItemSchema = z.object({
  id: z.string().uuid(),
  creatorId: z.string().uuid(),
  groupId: z.string().uuid().nullable(),
  createdAt: z.string(),
  creator: shortlistCreatorSchema,
});
export type ShortlistItem = z.infer<typeof shortlistItemSchema>;

export const shortlistGroupSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  createdAt: z.string(),
});

export const shortlistListSchema = z.object({
  groups: z.array(shortlistGroupSchema),
  items: z.array(shortlistItemSchema),
});
export type ShortlistList = z.infer<typeof shortlistListSchema>;
