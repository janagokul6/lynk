import { and, asc, desc, eq, inArray, or } from "drizzle-orm";
import { alias } from "drizzle-orm/pg-core";
import { db } from "../../lib/db.js";
import { notifyUser } from "../../lib/notify.js";
import { application, campaign, conversation, message, user } from "../../db/schema.js";
import { COLLAB_STATUS_LIST, collabOpen, loadParty } from "../collab/collab.service.js";

const influencerUser = alias(user, "influencer_user");

async function threadForApplication(applicationId: string) {
  const [created] = await db
    .insert(conversation)
    .values({ applicationId })
    .onConflictDoNothing({ target: conversation.applicationId })
    .returning();
  if (created) return created;
  const [existing] = await db
    .select()
    .from(conversation)
    .where(eq(conversation.applicationId, applicationId))
    .limit(1);
  return existing ?? null;
}

export async function listThreads(userId: string) {
  const rows = await db
    .select({
      conversationId: conversation.id,
      applicationId: application.id,
      title: campaign.title,
      brandId: campaign.userId,
      brandName: user.name,
      influencerName: influencerUser.name,
      threadCreatedAt: conversation.createdAt,
      applicationUpdatedAt: application.updatedAt,
    })
    .from(application)
    .innerJoin(campaign, eq(application.campaignId, campaign.id))
    .innerJoin(user, eq(campaign.userId, user.id))
    .innerJoin(influencerUser, eq(application.influencerId, influencerUser.id))
    .leftJoin(conversation, eq(conversation.applicationId, application.id))
    .where(
      and(
        inArray(application.status, [...COLLAB_STATUS_LIST]),
        or(eq(campaign.userId, userId), eq(application.influencerId, userId))
      )
    )
    .orderBy(desc(application.updatedAt));

  return rows.map((row) => ({
    id: row.conversationId,
    applicationId: row.applicationId,
    title: row.title,
    withName: row.brandId === userId ? row.influencerName : row.brandName,
    updatedAt: (row.threadCreatedAt ?? row.applicationUpdatedAt).toISOString(),
  }));
}

async function assertMember(conversationId: string, userId: string) {
  const [row] = await db
    .select({ applicationId: conversation.applicationId })
    .from(conversation)
    .where(eq(conversation.id, conversationId))
    .limit(1);
  if (!row) return null;
  const party = await loadParty(row.applicationId, userId);
  if (!party || !collabOpen(party.application.status)) return null;
  return party;
}

export async function threadMessages(conversationId: string, userId: string) {
  const party = await assertMember(conversationId, userId);
  if (!party) return null;
  const rows = await db
    .select()
    .from(message)
    .where(eq(message.conversationId, conversationId))
    .orderBy(asc(message.createdAt));
  return {
    id: conversationId,
    applicationId: party.application.id,
    title: party.application.campaignTitle,
    messages: rows.map((row) => ({
      id: row.id,
      senderId: row.senderId,
      body: row.body,
      createdAt: row.createdAt.toISOString(),
    })),
  };
}

export async function postMessage(conversationId: string, userId: string, body: string) {
  const party = await assertMember(conversationId, userId);
  if (!party) return { ok: false as const, status: 404, error: "Conversation not found" };
  const [created] = await db
    .insert(message)
    .values({ conversationId, senderId: userId, body })
    .returning();
  const recipient = party.role === "brand" ? party.application.influencerId : party.brandId;
  await notifyUser({
    userId: recipient,
    type: "message.created",
    title: `New message on ${party.application.campaignTitle}`,
    body,
    href: `/messages/${conversationId}`,
  });
  return {
    ok: true as const,
    message: {
      id: created.id,
      senderId: created.senderId,
      body: created.body,
      createdAt: created.createdAt.toISOString(),
    },
  };
}

export async function openThread(userId: string, applicationId: string, body?: string) {
  const party = await loadParty(applicationId, userId);
  if (!party || !collabOpen(party.application.status)) {
    return { ok: false as const, status: 404, error: "Messaging opens after a collaboration is accepted" };
  }
  const thread = await threadForApplication(applicationId);
  if (!thread) return { ok: false as const, status: 500, error: "Could not open the conversation" };
  if (body) {
    const sent = await postMessage(thread.id, userId, body);
    if (!sent.ok) return sent;
  }
  const detail = await threadMessages(thread.id, userId);
  return { ok: true as const, thread: detail };
}
