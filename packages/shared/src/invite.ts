import { z } from "zod";

export const inviteStatusSchema = z.enum(["pending", "accepted", "declined"]);
export type InviteStatus = z.infer<typeof inviteStatusSchema>;

export const inviteCreateSchema = z
  .object({
    campaignId: z.string().uuid(),
    creatorId: z.string().uuid(),
  })
  .strict();
export type InviteCreateInput = z.infer<typeof inviteCreateSchema>;

export const inviteRespondSchema = z
  .object({
    inviteId: z.string().uuid(),
    decision: z.enum(["accepted", "declined"]),
  })
  .strict();
export type InviteRespondInput = z.infer<typeof inviteRespondSchema>;

export const inviteSchema = z.object({
  id: z.string().uuid(),
  campaignId: z.string().uuid(),
  campaignTitle: z.string(),
  creatorId: z.string().uuid(),
  influencerId: z.string(),
  status: inviteStatusSchema,
  createdAt: z.string(),
});
export type InviteRecord = z.infer<typeof inviteSchema>;
