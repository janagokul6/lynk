import type { Request, Response } from "express";
import { applicationCreateSchema } from "@lynk/shared";
import type { AuthedRequest } from "../../policies/requireSession.js";
import * as service from "./applications.service.js";

function roleOf(req: AuthedRequest): string | undefined {
  const user = req.session.user as { role?: string };
  return user.role;
}

export async function create(req: Request, res: Response): Promise<void> {
  const authed = req as AuthedRequest;
  const parsed = applicationCreateSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Validation failed", details: parsed.error.flatten() });
    return;
  }
  const result = await service.createApplication({
    influencerId: authed.userId,
    campaignId: parsed.data.campaignId,
    message: parsed.data.message,
  });
  if (!result.ok) {
    res.status(result.status).json({ error: result.error });
    return;
  }
  res.status(201).json(result.application);
}

export async function list(req: Request, res: Response): Promise<void> {
  const authed = req as AuthedRequest;
  const role = roleOf(authed);
  if (role === "influencer") {
    res.json(await service.listForInfluencer(authed.userId));
    return;
  }
  if (role === "brand") {
    res.json(await service.listForBrand(authed.userId));
    return;
  }
  res.status(403).json({ error: "Forbidden" });
}

export async function withdraw(req: Request, res: Response): Promise<void> {
  const authed = req as AuthedRequest;
  const result = await service.withdrawApplication(String(req.params.id ?? ""), authed.userId);
  if (!result.ok) {
    res.status(result.status).json({ error: result.error });
    return;
  }
  res.json(result.application);
}

export async function accept(req: Request, res: Response): Promise<void> {
  const authed = req as AuthedRequest;
  const result = await service.decideApplication(String(req.params.id ?? ""), authed.userId, "accepted");
  if (!result.ok) {
    res.status(result.status).json({ error: result.error });
    return;
  }
  res.json(result.application);
}

export async function reject(req: Request, res: Response): Promise<void> {
  const authed = req as AuthedRequest;
  const result = await service.decideApplication(String(req.params.id ?? ""), authed.userId, "rejected");
  if (!result.ok) {
    res.status(result.status).json({ error: result.error });
    return;
  }
  res.json(result.application);
}
