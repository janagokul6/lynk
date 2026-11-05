import type { Request, Response } from "express";
import { inviteCreateSchema } from "@lynk/shared";
import type { AuthedRequest } from "../../policies/requireSession.js";
import * as service from "./invites.service.js";

export async function create(req: Request, res: Response): Promise<void> {
  const { userId } = req as AuthedRequest;
  const parsed = inviteCreateSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Validation failed", details: parsed.error.flatten() });
    return;
  }
  const result = await service.createInvite(userId, parsed.data);
  if (!result.ok) {
    res.status(result.status).json({ error: result.error });
    return;
  }
  res.status(201).json(result.invite);
}

export async function list(req: Request, res: Response): Promise<void> {
  const { userId } = req as AuthedRequest;
  res.json({ invites: await service.listInvites(userId) });
}

export async function accept(req: Request, res: Response): Promise<void> {
  const { userId } = req as AuthedRequest;
  const result = await service.respondInvite(userId, String(req.params.id), "accepted");
  if (!result.ok) {
    res.status(result.status).json({ error: result.error });
    return;
  }
  res.json(result);
}

export async function decline(req: Request, res: Response): Promise<void> {
  const { userId } = req as AuthedRequest;
  const result = await service.respondInvite(userId, String(req.params.id), "declined");
  if (!result.ok) {
    res.status(result.status).json({ error: result.error });
    return;
  }
  res.json(result);
}
