import { env } from "../config/env.js";

export type SignedUpload = {
  uploadUrl: string;
  publicUrl: string;
  key: string;
};

export function isStorageConfigured(): boolean {
  return Boolean(env.R2_ACCOUNT_ID && env.R2_ACCESS_KEY_ID && env.R2_SECRET_ACCESS_KEY && env.R2_BUCKET);
}

export async function createSignedUpload(key: string, _contentType: string): Promise<SignedUpload> {
  if (!isStorageConfigured()) {
    throw new Error("R2 storage is not configured");
  }

  const publicBase = env.R2_PUBLIC_BASE_URL ?? `https://${env.R2_BUCKET}.r2.dev`;
  return {
    uploadUrl: `${publicBase}/upload-placeholder`,
    publicUrl: `${publicBase}/${key}`,
    key,
  };
}
