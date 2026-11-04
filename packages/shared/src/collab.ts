import { z } from "zod";

export const submissionKindSchema = z.enum(["content", "proof"]);
export type SubmissionKind = z.infer<typeof submissionKindSchema>;

export const submissionCreateSchema = z
  .object({
    url: z.string().trim().url().max(2000).optional(),
    storageKey: z.string().trim().min(1).max(300).optional(),
    note: z.string().trim().max(4000).optional(),
  })
  .strict()
  .refine((value) => Boolean(value.url || value.storageKey), {
    message: "Add a link or an uploaded file",
  });
export type SubmissionCreateInput = z.infer<typeof submissionCreateSchema>;

export const revisionRequestSchema = z
  .object({
    note: z.string().trim().min(1).max(4000),
  })
  .strict();

export const ratingCreateSchema = z
  .object({
    score: z.number().int().min(1).max(5),
    comment: z.string().trim().max(2000).optional(),
  })
  .strict();
export type RatingCreateInput = z.infer<typeof ratingCreateSchema>;

export const submissionSchema = z.object({
  id: z.string().uuid(),
  kind: submissionKindSchema,
  url: z.string().nullable(),
  storageKey: z.string().nullable(),
  note: z.string().nullable(),
  revisionNote: z.string().nullable(),
  createdAt: z.string(),
});

export const ratingSchema = z.object({
  id: z.string().uuid(),
  raterId: z.string(),
  rateeId: z.string(),
  score: z.number().int(),
  comment: z.string().nullable(),
  createdAt: z.string(),
});
