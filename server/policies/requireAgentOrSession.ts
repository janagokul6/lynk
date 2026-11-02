import type { NextFunction, Request, Response } from "express";
import { fromNodeHeaders } from "better-auth/node";
import { env } from "../config/env.js";
import { auth } from "../lib/auth.js";
import type { AuthedRequest } from "./requireSession.js";

function agentKeyOk(req: Request): boolean {
  if (!env.AGENT_API_KEY) return false;
  const header = req.header("x-agent-key");
  return Boolean(header && header === env.AGENT_API_KEY);
}

/** Session cookie or matching `x-agent-key`. Attaches `userId` when a session exists. */
export async function requireAgentOrSession(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const session = await auth.api.getSession({
    headers: fromNodeHeaders(req.headers),
  });

  if (session?.user) {
    const authed = req as AuthedRequest;
    authed.session = session;
    authed.userId = session.user.id;
    next();
    return;
  }

  if (agentKeyOk(req)) {
    next();
    return;
  }

  res.status(401).json({ error: "Unauthorized" });
}
