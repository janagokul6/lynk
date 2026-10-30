import { eq, and, desc, sql } from "drizzle-orm";
import { db } from "../../lib/db.js";
import { campaign } from "../../db/schema.js";

export type CampaignRow = typeof campaign.$inferSelect;
export type CampaignInsert = typeof campaign.$inferInsert;

const statuses = ["draft", "live", "completed"] as const;
export type CampaignStatus = (typeof statuses)[number];

export interface CreateCampaignInput {
  userId: string;
  status?: CampaignStatus;
  title: string;
  campaignType: string;
  description: string;
  guidelines?: string;
  niches: string[];
  platforms: string[];
  deliverables: string[];
  perks: string[];
  followerRange?: string;
  minEngagement?: string;
  location?: string;
  minAge?: number;
  maxAge?: number;
  compensationType: string;
  payMin: string;
  payMax: string;
  totalBudget?: string;
  creatorsNeeded?: number;
  applicationDeadline?: string;
  startDate?: string;
  endDate?: string;
  brandName?: string;
  brandImage?: string;
  campaignImage?: string;
}

export interface UpdateCampaignInput extends Partial<Omit<CreateCampaignInput, "userId">> {
  status?: CampaignStatus;
}

function toRow(input: CreateCampaignInput): CampaignInsert {
  const status = input.status ?? "draft";
  return {
    userId: input.userId,
    status,
    listedAt: status === "live" ? new Date() : null,
    title: input.title,
    campaignType: input.campaignType,
    description: input.description,
    guidelines: input.guidelines ?? null,
    niches: input.niches ?? [],
    platforms: input.platforms ?? [],
    deliverables: input.deliverables ?? [],
    perks: input.perks ?? [],
    followerRange: input.followerRange ?? null,
    minEngagement: input.minEngagement ?? null,
    location: input.location ?? null,
    minAge: input.minAge ?? null,
    maxAge: input.maxAge ?? null,
    compensationType: input.compensationType,
    payMin: input.payMin,
    payMax: input.payMax,
    totalBudget: input.totalBudget ?? null,
    creatorsNeeded: input.creatorsNeeded ?? null,
    applicationDeadline: input.applicationDeadline ?? null,
    startDate: input.startDate ?? null,
    endDate: input.endDate ?? null,
    brandName: input.brandName ?? null,
    brandImage: input.brandImage ?? null,
    campaignImage: input.campaignImage ?? null,
  };
}

export async function createCampaign(input: CreateCampaignInput): Promise<CampaignRow> {
  const [row] = await db.insert(campaign).values(toRow(input)).returning();
  if (!row) throw new Error("Insert failed");
  return row;
}

export async function updateCampaign(
  id: string,
  userId: string,
  input: UpdateCampaignInput
): Promise<CampaignRow | null> {
  const update: Record<string, unknown> = { updatedAt: new Date() };
  if (input.status !== undefined) update.status = input.status;
  if (input.title !== undefined) update.title = input.title;
  if (input.campaignType !== undefined) update.campaignType = input.campaignType;
  if (input.description !== undefined) update.description = input.description;
  if (input.guidelines !== undefined) update.guidelines = input.guidelines;
  if (input.niches !== undefined) update.niches = input.niches;
  if (input.platforms !== undefined) update.platforms = input.platforms;
  if (input.deliverables !== undefined) update.deliverables = input.deliverables;
  if (input.perks !== undefined) update.perks = input.perks;
  if (input.followerRange !== undefined) update.followerRange = input.followerRange;
  if (input.minEngagement !== undefined) update.minEngagement = input.minEngagement;
  if (input.location !== undefined) update.location = input.location;
  if (input.minAge !== undefined) update.minAge = input.minAge;
  if (input.maxAge !== undefined) update.maxAge = input.maxAge;
  if (input.compensationType !== undefined) update.compensationType = input.compensationType;
  if (input.payMin !== undefined) update.payMin = input.payMin;
  if (input.payMax !== undefined) update.payMax = input.payMax;
  if (input.totalBudget !== undefined) update.totalBudget = input.totalBudget;
  if (input.creatorsNeeded !== undefined) update.creatorsNeeded = input.creatorsNeeded;
  if (input.applicationDeadline !== undefined) update.applicationDeadline = input.applicationDeadline;
  if (input.startDate !== undefined) update.startDate = input.startDate;
  if (input.endDate !== undefined) update.endDate = input.endDate;
  if (input.brandName !== undefined) update.brandName = input.brandName;
  if (input.brandImage !== undefined) update.brandImage = input.brandImage;
  if (input.campaignImage !== undefined) update.campaignImage = input.campaignImage;

  const [row] = await db
    .update(campaign)
    .set(update as Record<string, unknown>)
    .where(and(eq(campaign.id, id), eq(campaign.userId, userId)))
    .returning();
  return row ?? null;
}

export async function getCampaignById(id: string): Promise<CampaignRow | null> {
  const [row] = await db.select().from(campaign).where(eq(campaign.id, id)).limit(1);
  return row ?? null;
}

export async function listCampaignsByUser(
  userId: string,
  statusFilter?: CampaignStatus
): Promise<CampaignRow[]> {
  const conditions = [eq(campaign.userId, userId)];
  if (statusFilter) conditions.push(eq(campaign.status, statusFilter));
  return db
    .select()
    .from(campaign)
    .where(and(...conditions))
    .orderBy(desc(campaign.updatedAt));
}

export async function publishCampaign(id: string, userId: string): Promise<CampaignRow | null> {
  const [row] = await db
    .update(campaign)
    .set({
      status: "live",
      listedAt: new Date(),
      updatedAt: new Date(),
    })
    .where(and(eq(campaign.id, id), eq(campaign.userId, userId)))
    .returning();
  return row ?? null;
}

export function isOwner(row: CampaignRow, userId: string): boolean {
  return row.userId === userId;
}
