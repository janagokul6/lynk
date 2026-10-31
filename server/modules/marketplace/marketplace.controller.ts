import type { Request, Response } from "express";
import * as service from "./marketplace.service.js";
import { marketplaceQuerySchema } from "./marketplace.validation.js";

export async function list(req: Request, res: Response): Promise<void> {
  const parsed = marketplaceQuerySchema.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: "Validation failed", details: parsed.error.flatten() });
    return;
  }

  const rows = await service.listMarketplaceCampaigns(parsed.data);
  res.json(rows.map(service.toMarketplaceCampaignResponse));
}
