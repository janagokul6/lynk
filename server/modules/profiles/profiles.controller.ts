import type { Request, Response } from "express";
import { brandProfileInputSchema, influencerProfileInputSchema } from "@lynk/shared";
import type { AuthedRequest } from "../../policies/requireSession.js";
import * as service from "./profiles.service.js";

export async function me(req: Request, res: Response): Promise<void> {
  const { userId, session } = req as AuthedRequest;
  const role = (session.user as { role?: string }).role ?? "brand";
  res.json({ role, ...(await service.accountBundle(userId, role)) });
}

export async function saveBrand(req: Request, res: Response): Promise<void> {
  const { userId } = req as AuthedRequest;
  const parsed = brandProfileInputSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Validation failed", details: parsed.error.flatten() });
    return;
  }
  res.json(await service.saveBrandProfile(userId, parsed.data));
}

export async function saveInfluencer(req: Request, res: Response): Promise<void> {
  const { userId } = req as AuthedRequest;
  const parsed = influencerProfileInputSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Validation failed", details: parsed.error.flatten() });
    return;
  }
  res.json(await service.saveInfluencerProfile(userId, parsed.data));
}

export async function creator(req: Request, res: Response): Promise<void> {
  const row = await service.publicCreator(String(req.params.id));
  if (!row) {
    res.status(404).json({ error: "Creator not found" });
    return;
  }
  res.json(row);
}
