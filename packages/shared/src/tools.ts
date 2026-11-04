import { z } from "zod";
import { agentToolInputSchemas, agentToolOutputSchemas } from "./agent-io.js";
import { creatorSyncPayloadSchema } from "./jobs.js";
import { creatorMatchQuerySchema, creatorMatchResultSchema } from "./match.js";

export const toolNames = [
  "health.check",
  "creators.match",
  "creators.enqueue_sync",
  "creators.compare",
  "shortlist.list",
  "shortlist.add",
  "shortlist.remove",
  "shortlist.group",
  "roi.estimate",
  "campaigns.preview",
  "campaigns.create",
  "applications.incoming",
  "applications.decide",
  "marketplace.search",
  "applications.mine",
  "applications.apply",
  "applications.withdraw",
  "insights.public",
  "messages.status",
  "messages.send",
  "invites.create",
  "invites.mine",
  "invites.respond",
  "collab.summary",
  "collab.submit",
  "collab.revision",
  "collab.approve",
  "collab.proof",
  "collab.rate",
] as const;
export type ToolName = (typeof toolNames)[number];

/** Tools an `x-agent-key` caller may invoke. User-scoped reads and writes stay on a session. */
export const agentKeyToolAllowlist = ["health.check", "creators.match"] as const satisfies readonly ToolName[];

export const toolDescriptions: Record<ToolName, string> = {
  "health.check": "Liveness probe for agents and ops",
  "creators.match": "Match creators by query, niches, platform",
  "creators.enqueue_sync": "Enqueue a creator profile sync job",
  "creators.compare": "Compare public creator profiles side by side",
  "shortlist.list": "List the signed-in brand's shortlist and groups",
  "shortlist.add": "Shortlist a creator, optionally into a named group",
  "shortlist.remove": "Remove a creator from the signed-in brand's shortlist",
  "shortlist.group": "Create a named shortlist group for the signed-in brand",
  "roi.estimate": "Estimate cost per engagement from follower and engagement data we actually store",
  "campaigns.preview": "Preview a campaign draft without saving or publishing it",
  "campaigns.create": "Create a campaign draft or post it live after the user confirms",
  "applications.incoming": "List applicants on the signed-in brand's campaigns",
  "applications.decide": "Accept or reject an applicant on a campaign the brand owns, after confirmation",
  "marketplace.search": "Search live marketplace campaigns for the signed-in influencer",
  "applications.mine": "List the signed-in influencer's applications and statuses",
  "applications.apply": "Apply to a live campaign after the user confirms",
  "applications.withdraw": "Withdraw the signed-in influencer's pending application after confirmation",
  "insights.public": "Public marketplace aggregates only. Never another creator's private data",
  "messages.status": "List message threads on accepted collaborations",
  "messages.send": "Send a message on an accepted collaboration after the user confirms",
  "invites.create": "Invite a creator who has a Lynk account onto a campaign the brand owns, after confirmation",
  "invites.mine": "List campaign invites for the signed-in creator",
  "invites.respond": "Accept or decline a campaign invite after the user confirms",
  "collab.summary": "Read the signed-in user's collaboration status, submissions, and ratings",
  "collab.submit": "Submit draft content on an accepted collaboration after the user confirms",
  "collab.revision": "Request a revision on submitted content after the brand confirms",
  "collab.approve": "Approve submitted content after the brand confirms",
  "collab.proof": "Submit the live post URL and complete the collaboration after the creator confirms",
  "collab.rate": "Rate a completed collaboration after the user confirms",
};

export const toolInputSchemas = {
  "health.check": z.object({}).strict(),
  "creators.match": creatorMatchQuerySchema,
  "creators.enqueue_sync": creatorSyncPayloadSchema,
  ...agentToolInputSchemas,
} as const;

export const toolOutputSchemas = {
  "health.check": z.object({ ok: z.boolean() }),
  "creators.match": creatorMatchResultSchema,
  "creators.enqueue_sync": z.object({ jobId: z.string().nullable() }),
  ...agentToolOutputSchemas,
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
