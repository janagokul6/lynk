import { Router } from "express";
import type { Request, Response } from "express";
import { env } from "../../config/env.js";
import { devMailboxEnabled, isLoopbackAddress, recentMail } from "../../lib/mailer.js";

export const configRouter = Router();

configRouter.get("/", (_req: Request, res: Response) => {
  res.json({
    googleLogin: Boolean(env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET),
    youtubeConnect: Boolean(env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET),
    instagramConnect: Boolean(env.META_APP_ID && env.META_APP_SECRET),
  });
});

export const devRouter = Router();

devRouter.get("/mailbox", (req: Request, res: Response) => {
  if (!devMailboxEnabled() || !isLoopbackAddress(req.socket.remoteAddress)) {
    res.status(404).json({ error: "Not found" });
    return;
  }
  const email = typeof req.query.email === "string" ? req.query.email : undefined;
  res.json({ messages: recentMail(email) });
});
