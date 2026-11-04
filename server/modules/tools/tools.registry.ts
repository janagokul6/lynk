import {
  applicationApplySchema,
  applicationDecideSchema,
  applicationWithdrawSchema,
  buildToolDescriptors,
  campaignDraftSchema,
  compareCreatorsInputSchema,
  creatorMatchQuerySchema,
  creatorSyncPayloadSchema,
  collabIdSchema,
  collabProofToolSchema,
  collabRateToolSchema,
  collabRevisionToolSchema,
  collabSubmitToolSchema,
  inviteCreateSchema,
  inviteRespondSchema,
  marketplaceSearchInputSchema,
  messageSendToolSchema,
  roiToolInputSchema,
  shortlistAddSchema,
  shortlistGroupCreateSchema,
  shortlistRemoveSchema,
  toolInputSchemas,
  type CreatorMatchResult,
  type ToolName,
} from "@lynk/shared";
import { domainEvents } from "../../lib/events.js";
import { enqueueCreatorSync, matchCreators } from "../creators/creators.service.js";
import * as handlers from "./tools.handlers.js";

export type ToolContext = { userId?: string; confirmed?: boolean };

export const toolDescriptors = buildToolDescriptors();

function requireToolUser(ctx: ToolContext): string {
  if (!ctx.userId) throw new Error("Unauthorized");
  return ctx.userId;
}

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
    case "creators.compare":
      return handlers.compareCreators(compareCreatorsInputSchema.parse(rawInput));
    case "shortlist.list":
      toolInputSchemas["shortlist.list"].parse(rawInput ?? {});
      return handlers.shortlistHandlers.list(requireToolUser(ctx));
    case "shortlist.add":
      return handlers.shortlistHandlers.add(requireToolUser(ctx), shortlistAddSchema.parse(rawInput));
    case "shortlist.remove":
      return handlers.shortlistHandlers.remove(
        requireToolUser(ctx),
        shortlistRemoveSchema.parse(rawInput).creatorId
      );
    case "shortlist.group":
      return handlers.shortlistHandlers.group(
        requireToolUser(ctx),
        shortlistGroupCreateSchema.parse(rawInput).name
      );
    case "roi.estimate":
      return handlers.estimateBrandRoi(ctx.userId, roiToolInputSchema.parse(rawInput));
    case "campaigns.preview":
      return handlers.previewCampaign(campaignDraftSchema.parse(rawInput));
    case "campaigns.create":
      return handlers.createCampaignFromTool(
        ctx.userId,
        campaignDraftSchema.parse(rawInput),
        ctx.confirmed === true
      );
    case "applications.incoming":
      toolInputSchemas["applications.incoming"].parse(rawInput ?? {});
      return handlers.incomingApplications(ctx.userId);
    case "applications.decide":
      return handlers.decideApplicant(
        ctx.userId,
        applicationDecideSchema.parse(rawInput),
        ctx.confirmed === true
      );
    case "marketplace.search":
      return handlers.searchMarketplace(marketplaceSearchInputSchema.parse(rawInput ?? {}));
    case "applications.mine":
      toolInputSchemas["applications.mine"].parse(rawInput ?? {});
      return handlers.myApplications(ctx.userId);
    case "applications.apply":
      return handlers.applyToCampaign(
        ctx.userId,
        applicationApplySchema.parse(rawInput),
        ctx.confirmed === true
      );
    case "applications.withdraw":
      return handlers.withdrawOwnApplication(
        ctx.userId,
        applicationWithdrawSchema.parse(rawInput),
        ctx.confirmed === true
      );
    case "insights.public":
      toolInputSchemas["insights.public"].parse(rawInput ?? {});
      return handlers.publicInsights();
    case "messages.status":
      toolInputSchemas["messages.status"].parse(rawInput ?? {});
      return handlers.messagingStatus(ctx.userId);
    case "messages.send":
      return handlers.sendMessageFromTool(
        ctx.userId,
        messageSendToolSchema.parse(rawInput),
        ctx.confirmed === true
      );
    case "invites.create":
      return handlers.createInviteFromTool(
        ctx.userId,
        inviteCreateSchema.parse(rawInput),
        ctx.confirmed === true
      );
    case "invites.mine":
      toolInputSchemas["invites.mine"].parse(rawInput ?? {});
      return handlers.myInvites(ctx.userId);
    case "invites.respond":
      return handlers.respondInviteFromTool(
        ctx.userId,
        inviteRespondSchema.parse(rawInput),
        ctx.confirmed === true
      );
    case "collab.summary":
      return handlers.collabSummary(ctx.userId, collabIdSchema.parse(rawInput).applicationId);
    case "collab.submit":
      return handlers.collabSubmitFromTool(
        ctx.userId,
        collabSubmitToolSchema.parse(rawInput),
        ctx.confirmed === true
      );
    case "collab.revision":
      return handlers.collabRevisionFromTool(
        ctx.userId,
        collabRevisionToolSchema.parse(rawInput),
        ctx.confirmed === true
      );
    case "collab.approve":
      return handlers.collabApproveFromTool(
        ctx.userId,
        collabIdSchema.parse(rawInput),
        ctx.confirmed === true
      );
    case "collab.proof":
      return handlers.collabProofFromTool(
        ctx.userId,
        collabProofToolSchema.parse(rawInput),
        ctx.confirmed === true
      );
    case "collab.rate":
      return handlers.collabRateFromTool(
        ctx.userId,
        collabRateToolSchema.parse(rawInput),
        ctx.confirmed === true
      );
    default: {
      const _exhaustive: never = name;
      return _exhaustive;
    }
  }
}
