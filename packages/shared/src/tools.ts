import { z } from "zod";
import { creatorSyncPayloadSchema } from "./jobs.js";
import { creatorMatchQuerySchema } from "./match.js";

export const toolNames = [
  "health.check",
  "creators.match",
  "creators.enqueue_sync",
] as const;
export type ToolName = (typeof toolNames)[number];

export const toolInputSchemas = {
  "health.check": z.object({}).strict(),
  "creators.match": creatorMatchQuerySchema,
  "creators.enqueue_sync": creatorSyncPayloadSchema,
} as const;

export const toolDescriptorSchema = z.object({
  name: z.enum(toolNames),
  description: z.string(),
});
export type ToolDescriptor = z.infer<typeof toolDescriptorSchema>;
