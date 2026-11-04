import { z } from "zod";
import { creatorSyncPayloadSchema } from "./jobs.js";
import { creatorMatchQuerySchema, creatorMatchResultSchema } from "./match.js";

export const toolNames = [
  "health.check",
  "creators.match",
  "creators.enqueue_sync",
] as const;
export type ToolName = (typeof toolNames)[number];

/** Tools an `x-agent-key` caller may invoke. Sync stays on a real session. */
export const agentKeyToolAllowlist = ["health.check", "creators.match"] as const satisfies readonly ToolName[];

export const toolDescriptions: Record<ToolName, string> = {
  "health.check": "Liveness probe for agents and ops",
  "creators.match": "Match creators by query, niches, platform",
  "creators.enqueue_sync": "Enqueue a creator profile sync job",
};

export const toolInputSchemas = {
  "health.check": z.object({}).strict(),
  "creators.match": creatorMatchQuerySchema,
  "creators.enqueue_sync": creatorSyncPayloadSchema,
} as const;

export const toolOutputSchemas = {
  "health.check": z.object({ ok: z.boolean() }),
  "creators.match": creatorMatchResultSchema,
  "creators.enqueue_sync": z.object({ jobId: z.string().nullable() }),
} as const;

export const toolDescriptorSchema = z.object({
  name: z.enum(toolNames),
  description: z.string(),
  inputSchema: z.record(z.string(), z.unknown()),
  outputSchema: z.record(z.string(), z.unknown()),
});
export type ToolDescriptor = z.infer<typeof toolDescriptorSchema>;

export function buildToolDescriptors(): ToolDescriptor[] {
  return toolNames.map((name) => ({
    name,
    description: toolDescriptions[name],
    inputSchema: z.toJSONSchema(toolInputSchemas[name]) as Record<string, unknown>,
    outputSchema: z.toJSONSchema(toolOutputSchemas[name]) as Record<string, unknown>,
  }));
}
