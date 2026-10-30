import {
  creatorMatchQuerySchema,
  creatorSyncPayloadSchema,
  toolInputSchemas,
  type ToolName,
} from "@lynk/shared";
import { domainEvents } from "../../lib/events.js";
import { enqueueCreatorSync, matchCreators } from "../creators/creators.service.js";

export type ToolContext = { userId?: string };

export const toolDescriptors = [
  { name: "health.check" as const, description: "Liveness probe for agents and ops" },
  { name: "creators.match" as const, description: "Match creators by query, niches, platform" },
  {
    name: "creators.enqueue_sync" as const,
    description: "Enqueue a creator profile sync job",
  },
];

export async function invokeTool(
  name: ToolName,
  rawInput: unknown,
  ctx: ToolContext
): Promise<unknown> {
  domainEvents.emitEvent({ type: "tool.invoked", tool: name, userId: ctx.userId });

  switch (name) {
    case "health.check":
      toolInputSchemas["health.check"].parse(rawInput ?? {});
      return { ok: true };
    case "creators.match": {
      const input = creatorMatchQuerySchema.parse(rawInput);
      const rows = await matchCreators(input);
      return { count: rows.length, creatorIds: rows.map((r) => r.id) };
    }
    case "creators.enqueue_sync": {
      const input = creatorSyncPayloadSchema.parse(rawInput);
      const jobId = await enqueueCreatorSync(input);
      return { jobId };
    }
    default: {
      const _exhaustive: never = name;
      return _exhaustive;
    }
  }
}
