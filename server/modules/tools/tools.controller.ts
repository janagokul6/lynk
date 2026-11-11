import type { Request, Response } from "express";
import { eq } from "drizzle-orm";
import {
  TOOL_CONFIRM_HEADER,
  toolCallerAllowed,
  toolNames,
  toolsForCaller,
  type ToolCaller,
  type ToolName,
} from "@lynk/shared";
import { db } from "../../lib/db.js";
import { user } from "../../db/schema.js";
import { consumeAgentTurn } from "../../lib/agent-turns.js";
import type { AgentRequest } from "../../policies/requireAgentOrSession.js";
import { ToolError } from "./tools.errors.js";
import { invokeTool, toolDescriptors } from "./tools.registry.js";

async function callerFor(req: AgentRequest): Promise<ToolCaller> {
  if (req.agentAuth === "key") return { kind: "key" };
  const [account] = await db
    .select({ role: user.role, roleChosenAt: user.roleChosenAt })
    .from(user)
    .where(eq(user.id, req.userId))
    .limit(1);
  const chosen = account && (account.role === "admin" || account.roleChosenAt);
  return { kind: "session", role: chosen ? account.role : "" };
}

export async function listTools(req: Request, res: Response): Promise<void> {
  const caller = await callerFor(req as AgentRequest);
  const allowed = new Set(toolsForCaller(caller));
  res.json({ tools: toolDescriptors.filter((tool) => allowed.has(tool.name)) });
}

export async function runTool(req: Request, res: Response): Promise<void> {
  const name = String(req.params.name ?? "") as ToolName;
  if (!toolNames.includes(name)) {
    res.status(404).json({ error: "Unknown tool" });
    return;
  }

  const authed = req as AgentRequest;
  const caller = await callerFor(authed);
  if (!toolCallerAllowed(name, caller)) {
    res.status(403).json({ error: "Forbidden" });
    return;
  }

  if (authed.agentAuth === "session" && authed.userId) {
    const decision = consumeAgentTurn(authed.userId);
    if (!decision.ok) {
      res.setHeader("Retry-After", String(Math.max(1, Math.ceil(decision.retryAfterMs / 1000))));
      res.status(429).json({ error: "Too many agent turns. Try again shortly." });
      return;
    }
  }

  try {
    const result = await invokeTool(name, req.body ?? {}, {
      userId: authed.userId,
      confirmed: req.header(TOOL_CONFIRM_HEADER) === "1",
    });
    res.status(name === "creators.enqueue_sync" ? 202 : 200).json({ tool: name, result });
  } catch (err) {
    if (err instanceof ToolError) {
      res.status(err.status).json({ error: err.message });
      return;
    }
    const message = err instanceof Error ? err.message : "Tool failed";
    res.status(400).json({ error: message });
  }
}
