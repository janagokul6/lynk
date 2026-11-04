import type { Request, Response } from "express";
import { eq } from "drizzle-orm";
import { db } from "../../lib/db.js";
import { brandProfile } from "../../db/schema.js";
import * as service from "./campaigns.service.js";
import {
  createCampaignBodySchema,
  updateCampaignBodySchema,
  listCampaignsQuerySchema,
} from "./campaigns.validation.js";

type ReqWithUserId = Request & { userId?: string };

function rowToJson(row: service.CampaignRow) {
  return {
    id: row.id,
    userId: row.userId,
    status: row.status,
    listedAt: row.listedAt?.toISOString() ?? null,
    title: row.title,
    campaignType: row.campaignType,
    description: row.description,
    guidelines: row.guidelines,
    niches: row.niches ?? [],
    platforms: row.platforms ?? [],
    deliverables: row.deliverables ?? [],
    perks: row.perks ?? [],
    followerRange: row.followerRange,
    minEngagement: row.minEngagement,
    location: row.location,
    minAge: row.minAge,
    maxAge: row.maxAge,
    compensationType: row.compensationType,
    payMin: row.payMin,
    payMax: row.payMax,
    totalBudget: row.totalBudget,
    creatorsNeeded: row.creatorsNeeded,
    applicationDeadline: row.applicationDeadline,
    startDate: row.startDate,
    endDate: row.endDate,
    brandName: row.brandName,
    brandImage: row.brandImage,
    campaignImage: row.campaignImage,
    disclosureChecks: row.disclosureChecks ?? [],
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}

function rowToSummary(row: service.CampaignRow) {
  return {
    id: row.id,
    name: row.title,
    title: row.title,
    status: row.status,
    campaignType: row.campaignType,
    payMin: row.payMin,
    payMax: row.payMax,
    startDate: row.startDate,
    endDate: row.endDate,
    listedAt: row.listedAt?.toISOString() ?? null,
    createdAt: row.createdAt.toISOString(),
  };
}

export async function create(req: ReqWithUserId, res: Response): Promise<void> {
  const userId = req.userId;
  if (!userId) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  const parsed = createCampaignBodySchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Validation failed", details: parsed.error.flatten() });
    return;
  }
  const data = parsed.data;
  let brandName = data.brandName?.trim() || undefined;
  if (!brandName) {
    const [profile] = await db
      .select({ companyName: brandProfile.companyName })
      .from(brandProfile)
      .where(eq(brandProfile.userId, userId))
      .limit(1);
    brandName = profile?.companyName;
  }
  try {
    const row = await service.createCampaign({
      userId,
      status: data.status,
      title: data.title,
      campaignType: data.campaignType,
      description: data.description,
      guidelines: data.guidelines,
      niches: data.niches,
      platforms: data.platforms,
      deliverables: data.deliverables,
      perks: data.perks,
      followerRange: data.followerRange,
      minEngagement: data.minEngagement,
      location: data.location,
      minAge: data.minAge,
      maxAge: data.maxAge,
      compensationType: data.compensationType,
      payMin: data.payMin,
      payMax: data.payMax,
      totalBudget: data.totalBudget,
      creatorsNeeded: data.creatorsNeeded,
      applicationDeadline: data.applicationDeadline,
      startDate: data.startDate,
      endDate: data.endDate,
      brandName,
      brandImage: data.brandImage || undefined,
      campaignImage: data.campaignImage || undefined,
      disclosureChecks: data.disclosureChecks,
    });
    res.status(201).json(rowToJson(row));
  } catch {
    res.status(500).json({ error: "Failed to create campaign" });
  }
}

export async function update(req: ReqWithUserId, res: Response): Promise<void> {
  const userId = req.userId;
  if (!userId) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  const id = String(req.params.id ?? "");
  const parsed = updateCampaignBodySchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Validation failed", details: parsed.error.flatten() });
    return;
  }
  const row = await service.updateCampaign(id, userId, parsed.data);
  if (!row) {
    res.status(404).json({ error: "Campaign not found" });
    return;
  }
  res.json(rowToJson(row));
}

export async function list(req: ReqWithUserId, res: Response): Promise<void> {
  const userId = req.userId;
  if (!userId) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  const parsed = listCampaignsQuerySchema.safeParse(req.query);
  const statusFilter = parsed.success ? parsed.data.status : undefined;
  const rows = await service.listCampaignsByUser(userId, statusFilter);
  res.json(rows.map(rowToSummary));
}

export async function getOne(req: ReqWithUserId, res: Response): Promise<void> {
  const userId = req.userId;
  const id = String(req.params.id ?? "");
  const row = await service.getCampaignById(id);
  if (!row) {
    res.status(404).json({ error: "Campaign not found" });
    return;
  }
  if (row.status === "draft" && row.userId !== userId) {
    res.status(404).json({ error: "Campaign not found" });
    return;
  }
  const json = rowToJson(row);
  if (row.userId !== userId) {
    const { userId: _owner, ...rest } = json;
    res.json(rest);
    return;
  }
  res.json(json);
}

export async function publish(req: ReqWithUserId, res: Response): Promise<void> {
  const userId = req.userId;
  if (!userId) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  const id = String(req.params.id ?? "");
  const row = await service.publishCampaign(id, userId);
  if (!row) {
    res.status(404).json({ error: "Campaign not found" });
    return;
  }
  res.json(rowToJson(row));
}
