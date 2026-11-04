import type { Request, Response } from "express";
import { ratingCreateSchema, revisionRequestSchema, submissionCreateSchema } from "@lynk/shared";
import type { AuthedRequest } from "../../policies/requireSession.js";
import * as service from "./collab.service.js";

function fail(res: Response, result: { status: number; error: string }) {
  res.status(result.status).json({ error: result.error });
}

export async function detail(req: Request, res: Response): Promise<void> {
  const { userId } = req as AuthedRequest;
  const row = await service.collabDetail(String(req.params.id), userId);
  if (!row) {
    res.status(404).json({ error: "Application not found" });
    return;
  }
  res.json(row);
}

export async function submitContent(req: Request, res: Response): Promise<void> {
  const { userId } = req as AuthedRequest;
  const parsed = submissionCreateSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Validation failed", details: parsed.error.flatten() });
    return;
  }
  const result = await service.submitContent(userId, String(req.params.id), parsed.data);
  if (!result.ok) return fail(res, result);
  res.status(201).json(result.detail);
}

export async function revision(req: Request, res: Response): Promise<void> {
  const { userId } = req as AuthedRequest;
  const parsed = revisionRequestSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Validation failed", details: parsed.error.flatten() });
    return;
  }
  const result = await service.requestRevision(userId, String(req.params.id), parsed.data.note);
  if (!result.ok) return fail(res, result);
  res.json(result.detail);
}

export async function approve(req: Request, res: Response): Promise<void> {
  const { userId } = req as AuthedRequest;
  const result = await service.approveContent(userId, String(req.params.id));
  if (!result.ok) return fail(res, result);
  res.json(result.detail);
}

export async function proof(req: Request, res: Response): Promise<void> {
  const { userId } = req as AuthedRequest;
  const parsed = submissionCreateSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Validation failed", details: parsed.error.flatten() });
    return;
  }
  const result = await service.submitProof(userId, String(req.params.id), parsed.data);
  if (!result.ok) return fail(res, result);
  res.status(201).json(result.detail);
}

export async function rate(req: Request, res: Response): Promise<void> {
  const { userId } = req as AuthedRequest;
  const parsed = ratingCreateSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Validation failed", details: parsed.error.flatten() });
    return;
  }
  const result = await service.rateCollab(userId, String(req.params.id), parsed.data);
  if (!result.ok) return fail(res, result);
  res.status(201).json(result.detail);
}
