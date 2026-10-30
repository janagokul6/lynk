import type { Request, Response } from "express";
import { creatorMatchQuerySchema, creatorSyncPayloadSchema } from "@lynk/shared";
import * as service from "./creators.service.js";

export async function match(req: Request, res: Response): Promise<void> {
  const parsed = creatorMatchQuerySchema.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: "Validation failed", details: parsed.error.flatten() });
    return;
  }
  const rows = await service.matchCreators(parsed.data);
  res.json({ creators: rows.map(service.toDiscoveryInfluencer) });
}

export async function enqueueSync(req: Request, res: Response): Promise<void> {
  const parsed = creatorSyncPayloadSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Validation failed", details: parsed.error.flatten() });
    return;
  }
  const jobId = await service.enqueueCreatorSync(parsed.data);
  res.status(202).json({ jobId });
}
