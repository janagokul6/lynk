import type { Request, Response } from "express";
import type { AuthedRequest } from "../../policies/requireSession.js";
import * as service from "./home.service.js";

export async function getHome(req: Request, res: Response): Promise<void> {
  const authed = req as AuthedRequest;
  const account = await service.loadAccount(authed.userId);
  if (!account) {
    res.status(404).json({ error: "Not found" });
    return;
  }
  if (account.role === "brand") {
    res.json(await service.brandHome(authed.userId, account.name, account.plan));
    return;
  }
  if (account.role === "influencer") {
    res.json(await service.influencerHome(authed.userId, account.name, account.plan));
    return;
  }
  res.status(403).json({ error: "Forbidden" });
}
