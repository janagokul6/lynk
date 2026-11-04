import { z } from "zod";

export const applicationStatusSchema = z.enum([
  "pending",
  "accepted",
  "rejected",
  "withdrawn",
]);
export type ApplicationStatus = z.infer<typeof applicationStatusSchema>;

const optionalPitch = z.preprocess((value) => {
  if (typeof value !== "string") return value;
  const trimmed = value.trim();
  return trimmed.length === 0 ? undefined : trimmed;
}, z.string().max(2000).optional());

export const applicationCreateSchema = z.object({
  campaignId: z.string().uuid(),
  message: optionalPitch,
});
export type ApplicationCreateInput = z.infer<typeof applicationCreateSchema>;

export const applicationSchema = z.object({
  id: z.string().uuid(),
  campaignId: z.string().uuid(),
  influencerId: z.string().min(1),
  status: applicationStatusSchema,
  message: z.string().nullable(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  campaignTitle: z.string().optional(),
  influencerName: z.string().optional(),
  influencerEmail: z.string().optional(),
});
export type ApplicationRecord = z.infer<typeof applicationSchema>;
