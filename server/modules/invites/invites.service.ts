import { and, desc, eq } from "drizzle-orm";
import type { InviteCreateInput } from "@lynk/shared";
import { env } from "../../config/env.js";
import { db } from "../../lib/db.js";
import { notifyUser } from "../../lib/notify.js";
import { application, campaign, campaignInvite, creatorProfile } from "../../db/schema.js";

function toInvite(row: {
  id: string;
  campaignId: string;
  campaignTitle: string;
  creatorId: string;
  influencerId: string;
  status: string;
  createdAt: Date;
}) {
  return {
    id: row.id,
    campaignId: row.campaignId,
    campaignTitle: row.campaignTitle,
    creatorId: row.creatorId,
    influencerId: row.influencerId,
    status: row.status,
    createdAt: row.createdAt.toISOString(),
  };
}

export async function createInvite(brandId: string, input: InviteCreateInput) {
  const [owned] = await db
    .select({ id: campaign.id, title: campaign.title, status: campaign.status })
    .from(campaign)
    .where(and(eq(campaign.id, input.campaignId), eq(campaign.userId, brandId)))
    .limit(1);
  if (!owned || owned.status === "draft") {
    return { ok: false as const, status: 404, error: "Publish the campaign before inviting a creator" };
  }
  const [creator] = await db
    .select()
    .from(creatorProfile)
    .where(eq(creatorProfile.id, input.creatorId))
    .limit(1);
  if (!creator) return { ok: false as const, status: 404, error: "Creator not found" };
  if (!creator.userId) {
    return { ok: false as const, status: 409, error: "This creator does not have a Lynk account to invite" };
  }
  if (creator.userId === brandId) {
    return { ok: false as const, status: 409, error: "You cannot invite yourself" };
  }
  const [existing] = await db
    .select()
    .from(campaignInvite)
    .where(and(eq(campaignInvite.campaignId, owned.id), eq(campaignInvite.influencerId, creator.userId)))
    .limit(1);
  if (existing && existing.status === "pending") {
    return {
      ok: true as const,
      invite: toInvite({ ...existing, campaignTitle: owned.title }),
    };
  }
  const [created] = await db
    .insert(campaignInvite)
    .values({
      campaignId: owned.id,
      brandId,
      creatorId: creator.id,
      influencerId: creator.userId,
      status: "pending",
    })
    .onConflictDoUpdate({
      target: [campaignInvite.campaignId, campaignInvite.influencerId],
      set: { status: "pending", creatorId: creator.id, updatedAt: new Date() },
    })
    .returning();
  await notifyUser({
    userId: creator.userId,
    type: "invite.created",
    title: `Invitation to ${owned.title}`,
    body: "A brand invited you to a campaign.",
    href: `${env.CLIENT_ORIGIN}/influencer/invites`,
    email: true,
  });
  return {
    ok: true as const,
    invite: toInvite({ ...created, campaignTitle: owned.title }),
  };
}

export async function listInvites(userId: string) {
  const rows = await db
    .select({
      id: campaignInvite.id,
      campaignId: campaignInvite.campaignId,
      campaignTitle: campaign.title,
      creatorId: campaignInvite.creatorId,
      influencerId: campaignInvite.influencerId,
      status: campaignInvite.status,
      createdAt: campaignInvite.createdAt,
      brandId: campaignInvite.brandId,
    })
    .from(campaignInvite)
    .innerJoin(campaign, eq(campaignInvite.campaignId, campaign.id))
    .where(eq(campaignInvite.influencerId, userId))
    .orderBy(desc(campaignInvite.createdAt));
  return rows.map((row) => toInvite(row));
}

export async function respondInvite(userId: string, inviteId: string, decision: "accepted" | "declined") {
  const [row] = await db
    .select()
    .from(campaignInvite)
    .where(and(eq(campaignInvite.id, inviteId), eq(campaignInvite.influencerId, userId)))
    .limit(1);
  if (!row) return { ok: false as const, status: 404, error: "Invite not found" };
  if (row.status !== "pending") return { ok: false as const, status: 409, error: "This invite is already closed" };
  if (decision === "declined") {
    await db
      .update(campaignInvite)
      .set({ status: "declined", updatedAt: new Date() })
      .where(eq(campaignInvite.id, row.id));
    return { ok: true as const, applicationId: null };
  }
  const [already] = await db
    .select({ id: application.id, status: application.status })
    .from(application)
    .where(and(eq(application.campaignId, row.campaignId), eq(application.influencerId, userId)))
    .limit(1);
  let applicationId = already?.id ?? null;
  if (!applicationId) {
    const [created] = await db
      .insert(application)
      .values({
        campaignId: row.campaignId,
        influencerId: userId,
        status: "accepted",
        message: "Accepted invite",
      })
      .returning({ id: application.id });
    applicationId = created.id;
  } else if (already?.status === "pending") {
    await db
      .update(application)
      .set({ status: "accepted", updatedAt: new Date() })
      .where(eq(application.id, applicationId));
  }
  await db
    .update(campaignInvite)
    .set({ status: "accepted", updatedAt: new Date() })
    .where(eq(campaignInvite.id, row.id));
  await notifyUser({
    userId: row.brandId,
    type: "invite.accepted",
    title: "A creator accepted your invite",
    body: "The collaboration is accepted. You can message them from the application.",
    href: `${env.CLIENT_ORIGIN}/collab/${applicationId}`,
    email: true,
  });
  return { ok: true as const, applicationId };
}
