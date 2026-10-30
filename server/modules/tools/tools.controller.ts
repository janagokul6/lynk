import type { Request, Response } from "express";
import { toolNames, type ToolName } from "@lynk/shared";
import { env } from "../../config/env.js";
import type { AuthedRequest } from "../../policies/requireSession.js";
import { invokeTool, toolDescriptors } from "./tools.registry.js";

function agentAuthorized(req: Request): boolean {
  if (!env.AGENT_API_KEY) return false;
  const header = req.header("x-agent-key");
  return Boolean(header && header === env.AGENT_API_KEY);
}

export async function listTools(_req: Request, res: Response): Promise<void> {
  res.json({ tools: toolDescriptors });
}

export async function runTool(req: Request, res: Response): Promise<void> {
  const name = String(req.params.name ?? "") as ToolName;
  if (!toolNames.includes(name)) {
    res.status(404).json({ error: "Unknown tool" });
    return;
  }

  const authed = req as AuthedRequest;
  const userId = authed.userId;
  if (!userId && !agentAuthorized(req)) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  try {
    const result = await invokeTool(name, req.body ?? {}, { userId });
    res.json({ tool: name, result });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Tool failed";
    res.status(400).json({ error: message });
  }
}
