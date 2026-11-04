import type { Request, Response } from "express";
import { shortlistAddSchema, shortlistGroupCreateSchema } from "@lynk/shared";
import type { AuthedRequest } from "../../policies/requireSession.js";
import { ToolError } from "../tools/tools.errors.js";
import * as service from "./shortlist.service.js";

function sendError(res: Response, err: unknown): void {
  if (err instanceof ToolError) {
    res.status(err.status).json({ error: err.message });
    return;
  }
  const message = err instanceof Error ? err.message : "Shortlist failed";
  res.status(400).json({ error: message });
}

export async function list(req: Request, res: Response): Promise<void> {
  const { userId } = req as AuthedRequest;
  res.json(await service.listShortlist(userId));
}

export async function add(req: Request, res: Response): Promise<void> {
  const { userId } = req as AuthedRequest;
  const parsed = shortlistAddSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Validation failed", details: parsed.error.flatten() });
    return;
  }
  try {
    res.status(201).json(await service.addToShortlist(userId, parsed.data));
  } catch (err) {
    sendError(res, err);
  }
}

export async function removeItem(req: Request, res: Response): Promise<void> {
  const { userId } = req as AuthedRequest;
  try {
    await service.deleteShortlistItem(userId, String(req.params.id ?? ""));
    res.status(204).end();
  } catch (err) {
    sendError(res, err);
  }
}

export async function createGroup(req: Request, res: Response): Promise<void> {
  const { userId } = req as AuthedRequest;
  const parsed = shortlistGroupCreateSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Validation failed", details: parsed.error.flatten() });
    return;
  }
  try {
    res.status(201).json(await service.createGroup(userId, parsed.data.name));
  } catch (err) {
    sendError(res, err);
  }
}

export async function removeGroup(req: Request, res: Response): Promise<void> {
  const { userId } = req as AuthedRequest;
  try {
    await service.deleteGroup(userId, String(req.params.id ?? ""));
    res.status(204).end();
  } catch (err) {
    sendError(res, err);
  }
}
