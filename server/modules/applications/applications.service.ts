import { and, desc, eq, inArray } from "drizzle-orm";
import type { ApplicationStatus } from "@lynk/shared";
import { env } from "../../config/env.js";
import { db } from "../../lib/db.js";
import { notifyUser } from "../../lib/notify.js";
import { application, campaign, user } from "../../db/schema.js";

export type ApplicationView = {
  id: string;
  campaignId: string;
  influencerId: string;
  status: ApplicationStatus;
  message: string | null;
  createdAt: string;
  updatedAt: string;
  campaignTitle: string;
  influencerName: string;
  influencerEmail: string;
};

function isUniqueViolation(err: unknown): boolean {
  const candidates = [err, err instanceof Error ? (err as { cause?: unknown }).cause : undefined];
  return candidates.some(
    (candidate) =>
      typeof candidate === "object" &&
      candidate !== null &&
      "code" in candidate &&
      (candidate as { code?: string }).code === "23505"
  );
}

function toView(row: {
  id: string;
  campaignId: string;
  influencerId: string;
  status: string;
  message: string | null;
  createdAt: Date;
  updatedAt: Date;
  campaignTitle: string;
  influencerName: string;
  influencerEmail: string;
}): ApplicationView {
  return {
    id: row.id,
    campaignId: row.campaignId,
    influencerId: row.influencerId,
    status: row.status as ApplicationStatus,
    message: row.message,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
    campaignTitle: row.campaignTitle,
    influencerName: row.influencerName,
    influencerEmail: row.influencerEmail,
  };
}

const viewColumns = {
  id: application.id,
  campaignId: application.campaignId,
  influencerId: application.influencerId,
  status: application.status,
  message: application.message,
  createdAt: application.createdAt,
  updatedAt: application.updatedAt,
  campaignTitle: campaign.title,
  influencerName: user.name,
  influencerEmail: user.email,
};

export async function createApplication(input: {
  influencerId: string;
  campaignId: string;
  message?: string;
}): Promise<{ ok: true; application: ApplicationView } | { ok: false; status: 404 | 409; error: string }> {
  const [live] = await db
    .select({ id: campaign.id })
    .from(campaign)
    .where(and(eq(campaign.id, input.campaignId), eq(campaign.status, "live")))
    .limit(1);
  if (!live) {
    return { ok: false, status: 404, error: "Campaign not found" };
  }

  try {
    const [inserted] = await db
      .insert(application)
      .values({
        campaignId: input.campaignId,
        influencerId: input.influencerId,
        status: "pending",
        message: input.message ?? null,
      })
      .returning({ id: application.id });
    if (!inserted) {
      return { ok: false, status: 409, error: "Already applied" };
    }
    const view = await getApplicationById(inserted.id);
    if (!view) {
      return { ok: false, status: 409, error: "Already applied" };
    }
    const [owner] = await db
      .select({ userId: campaign.userId })
      .from(campaign)
      .where(eq(campaign.id, view.campaignId))
      .limit(1);
    if (owner) {
      await notifyUser({
        userId: owner.userId,
        type: "application.created",
        title: `New application for ${view.campaignTitle}`,
        body: `${view.influencerName} applied.`,
        href: `${env.CLIENT_ORIGIN}/collab/${view.id}`,
        email: true,
      });
    }
    return { ok: true, application: view };
  } catch (err) {
    if (isUniqueViolation(err)) {
      return { ok: false, status: 409, error: "Already applied" };
    }
    throw err;
  }
}

export async function getApplicationById(id: string): Promise<ApplicationView | null> {
  const [row] = await db
    .select(viewColumns)
    .from(application)
    .innerJoin(campaign, eq(application.campaignId, campaign.id))
    .innerJoin(user, eq(application.influencerId, user.id))
    .where(eq(application.id, id))
    .limit(1);
  return row ? toView(row) : null;
}

export async function listForInfluencer(influencerId: string): Promise<ApplicationView[]> {
  const rows = await db
    .select(viewColumns)
    .from(application)
    .innerJoin(campaign, eq(application.campaignId, campaign.id))
    .innerJoin(user, eq(application.influencerId, user.id))
    .where(eq(application.influencerId, influencerId))
    .orderBy(desc(application.createdAt));
  return rows.map(toView);
}

export async function listForBrand(brandUserId: string): Promise<ApplicationView[]> {
  const owned = db
    .select({ id: campaign.id })
    .from(campaign)
    .where(eq(campaign.userId, brandUserId));
  const rows = await db
    .select(viewColumns)
    .from(application)
    .innerJoin(campaign, eq(application.campaignId, campaign.id))
    .innerJoin(user, eq(application.influencerId, user.id))
    .where(inArray(application.campaignId, owned))
    .orderBy(desc(application.createdAt));
  return rows.map(toView);
}

async function transition(input: {
  id: string;
  from: ApplicationStatus;
  to: ApplicationStatus;
  influencerId?: string;
  brandUserId?: string;
}): Promise<ApplicationView | null> {
  const conditions = [eq(application.id, input.id), eq(application.status, input.from)];
  if (input.influencerId) conditions.push(eq(application.influencerId, input.influencerId));
  if (input.brandUserId) {
    const owned = db
      .select({ id: campaign.id })
      .from(campaign)
      .where(eq(campaign.userId, input.brandUserId));
    conditions.push(inArray(application.campaignId, owned));
  }

  const [updated] = await db
    .update(application)
    .set({ status: input.to, updatedAt: new Date() })
    .where(and(...conditions))
    .returning({ id: application.id });
  if (!updated) return null;
  return getApplicationById(updated.id);
}

export async function withdrawApplication(
  id: string,
  influencerId: string
): Promise<{ ok: true; application: ApplicationView } | { ok: false; status: 404 | 409; error: string }> {
  const existing = await getApplicationById(id);
  if (!existing || existing.influencerId !== influencerId) {
    return { ok: false, status: 404, error: "Application not found" };
  }
  if (existing.status !== "pending") {
    return { ok: false, status: 409, error: "Only pending applications can be withdrawn" };
  }
  const updated = await transition({ id, from: "pending", to: "withdrawn", influencerId });
  if (!updated) {
    return { ok: false, status: 409, error: "Only pending applications can be withdrawn" };
  }
  return { ok: true, application: updated };
}

export async function decideApplication(
  id: string,
  brandUserId: string,
  status: "accepted" | "rejected"
): Promise<{ ok: true; application: ApplicationView } | { ok: false; status: 404 | 409; error: string }> {
  const existing = await getApplicationById(id);
  if (!existing) {
    return { ok: false, status: 404, error: "Application not found" };
  }
  const [owned] = await db
    .select({ id: campaign.id })
    .from(campaign)
    .where(and(eq(campaign.id, existing.campaignId), eq(campaign.userId, brandUserId)))
    .limit(1);
  if (!owned) {
    return { ok: false, status: 404, error: "Application not found" };
  }
  if (existing.status !== "pending") {
    return { ok: false, status: 409, error: "Only pending applications can be updated" };
  }
  const updated = await transition({ id, from: "pending", to: status, brandUserId });
  if (!updated) {
    return { ok: false, status: 409, error: "Only pending applications can be updated" };
  }
  await notifyUser({
    userId: updated.influencerId,
    type: status === "accepted" ? "application.accepted" : "application.rejected",
    title: status === "accepted" ? `Accepted for ${updated.campaignTitle}` : `Update on ${updated.campaignTitle}`,
    body:
      status === "accepted"
        ? "The brand accepted your application. You can submit the work from the collaboration page."
        : "The brand declined this application.",
    href: `${env.CLIENT_ORIGIN}/collab/${updated.id}`,
    email: true,
  });
  return { ok: true, application: updated };
}
