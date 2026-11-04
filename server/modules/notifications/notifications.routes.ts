import { Router } from "express";
import type { Request, Response } from "express";
import { requireSession } from "../../policies/requireSession.js";
import type { AuthedRequest } from "../../policies/requireSession.js";
import * as service from "./notifications.service.js";

export const notificationsRouter = Router();

notificationsRouter.use(requireSession);

notificationsRouter.get("/", async (req: Request, res: Response) => {
  const { userId } = req as AuthedRequest;
  res.json(await service.listNotifications(userId));
});

notificationsRouter.post("/read-all", async (req: Request, res: Response) => {
  const { userId } = req as AuthedRequest;
  await service.markAllRead(userId);
  res.json({ ok: true });
});

notificationsRouter.post("/:id/read", async (req: Request, res: Response) => {
  const { userId } = req as AuthedRequest;
  const ok = await service.markRead(userId, String(req.params.id));
  if (!ok) {
    res.status(404).json({ error: "Notification not found" });
    return;
  }
  res.json({ ok: true });
});
