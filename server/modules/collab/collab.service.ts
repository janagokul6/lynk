import { and, asc, eq } from "drizzle-orm";
import type { ApplicationStatus, RatingCreateInput, SubmissionCreateInput } from "@lynk/shared";
import { env } from "../../config/env.js";
import { db } from "../../lib/db.js";
import { notifyUser } from "../../lib/notify.js";
import { application, campaign, rating, submission, user } from "../../db/schema.js";
import { getApplicationById, type ApplicationView } from "../applications/applications.service.js";

const COLLAB_STATUSES = new Set<ApplicationStatus>([
  "accepted",
  "submitted",
  "revision",
  "approved",
  "completed",
]);

export type CollabParty = {
  application: ApplicationView;
  role: "brand" | "influencer";
  brandId: string;
};

export async function loadParty(applicationId: string, userId: string): Promise<CollabParty | null> {
  const row = await getApplicationById(applicationId);
  if (!row) return null;
  const [owner] = await db
    .select({ userId: campaign.userId, disclosureChecks: campaign.disclosureChecks, guidelines: campaign.guidelines })
    .from(campaign)
    .where(eq(campaign.id, row.campaignId))
    .limit(1);
  if (!owner) return null;
  if (owner.userId === userId) {
    return { application: row, role: "brand", brandId: owner.userId };
  }
  if (row.influencerId === userId) {
    return { application: row, role: "influencer", brandId: owner.userId };
  }
  return null;
}

export async function collabDetail(applicationId: string, userId: string) {
  const party = await loadParty(applicationId, userId);
  if (!party) return null;
  const [campaignRow] = await db
    .select({
      guidelines: campaign.guidelines,
      disclosureChecks: campaign.disclosureChecks,
      description: campaign.description,
    })
    .from(campaign)
    .where(eq(campaign.id, party.application.campaignId))
    .limit(1);
  const submissions = await db
    .select()
    .from(submission)
    .where(eq(submission.applicationId, applicationId))
    .orderBy(asc(submission.createdAt));
  const ratings = await db.select().from(rating).where(eq(rating.applicationId, applicationId));
  return {
    application: party.application,
    role: party.role,
    guidelines: campaignRow?.guidelines ?? null,
    description: campaignRow?.description ?? "",
    disclosureChecks: campaignRow?.disclosureChecks ?? [],
    submissions: submissions.map((row) => ({
      id: row.id,
      kind: row.kind,
      url: row.url,
      storageKey: row.storageKey,
      note: row.note,
      revisionNote: row.revisionNote,
      createdAt: row.createdAt.toISOString(),
    })),
    ratings: ratings.map((row) => ({
      id: row.id,
      raterId: row.raterId,
      rateeId: row.rateeId,
      score: row.score,
      comment: row.comment,
      createdAt: row.createdAt.toISOString(),
    })),
  };
}

async function moveStatus(id: string, allowed: ApplicationStatus[], to: ApplicationStatus): Promise<boolean> {
  const current = await getApplicationById(id);
  if (!current || !allowed.includes(current.status)) return false;
  const [updated] = await db
    .update(application)
    .set({ status: to, updatedAt: new Date() })
    .where(and(eq(application.id, id), eq(application.status, current.status)))
    .returning({ id: application.id });
  return Boolean(updated);
}

export async function submitContent(userId: string, applicationId: string, input: SubmissionCreateInput) {
  const party = await loadParty(applicationId, userId);
  if (!party || party.role !== "influencer") return { ok: false as const, status: 404, error: "Application not found" };
  if (!["accepted", "revision"].includes(party.application.status)) {
    return { ok: false as const, status: 409, error: "Content can be submitted after acceptance or a revision request" };
  }
  await db.insert(submission).values({
    applicationId,
    kind: "content",
    url: input.url ?? null,
    storageKey: input.storageKey ?? null,
    note: input.note ?? null,
  });
  const moved = await moveStatus(applicationId, ["accepted", "revision"], "submitted");
  if (!moved) return { ok: false as const, status: 409, error: "Could not update the application" };
  await notifyUser({
    userId: party.brandId,
    type: "submission.content",
    title: `Content submitted for ${party.application.campaignTitle}`,
    body: `${party.application.influencerName} submitted work for review.`,
    href: `${env.CLIENT_ORIGIN}/collab/${applicationId}`,
  });
  return { ok: true as const, detail: await collabDetail(applicationId, userId) };
}

export async function requestRevision(userId: string, applicationId: string, note: string) {
  const party = await loadParty(applicationId, userId);
  if (!party || party.role !== "brand") return { ok: false as const, status: 404, error: "Application not found" };
  if (party.application.status !== "submitted") {
    return { ok: false as const, status: 409, error: "A revision can be requested after content is submitted" };
  }
  await db.insert(submission).values({
    applicationId,
    kind: "content",
    revisionNote: note,
  });
  const moved = await moveStatus(applicationId, ["submitted"], "revision");
  if (!moved) return { ok: false as const, status: 409, error: "Could not update the application" };
  await notifyUser({
    userId: party.application.influencerId,
    type: "submission.revision",
    title: `Revision requested for ${party.application.campaignTitle}`,
    body: note,
    href: `${env.CLIENT_ORIGIN}/collab/${applicationId}`,
  });
  return { ok: true as const, detail: await collabDetail(applicationId, userId) };
}

export async function approveContent(userId: string, applicationId: string) {
  const party = await loadParty(applicationId, userId);
  if (!party || party.role !== "brand") return { ok: false as const, status: 404, error: "Application not found" };
  if (party.application.status !== "submitted") {
    return { ok: false as const, status: 409, error: "Content can be approved after it is submitted" };
  }
  const moved = await moveStatus(applicationId, ["submitted"], "approved");
  if (!moved) return { ok: false as const, status: 409, error: "Could not update the application" };
  await notifyUser({
    userId: party.application.influencerId,
    type: "submission.approved",
    title: `Content approved for ${party.application.campaignTitle}`,
    body: "Post the work, then submit the live URL as proof.",
    href: `${env.CLIENT_ORIGIN}/collab/${applicationId}`,
  });
  return { ok: true as const, detail: await collabDetail(applicationId, userId) };
}

export async function submitProof(userId: string, applicationId: string, input: SubmissionCreateInput) {
  const party = await loadParty(applicationId, userId);
  if (!party || party.role !== "influencer") return { ok: false as const, status: 404, error: "Application not found" };
  if (party.application.status !== "approved") {
    return { ok: false as const, status: 409, error: "Proof can be submitted after the brand approves the content" };
  }
  if (!input.url) return { ok: false as const, status: 400, error: "Proof needs the live post URL" };
  await db.insert(submission).values({
    applicationId,
    kind: "proof",
    url: input.url,
    note: input.note ?? null,
  });
  const moved = await moveStatus(applicationId, ["approved"], "completed");
  if (!moved) return { ok: false as const, status: 409, error: "Could not update the application" };
  await notifyUser({
    userId: party.brandId,
    type: "submission.completed",
    title: `${party.application.campaignTitle} is complete`,
    body: "The creator submitted proof of posting. You can leave a rating.",
    href: `${env.CLIENT_ORIGIN}/collab/${applicationId}`,
  });
  await maybeCompleteCampaign(party.application.campaignId);
  return { ok: true as const, detail: await collabDetail(applicationId, userId) };
}

async function maybeCompleteCampaign(campaignId: string) {
  const rows = await db
    .select({ status: application.status })
    .from(application)
    .where(eq(application.campaignId, campaignId));
  const active = rows.filter((row) => row.status !== "rejected" && row.status !== "withdrawn");
  if (active.length > 0 && active.every((row) => row.status === "completed")) {
    await db
      .update(campaign)
      .set({ status: "completed", updatedAt: new Date() })
      .where(and(eq(campaign.id, campaignId), eq(campaign.status, "live")));
  }
}

export async function rateCollab(userId: string, applicationId: string, input: RatingCreateInput) {
  const party = await loadParty(applicationId, userId);
  if (!party) return { ok: false as const, status: 404, error: "Application not found" };
  if (party.application.status !== "completed") {
    return { ok: false as const, status: 409, error: "Ratings open after the collaboration is complete" };
  }
  const rateeId = party.role === "brand" ? party.application.influencerId : party.brandId;
  const [existing] = await db
    .select({ id: rating.id })
    .from(rating)
    .where(and(eq(rating.applicationId, applicationId), eq(rating.raterId, userId)))
    .limit(1);
  if (existing) return { ok: false as const, status: 409, error: "You already rated this collaboration" };
  await db.insert(rating).values({
    applicationId,
    raterId: userId,
    rateeId,
    score: input.score,
    comment: input.comment ?? null,
  });
  await notifyUser({
    userId: rateeId,
    type: "rating.created",
    title: "New rating",
    body: `You received ${input.score} out of 5 on ${party.application.campaignTitle}.`,
    href: `${env.CLIENT_ORIGIN}/collab/${applicationId}`,
  });
  return { ok: true as const, detail: await collabDetail(applicationId, userId) };
}

export async function storageKeyVisible(userId: string, key: string): Promise<boolean> {
  const rows = await db
    .select({
      influencerId: application.influencerId,
      brandId: campaign.userId,
      storageKey: submission.storageKey,
    })
    .from(submission)
    .innerJoin(application, eq(submission.applicationId, application.id))
    .innerJoin(campaign, eq(application.campaignId, campaign.id))
    .where(eq(submission.storageKey, key));
  return rows.some((row) => row.influencerId === userId || row.brandId === userId);
}

export function collabOpen(status: string): boolean {
  return COLLAB_STATUSES.has(status as ApplicationStatus);
}

export async function participantName(userId: string): Promise<string> {
  const [row] = await db.select({ name: user.name }).from(user).where(eq(user.id, userId)).limit(1);
  return row?.name ?? "Lynk user";
}
