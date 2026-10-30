import { z } from "zod";
import { creatorPlatformSchema } from "./creator.js";

export const jobNames = {
  creatorSync: "creator.sync",
} as const;

export const creatorSyncPayloadSchema = z.object({
  platform: creatorPlatformSchema,
  externalId: z.string().min(1),
  handle: z.string().min(1).optional(),
});
export type CreatorSyncPayload = z.infer<typeof creatorSyncPayloadSchema>;
