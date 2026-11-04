import { asc, desc, eq } from "drizzle-orm";
import { env } from "../../config/env.js";
import { db } from "../../lib/db.js";
import { notifyUser } from "../../lib/notify.js";
import { application, campaign, conversation, message, user } from "../../db/schema.js";
import { collabOpen, loadParty } from "../collab/collab.service.js";

async function threadForApplication(applicationId: string) {
  const [existing] = await db
    .select()
    .from(conversation)
    .where(eq(conversation.applicationId, applicationId))
    .limit(1);
  if (existing) return existing;
  const [created] = await db.insert(conversation).values({ applicationId }).returning();
  return created;
}

export async function listThreads(userId: string) {
  const rows = await db
    .select({
      conversationId: conversation.id,
      applicationId: application.id,
      status: application.status,
      title: campaign.title,
      brandId: campaign.userId,
      brandName: user.name,
      influencerId: application.influencerId,
      updatedAt: conversation.createdAt,
    })
    .from(application)
    .innerJoin(campaign, eq(application.campaignId, campaign.id))
    .innerJoin(user, eq(campaign.userId, user.id))
    .leftJoin(conversation, eq(conversation.applicationId, application.id))
    .orderBy(desc(application.updatedAt));

  const mine = rows.filter(
    (row) => collabOpen(row.status) && (row.brandId === userId || row.influencerId === userId)
  );
  const summaries = [];
  for (const row of mine) {
    const thread = row.conversationId
      ? { id: row.conversationId, createdAt: row.updatedAt }
      : await threadForApplication(row.applicationId);
    if (!thread) continue;
    const [influencer] = await db
      .select({ name: user.name })
      .from(user)
      .where(eq(user.id, row.influencerId))
      .limit(1);
    summaries.push({
      id: thread.id,
      applicationId: row.applicationId,
      title: row.title,
      withName: row.brandId === userId ? influencer?.name ?? "Creator" : row.brandName,
      updatedAt: (thread.createdAt ?? new Date()).toISOString(),
    });
  }
  return summaries;
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
    href: `${env.CLIENT_ORIGIN}/messages/${conversationId}`,
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
