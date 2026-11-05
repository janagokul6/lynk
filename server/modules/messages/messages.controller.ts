import type { Request, Response } from "express";
import { messageCreateSchema, threadOpenSchema } from "@lynk/shared";
import type { AuthedRequest } from "../../policies/requireSession.js";
import * as service from "./messages.service.js";

export async function list(req: Request, res: Response): Promise<void> {
  const { userId } = req as AuthedRequest;
  res.json({ threads: await service.listThreads(userId) });
}

export async function open(req: Request, res: Response): Promise<void> {
  const { userId } = req as AuthedRequest;
  const parsed = threadOpenSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Validation failed", details: parsed.error.flatten() });
    return;
  }
  const result = await service.openThread(userId, parsed.data.applicationId, parsed.data.body);
  if (!result.ok) {
    res.status(result.status).json({ error: result.error });
    return;
  }
  res.status(201).json(result.thread);
}

export async function read(req: Request, res: Response): Promise<void> {
  const { userId } = req as AuthedRequest;
  const thread = await service.threadMessages(String(req.params.id), userId);
  if (!thread) {
    res.status(404).json({ error: "Conversation not found" });
    return;
  }
  res.json(thread);
}

export async function send(req: Request, res: Response): Promise<void> {
  const { userId } = req as AuthedRequest;
  const parsed = messageCreateSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Validation failed", details: parsed.error.flatten() });
    return;
  }
  const result = await service.postMessage(String(req.params.id), userId, parsed.data.body);
  if (!result.ok) {
    res.status(result.status).json({ error: result.error });
    return;
  }
  res.status(201).json(result.message);
}
