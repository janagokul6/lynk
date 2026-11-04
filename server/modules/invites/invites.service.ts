import { and, desc, eq, inArray, sql } from "drizzle-orm";
import type { InviteCreateInput } from "@lynk/shared";
import { db } from "../../lib/db.js";
import { notifyUser } from "../../lib/notify.js";
import { application, campaign, campaignInvite, creatorProfile } from "../../db/schema.js";

const CLOSED_APPLICATION = ["rejected", "withdrawn"] as const;

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

async function notifyInvite(influencerId: string, title: string) {
  await notifyUser({
    userId: influencerId,
    type: "invite.created",
    title: `Invitation to ${title}`,
    body: "A brand invited you to a campaign.",
    href: "/influencer/invites",
    email: true,
  });
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
      set: {
        status: "pending",
        creatorId: creator.id,
        brandId,
        updatedAt: new Date(),
      },
      setWhere: sql`${campaignInvite.status} is distinct from 'pending'`,
    })
    .returning();

  if (created) {
    await notifyInvite(creator.userId, owned.title);
    return { ok: true as const, invite: toInvite({ ...created, campaignTitle: owned.title }) };
  }

  const [current] = await db
    .select()
    .from(campaignInvite)
    .where(and(eq(campaignInvite.campaignId, owned.id), eq(campaignInvite.influencerId, creator.userId)))
    .limit(1);
  if (!current) return { ok: false as const, status: 409, error: "Could not save the invite" };

  const [closed] = await db
    .select({ id: application.id })
    .from(application)
    .where(
      and(
        eq(application.campaignId, owned.id),
        eq(application.influencerId, creator.userId),
        inArray(application.status, [...CLOSED_APPLICATION])
      )
    )
    .limit(1);
  if (!closed) {
    return { ok: true as const, invite: toInvite({ ...current, campaignTitle: owned.title }) };
  }

  const [refreshed] = await db
    .update(campaignInvite)
    .set({ creatorId: creator.id, updatedAt: new Date() })
    .where(and(eq(campaignInvite.id, current.id), eq(campaignInvite.status, "pending")))
    .returning();
  if (!refreshed) {
    return { ok: true as const, invite: toInvite({ ...current, campaignTitle: owned.title }) };
  }
  await notifyInvite(creator.userId, owned.title);
  return { ok: true as const, invite: toInvite({ ...refreshed, campaignTitle: owned.title }) };
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
    })
    .from(campaignInvite)
    .innerJoin(campaign, eq(campaignInvite.campaignId, campaign.id))
    .where(eq(campaignInvite.influencerId, userId))
    .orderBy(desc(campaignInvite.createdAt));
  return rows.map((row) => toInvite(row));
}

export async function respondInvite(userId: string, inviteId: string, decision: "accepted" | "declined") {
  const outcome = await db.transaction(async (tx) => {
    const [row] = await tx
      .select()
      .from(campaignInvite)
      .where(and(eq(campaignInvite.id, inviteId), eq(campaignInvite.influencerId, userId)))
      .for("update")
      .limit(1);
    if (!row) return { ok: false as const, status: 404 as const, error: "Invite not found" };
    if (row.status !== "pending") {
      return { ok: false as const, status: 409 as const, error: "This invite is already closed" };
    }

    if (decision === "declined") {
      await tx
        .update(campaignInvite)
        .set({ status: "declined", updatedAt: new Date() })
        .where(and(eq(campaignInvite.id, row.id), eq(campaignInvite.status, "pending")));
      return { ok: true as const, applicationId: null, notify: false, brandId: row.brandId };
    }

    const [existing] = await tx
      .select()
      .from(application)
      .where(and(eq(application.campaignId, row.campaignId), eq(application.influencerId, userId)))
      .for("update")
      .limit(1);

    let applicationId = existing?.id ?? null;
    let notify = false;
    if (!existing) {
      const [created] = await tx
        .insert(application)
        .values({
          campaignId: row.campaignId,
          influencerId: userId,
          status: "accepted",
          message: "Accepted invite",
        })
        .returning({ id: application.id });
      applicationId = created.id;
      notify = true;
    } else if (existing.status === "pending") {
      await tx
        .update(application)
        .set({ status: "accepted", updatedAt: new Date() })
        .where(and(eq(application.id, existing.id), eq(application.status, "pending")));
      notify = true;
    } else if (existing.status === "rejected" || existing.status === "withdrawn") {
      if (row.updatedAt.getTime() < existing.updatedAt.getTime()) {
        return {
          ok: false as const,
          status: 409 as const,
          error: "This application is closed. Ask the brand to invite you again.",
        };
      }
      const [reopened] = await tx
        .update(application)
        .set({ status: "accepted", updatedAt: new Date() })
        .where(
          and(eq(application.id, existing.id), inArray(application.status, ["rejected", "withdrawn"]))
        )
        .returning({ id: application.id });
      if (!reopened) {
        return { ok: false as const, status: 409 as const, error: "Could not accept the invite" };
      }
      notify = true;
    }

    const [closed] = await tx
      .update(campaignInvite)
      .set({ status: "accepted", updatedAt: new Date() })
      .where(and(eq(campaignInvite.id, row.id), eq(campaignInvite.status, "pending")))
      .returning({ id: campaignInvite.id });
    if (!closed) return { ok: false as const, status: 409 as const, error: "This invite is already closed" };
    return { ok: true as const, applicationId, notify, brandId: row.brandId };
  });

  if (outcome.ok && outcome.notify && outcome.applicationId) {
    await notifyUser({
      userId: outcome.brandId,
      type: "invite.accepted",
      title: "A creator accepted your invite",
      body: "The collaboration is accepted. You can message them from the application.",
      href: `/collab/${outcome.applicationId}`,
      email: true,
    });
  }
  if (!outcome.ok) return outcome;
  return { ok: true as const, applicationId: outcome.applicationId };
}
