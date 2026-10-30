import { createReadStream, existsSync } from "node:fs";
import type { Request, Response } from "express";
import { z } from "zod";
import type { AuthedRequest } from "../../policies/requireSession.js";
import {
  createSignedUpload,
  localUploadPath,
  saveLocalUpload,
  verifyLocalUploadToken,
} from "../../lib/storage.js";

const signSchema = z.object({
  key: z.string().trim().min(1).max(512).regex(/^[a-zA-Z0-9/_.-]+$/),
  contentType: z.string().trim().min(1).max(128).default("application/octet-stream"),
});

export async function sign(req: Request, res: Response): Promise<void> {
  const { userId } = req as AuthedRequest;
  const parsed = signSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Validation failed", details: parsed.error.flatten() });
    return;
  }
  const keyed = `users/${userId}/${parsed.data.key}`;
  const signed = await createSignedUpload(keyed, parsed.data.contentType);
  res.json(signed);
}

export async function uploadLocal(req: Request, res: Response): Promise<void> {
  const token = String(req.query.token ?? "");
  const verified = verifyLocalUploadToken(token);
  if (!verified) {
    res.status(401).json({ error: "Invalid or expired upload token" });
    return;
  }
  const chunks: Buffer[] = [];
  for await (const chunk of req) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }
  await saveLocalUpload(verified.key, Buffer.concat(chunks));
  res.status(201).json({ key: verified.key });
}

export async function getFile(req: Request, res: Response): Promise<void> {
  const raw = req.params.key;
  const key = Array.isArray(raw) ? raw.join("/") : String(raw ?? "");
  if (!key || key.includes("..")) {
    res.status(400).json({ error: "Invalid key" });
    return;
  }
  const path = localUploadPath(key);
  if (!existsSync(path)) {
    res.status(404).json({ error: "Not found" });
    return;
  }
  createReadStream(path).pipe(res);
}
