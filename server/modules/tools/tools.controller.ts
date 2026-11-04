import type { Request, Response } from "express";
import {
  TOOL_CONFIRM_HEADER,
  toolCallerAllowed,
  toolNames,
  toolsForCaller,
  type ToolName,
} from "@lynk/shared";
import { consumeAgentTurn } from "../../lib/agent-turns.js";
import type { AgentRequest } from "../../policies/requireAgentOrSession.js";
import { ToolError } from "./tools.errors.js";
import { invokeTool, toolDescriptors } from "./tools.registry.js";

function sessionRole(req: AgentRequest): string | undefined {
  const user = req.session?.user as { role?: string } | undefined;
  return user?.role;
}

export async function listTools(req: Request, res: Response): Promise<void> {
  const authed = req as AgentRequest;
  const caller =
    authed.agentAuth === "key"
      ? ({ kind: "key" } as const)
      : ({ kind: "session", role: sessionRole(authed) ?? "" } as const);
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
  const caller =
    authed.agentAuth === "key"
      ? ({ kind: "key" } as const)
      : ({ kind: "session", role: sessionRole(authed) ?? "" } as const);
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
