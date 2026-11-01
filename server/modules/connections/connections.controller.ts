import type { Request, Response } from "express";
import { socialConnectionCreateSchema } from "@lynk/shared";
import { env } from "../../config/env.js";
import type { AuthedRequest } from "../../policies/requireSession.js";
import * as service from "./connections.service.js";

export async function list(req: Request, res: Response): Promise<void> {
  const { userId } = req as AuthedRequest;
  const rows = await service.listConnections(userId);
  res.json({
    connections: rows.map((r) => ({
      id: r.id,
      platform: r.platform,
      externalAccountId: r.externalAccountId,
      handle: r.handle,
      createdAt: r.createdAt.toISOString(),
      updatedAt: r.updatedAt.toISOString(),
    })),
  });
}

export async function upsert(req: Request, res: Response): Promise<void> {
  const { userId } = req as AuthedRequest;
  const parsed = socialConnectionCreateSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Validation failed", details: parsed.error.flatten() });
    return;
  }
  if ((parsed.data.accessToken || parsed.data.refreshToken) && !env.ALLOW_CLIENT_SOCIAL_TOKENS) {
    res.status(400).json({
      error: "Client-supplied social tokens are disabled",
    });
    return;
  }
  const row = await service.upsertConnection(userId, parsed.data);
  res.status(201).json({
    id: row.id,
    platform: row.platform,
    externalAccountId: row.externalAccountId,
    handle: row.handle,
  });
}

export async function remove(req: Request, res: Response): Promise<void> {
  const { userId } = req as AuthedRequest;
  const platform = String(req.params.platform ?? "");
  if (!platform) {
    res.status(400).json({ error: "platform required" });
    return;
  }
  await service.removeConnection(userId, platform);
  res.status(204).end();
}
