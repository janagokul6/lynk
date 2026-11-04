import { z } from "zod";

export const messageCreateSchema = z
  .object({
    body: z.string().trim().min(1).max(4000),
  })
  .strict();

export const threadOpenSchema = z
  .object({
    applicationId: z.string().uuid(),
    body: z.string().trim().min(1).max(4000).optional(),
  })
  .strict();

export const messageSchema = z.object({
  id: z.string().uuid(),
  senderId: z.string(),
  body: z.string(),
  createdAt: z.string(),
});

export const threadSummarySchema = z.object({
  id: z.string().uuid(),
  applicationId: z.string().uuid(),
  title: z.string(),
  withName: z.string(),
  updatedAt: z.string(),
});
export type ThreadSummary = z.infer<typeof threadSummarySchema>;
