import { createHmac, timingSafeEqual } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { AwsClient } from "aws4fetch";
import { env } from "../config/env.js";

export type SignedUpload = {
  uploadUrl: string;
  publicUrl: string;
  key: string;
  mode: "r2" | "local";
};

const LOCAL_ROOT = join(process.cwd(), ".data", "uploads");

export function isR2Configured(): boolean {
  return Boolean(
    env.R2_ACCOUNT_ID && env.R2_ACCESS_KEY_ID && env.R2_SECRET_ACCESS_KEY && env.R2_BUCKET
  );
}

function signLocalToken(key: string, expiresAt: number): string {
  const payload = `${key}:${expiresAt}`;
  const sig = createHmac("sha256", env.BETTER_AUTH_SECRET).update(payload).digest("hex");
  return Buffer.from(`${payload}:${sig}`).toString("base64url");
}

export function verifyLocalUploadToken(token: string): { key: string } | null {
  try {
    const raw = Buffer.from(token, "base64url").toString("utf8");
    const [key, expiresRaw, sig] = raw.split(":");
    const expiresAt = Number(expiresRaw);
    if (!key || !sig || !Number.isFinite(expiresAt) || expiresAt < Date.now()) return null;
    const expected = createHmac("sha256", env.BETTER_AUTH_SECRET)
      .update(`${key}:${expiresAt}`)
      .digest("hex");
    const a = Buffer.from(sig);
    const b = Buffer.from(expected);
    if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
    return { key };
  } catch {
    return null;
  }
}

export async function createSignedUpload(key: string, contentType: string): Promise<SignedUpload> {
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
  const token = signLocalToken(key, expiresAt);
  const base = env.BETTER_AUTH_URL.replace(/\/$/, "");
  return {
    uploadUrl: `${base}/api/storage/upload?token=${token}`,
    publicUrl: `${base}/api/storage/files/${key}`,
    key,
    mode: "local",
  };
}

export async function saveLocalUpload(key: string, body: Buffer): Promise<string> {
  const path = join(LOCAL_ROOT, key);
  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, body);
  return path;
}

export function localUploadPath(key: string): string {
  return join(LOCAL_ROOT, key);
}
