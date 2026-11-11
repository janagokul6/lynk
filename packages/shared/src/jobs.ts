import { z } from "zod";
import { creatorPlatformSchema } from "./creator.js";

export const jobNames = {
  creatorSync: "creator.sync",
} as const;

export const creatorSyncPayloadSchema = z.object({
  platform: creatorPlatformSchema,
  externalId: z.string().trim().min(1).max(128),
  handle: z.string().trim().min(1).max(128).optional(),
});
export type CreatorSyncPayload = z.infer<typeof creatorSyncPayloadSchema>;
