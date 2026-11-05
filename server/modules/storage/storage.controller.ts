import { createReadStream, existsSync } from "node:fs";
import { basename } from "node:path";
import type { Request, Response } from "express";
import { z } from "zod";
import type { AuthedRequest } from "../../policies/requireSession.js";
import { storageKeyVisible } from "../collab/collab.service.js";
import {
  bytesMatchContentType,
  contentTypeForKey,
  contentTypeMatchesKey,
  createSignedUpload,
  isAllowedContentType,
  isSafeObjectKey,
  MAX_UPLOAD_BYTES,
  resolveLocalUpload,
  saveLocalUpload,
  verifyLocalUploadToken,
} from "../../lib/storage.js";

const signSchema = z
  .object({
    key: z
      .string()
      .trim()
      .min(1)
      .max(200)
      .refine((key) => isSafeObjectKey(key), "Invalid key"),
    contentType: z
      .string()
      .trim()
      .min(1)
      .max(128)
      .refine((value) => isAllowedContentType(value), "Unsupported content type"),
  })
  .refine((value) => contentTypeMatchesKey(value.contentType, value.key), {
    message: "Content type does not match the file extension",
    path: ["contentType"],
  });

export async function sign(req: Request, res: Response): Promise<void> {
  const { userId } = req as AuthedRequest;
  const parsed = signSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Validation failed", details: parsed.error.flatten() });
    return;
  }
  if (!isSafeObjectKey(userId)) {
    res.status(400).json({ error: "Invalid key" });
    return;
  }
  const keyed = `users/${userId}/${parsed.data.key}`;
  if (!isSafeObjectKey(keyed)) {
    res.status(400).json({ error: "Invalid key" });
    return;
  }
  const signed = await createSignedUpload(keyed, parsed.data.contentType);
  res.json(signed);
}

export async function uploadLocal(req: Request, res: Response): Promise<void> {
  const token = String(req.query.token ?? "");
  const verified = verifyLocalUploadToken(token);
  if (!verified) {
    res.status(401).json({ error: "Invalid or expired upload token" });
    req.destroy();
    return;
  }
  const declared = Number(req.headers["content-length"] ?? "");
  if (Number.isFinite(declared) && declared > MAX_UPLOAD_BYTES) {
    res.status(413).json({ error: "Upload too large" });
    req.destroy();
    return;
  }
  const chunks: Buffer[] = [];
  let total = 0;
  for await (const chunk of req) {
    const buf = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
    total += buf.length;
    if (total > MAX_UPLOAD_BYTES) {
      res.status(413).json({ error: "Upload too large" });
      req.destroy();
      return;
    }
    chunks.push(buf);
  }
  const body = Buffer.concat(chunks);
  if (!bytesMatchContentType(verified.contentType, body)) {
    res.status(415).json({ error: "File contents do not match the declared type" });
    return;
  }
  await saveLocalUpload(verified.key, body);
  res.status(201).json({ key: verified.key });
}

export async function getFile(req: Request, res: Response): Promise<void> {
  const { userId, session } = req as AuthedRequest;
  const raw = req.params.key;
  const key = Array.isArray(raw) ? raw.join("/") : String(raw ?? "");
  const path = resolveLocalUpload(key);
  if (!path) {
    res.status(400).json({ error: "Invalid key" });
    return;
  }
  const role = (session.user as { role?: string }).role;
  const ownsKey = key === `users/${userId}` || key.startsWith(`users/${userId}/`);
  const shared = ownsKey ? false : await storageKeyVisible(userId, key);
  if (role !== "admin" && !ownsKey && !shared) {
    res.status(403).json({ error: "Forbidden" });
    return;
  }
  if (!existsSync(path)) {
    res.status(404).json({ error: "Not found" });
    return;
  }
  const type = contentTypeForKey(key);
  const inline = type.startsWith("image/") || type.startsWith("video/");
  const filename = basename(key).replace(/[^A-Za-z0-9._-]/g, "_");
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("Content-Type", type);
  res.setHeader("Content-Disposition", `${inline ? "inline" : "attachment"}; filename="${filename}"`);
  createReadStream(path).pipe(res);
}
