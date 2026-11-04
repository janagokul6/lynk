import type { NextFunction, Request, Response } from "express";
import { fromNodeHeaders } from "better-auth/node";
import { env } from "../config/env.js";
import { auth } from "../lib/auth.js";
import { keysMatch } from "../lib/timing-safe.js";
import type { AuthedRequest } from "./requireSession.js";

export type AgentAccess = "session" | "key";

export type AgentRequest = AuthedRequest & {
  agentAuth: AgentAccess;
};

function agentKeyOk(req: Request): boolean {
  const expected = env.AGENT_API_KEY;
  if (!expected) return false;
  const header = req.header("x-agent-key");
  if (!header) return false;
  return keysMatch(header, expected);
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
    const authed = req as AgentRequest;
    authed.session = session;
    authed.userId = session.user.id;
    authed.agentAuth = "session";
    next();
    return;
  }

  if (agentKeyOk(req)) {
    (req as AgentRequest).agentAuth = "key";
    next();
    return;
  }

  res.status(401).json({ error: "Unauthorized" });
}
