import { z } from "zod";
import { creatorPlatformSchema } from "./creator.js";

export const socialConnectionCreateSchema = z.object({
  platform: creatorPlatformSchema,
  externalAccountId: z.string().trim().min(1).max(255),
  handle: z.string().trim().min(1).max(255).optional(),
  accessToken: z.string().min(1).optional(),
  refreshToken: z.string().min(1).optional(),
  scopes: z.string().optional(),
});
export type SocialConnectionCreate = z.infer<typeof socialConnectionCreateSchema>;
