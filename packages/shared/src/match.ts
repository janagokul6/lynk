import { z } from "zod";
import { creatorPlatformSchema } from "./creator.js";

export const creatorMatchQuerySchema = z.object({
  q: z.string().trim().min(1).max(200).optional(),
  niches: z.array(z.string().trim().min(1)).max(20).optional(),
  platform: creatorPlatformSchema.optional(),
  minFollowers: z.coerce.number().int().nonnegative().optional(),
  limit: z.coerce.number().int().min(1).max(50).default(20),
});
export type CreatorMatchQuery = z.infer<typeof creatorMatchQuerySchema>;
