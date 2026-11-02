import {
  buildToolDescriptors,
  creatorMatchQuerySchema,
  creatorSyncPayloadSchema,
  toolInputSchemas,
  type CreatorMatchResult,
  type ToolName,
} from "@lynk/shared";
import { domainEvents } from "../../lib/events.js";
import { enqueueCreatorSync, matchCreators } from "../creators/creators.service.js";

export type ToolContext = { userId?: string };

export const toolDescriptors = buildToolDescriptors();

function toMatchResult(
  rows: Awaited<ReturnType<typeof matchCreators>>
): CreatorMatchResult {
  return {
    count: rows.length,
    creators: rows.map((r) => ({
      id: r.id,
      platform: r.platform as "youtube" | "instagram",
      handle: r.handle,
      displayName: r.displayName,
      imageUrl: r.imageUrl,
      followerCount: r.followerCount,
      engagementRate: r.engagementRate == null ? null : Number(r.engagementRate),
      niches: r.niches ?? [],
      country: r.country,
    })),
  };
}

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
      return toMatchResult(rows);
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
