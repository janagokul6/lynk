import { createHmac, timingSafeEqual } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import { dirname, isAbsolute, join, relative, resolve } from "node:path";
import { AwsClient } from "aws4fetch";
import { env } from "../config/env.js";

export type SignedUpload = {
  uploadUrl: string;
  publicUrl: string;
  key: string;
  mode: "r2" | "local";
};

export const MAX_UPLOAD_BYTES = 8 * 1024 * 1024;

const ALLOWED_CONTENT_TYPES: Record<string, readonly string[]> = {
  "image/jpeg": [".jpg", ".jpeg"],
  "image/png": [".png"],
  "image/webp": [".webp"],
  "image/gif": [".gif"],
  "image/avif": [".avif"],
  "video/mp4": [".mp4"],
  "video/webm": [".webm"],
  "application/pdf": [".pdf"],
};

const LOCAL_ROOT = join(process.cwd(), ".data", "uploads");
const KEY_SEGMENT = /^[A-Za-z0-9][A-Za-z0-9._-]*$/;

export function isSafeObjectKey(key: string): boolean {
  if (!key || key.length > 512) return false;
  if (key.includes("\\") || key.includes("\0") || key.includes("..")) return false;
  return key.split("/").every((segment) => KEY_SEGMENT.test(segment));
}

export function isAllowedContentType(contentType: string): boolean {
  return Object.prototype.hasOwnProperty.call(ALLOWED_CONTENT_TYPES, contentType);
}

export function contentTypeMatchesKey(contentType: string, key: string): boolean {
  const extensions = ALLOWED_CONTENT_TYPES[contentType];
  if (!extensions) return false;
  const lower = key.toLowerCase();
  return extensions.some((ext) => lower.endsWith(ext));
}

export function isOwnedUploadKey(userId: string, key: string): boolean {
  if (!isSafeObjectKey(userId) || !isSafeObjectKey(key)) return false;
  const prefix = `users/${userId}/`;
  return key.startsWith(prefix) && key.length > prefix.length;
}

export function bytesMatchContentType(contentType: string, body: Buffer): boolean {
  if (body.length < 8) return false;
  if (contentType === "image/png") {
    return body.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]));
  }
  if (contentType === "image/jpeg") return body[0] === 0xff && body[1] === 0xd8 && body[2] === 0xff;
  if (contentType === "image/gif") {
    const header = body.subarray(0, 6).toString("ascii");
    return header === "GIF87a" || header === "GIF89a";
  }
  if (contentType === "image/webp") {
    return body.length >= 12 && body.subarray(0, 4).toString("ascii") === "RIFF" && body.subarray(8, 12).toString("ascii") === "WEBP";
  }
  if (contentType === "image/avif" || contentType === "video/mp4") {
    if (body.length < 12 || body.subarray(4, 8).toString("ascii") !== "ftyp") return false;
    if (contentType === "video/mp4") return true;
    const brand = body.subarray(8, 12).toString("ascii");
    return brand.startsWith("avif") || brand.startsWith("avis");
  }
  if (contentType === "video/webm") {
    return body[0] === 0x1a && body[1] === 0x45 && body[2] === 0xdf && body[3] === 0xa3;
  }
  if (contentType === "application/pdf") return body.subarray(0, 5).toString("ascii") === "%PDF-";
  return false;
}

export function contentTypeForKey(key: string): string {
  const lower = key.toLowerCase();
  const match = Object.entries(ALLOWED_CONTENT_TYPES)
    .flatMap(([type, extensions]) => extensions.map((ext) => ({ type, ext })))
    .sort((a, b) => b.ext.length - a.ext.length)
    .find(({ ext }) => lower.endsWith(ext));
  return match?.type ?? "application/octet-stream";
}

function isR2Configured(): boolean {
  return Boolean(
    env.R2_ACCOUNT_ID && env.R2_ACCESS_KEY_ID && env.R2_SECRET_ACCESS_KEY && env.R2_BUCKET
  );
}

function signLocalToken(key: string, contentType: string, expiresAt: number): string {
  const payload = `${key}:${expiresAt}:${contentType}`;
  const sig = createHmac("sha256", env.BETTER_AUTH_SECRET).update(payload).digest("hex");
  return Buffer.from(`${payload}:${sig}`).toString("base64url");
}

export function verifyLocalUploadToken(token: string): { key: string; contentType: string } | null {
  try {
    const raw = Buffer.from(token, "base64url").toString("utf8");
    const sigIndex = raw.lastIndexOf(":");
    if (sigIndex <= 0) return null;
    const sig = raw.slice(sigIndex + 1);
    const rest = raw.slice(0, sigIndex);
    const typeIndex = rest.lastIndexOf(":");
    if (typeIndex <= 0) return null;
    const contentType = rest.slice(typeIndex + 1);
    const rest2 = rest.slice(0, typeIndex);
    const expIndex = rest2.lastIndexOf(":");
    if (expIndex <= 0) return null;
    const expiresRaw = rest2.slice(expIndex + 1);
    const key = rest2.slice(0, expIndex);
    const expiresAt = Number(expiresRaw);
    if (!key || !contentType || !sig || !Number.isFinite(expiresAt) || expiresAt < Date.now()) return null;
    if (!isSafeObjectKey(key) || !contentTypeMatchesKey(contentType, key)) return null;
    const expected = createHmac("sha256", env.BETTER_AUTH_SECRET)
      .update(`${key}:${expiresAt}:${contentType}`)
      .digest("hex");
    const a = Buffer.from(sig);
    const b = Buffer.from(expected);
    if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
    return { key, contentType };
  } catch {
    return null;
  }
}

export function resolveLocalUpload(key: string): string | null {
  if (!isSafeObjectKey(key)) return null;
  const root = resolve(LOCAL_ROOT);
  const target = resolve(root, key);
  const rel = relative(root, target);
  if (rel.startsWith("..") || isAbsolute(rel)) return null;
  return target;
}

export async function createSignedUpload(key: string, contentType: string): Promise<SignedUpload> {
  if (!isSafeObjectKey(key) || !contentTypeMatchesKey(contentType, key)) {
    const err = new Error("Invalid upload") as Error & { statusCode?: number };
    err.statusCode = 400;
    throw err;
  }

  if (isR2Configured()) {
    const endpoint = `https://${env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`;
    const client = new AwsClient({
      accessKeyId: env.R2_ACCESS_KEY_ID!,
      secretAccessKey: env.R2_SECRET_ACCESS_KEY!,
      service: "s3",
      region: "auto",
    });
    const url = new URL(`${endpoint}/${env.R2_BUCKET}/${key}`);
    url.searchParams.set("X-Amz-Expires", "900");
    const signed = await client.sign(url, {
      method: "PUT",
      headers: { "content-type": contentType },
      aws: { signQuery: true },
    });
    const publicBase = env.R2_PUBLIC_BASE_URL ?? `${endpoint}/${env.R2_BUCKET}`;
    return {
      uploadUrl: signed.url,
      publicUrl: `${publicBase}/${key}`,
      key,
      mode: "r2",
    };
  }

  const expiresAt = Date.now() + 15 * 60 * 1000;
  const token = signLocalToken(key, contentType, expiresAt);
  const base = env.BETTER_AUTH_URL.replace(/\/$/, "");
  return {
    uploadUrl: `${base}/api/storage/upload?token=${token}`,
    publicUrl: `${base}/api/storage/files/${key}`,
    key,
    mode: "local",
  };
}

export async function saveLocalUpload(key: string, body: Buffer): Promise<string> {
  if (body.length > MAX_UPLOAD_BYTES) {
    const err = new Error("Upload too large") as Error & { statusCode?: number };
    err.statusCode = 413;
    throw err;
  }
  const path = resolveLocalUpload(key);
  if (!path) {
    const err = new Error("Invalid key") as Error & { statusCode?: number };
    err.statusCode = 400;
    throw err;
  }
  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, body);
  return path;
}
