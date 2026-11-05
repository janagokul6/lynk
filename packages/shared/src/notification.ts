import { z } from "zod";

export const notificationSchema = z.object({
  id: z.string().uuid(),
  type: z.string(),
  title: z.string(),
  body: z.string(),
  href: z.string().nullable(),
  readAt: z.string().nullable(),
  createdAt: z.string(),
});
export type NotificationRecord = z.infer<typeof notificationSchema>;
