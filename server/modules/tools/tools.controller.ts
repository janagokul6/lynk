import type { Request, Response } from "express";
import { agentKeyToolAllowlist, toolNames, type ToolName } from "@lynk/shared";
import type { AgentRequest } from "../../policies/requireAgentOrSession.js";
import { invokeTool, toolDescriptors } from "./tools.registry.js";

const SYNC_ROLES = new Set(["brand", "admin"]);

function sessionRole(req: AgentRequest): string | undefined {
  const user = req.session?.user as { role?: string } | undefined;
  return user?.role;
}

export async function listTools(req: Request, res: Response): Promise<void> {
  const authed = req as AgentRequest;
  const tools =
    authed.agentAuth === "key"
      ? toolDescriptors.filter((tool) =>
          (agentKeyToolAllowlist as readonly string[]).includes(tool.name)
        )
      : toolDescriptors;
  res.json({ tools });
}

export async function runTool(req: Request, res: Response): Promise<void> {
  const name = String(req.params.name ?? "") as ToolName;
  if (!toolNames.includes(name)) {
    res.status(404).json({ error: "Unknown tool" });
    return;
  }

  const authed = req as AgentRequest;
  if (authed.agentAuth === "key") {
    if (!(agentKeyToolAllowlist as readonly string[]).includes(name)) {
      res.status(403).json({ error: "Forbidden" });
      return;
    }
  } else if (name === "creators.enqueue_sync") {
    const role = sessionRole(authed);
    if (!role || !SYNC_ROLES.has(role)) {
      res.status(403).json({ error: "Forbidden" });
      return;
    }
  }

  try {
    const result = await invokeTool(name, req.body ?? {}, { userId: authed.userId });
    res.status(name === "creators.enqueue_sync" ? 202 : 200).json({ tool: name, result });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Tool failed";
    res.status(400).json({ error: message });
  }
}
