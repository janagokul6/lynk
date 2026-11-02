import type { Request, Response } from "express";
import { toolNames, type ToolName } from "@lynk/shared";
import type { AuthedRequest } from "../../policies/requireSession.js";
import { invokeTool, toolDescriptors } from "./tools.registry.js";

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
  try {
    const result = await invokeTool(name, req.body ?? {}, { userId: authed.userId });
    res.json({ tool: name, result });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Tool failed";
    res.status(400).json({ error: message });
  }
}
