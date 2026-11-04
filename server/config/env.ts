import { z } from "zod";
import { productionAgentKeyIssue } from "@lynk/shared";
import { decodeTokenEncryptionKey } from "../lib/token-key.js";

const booleanFromEnv = z.preprocess((value) => {
  if (value === undefined || value === "") return false;
  if (value === true || value === "true" || value === "1") return true;
  if (value === false || value === "false" || value === "0") return false;
  return value;
}, z.boolean());

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  PORT: z.coerce.number().default(43124),
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
  BETTER_AUTH_SECRET: z.string().min(32, "BETTER_AUTH_SECRET must be at least 32 characters"),
  BETTER_AUTH_URL: z.string().url().default("http://127.0.0.1:43124"),
  CLIENT_ORIGIN: z.string().url().default("http://127.0.0.1:43123"),
  AGENT_API_KEY: z.string().min(16).optional(),
  GOOGLE_CLIENT_ID: z.string().min(1).optional(),
  GOOGLE_CLIENT_SECRET: z.string().min(1).optional(),
  YOUTUBE_API_KEY: z.string().min(1).optional(),
  META_GRAPH_API_VERSION: z.string().default("v25.0"),
  META_IG_USER_ID: z.string().min(1).optional(),
  META_PAGE_ACCESS_TOKEN: z.string().min(1).optional(),
  R2_ACCOUNT_ID: z.string().min(1).optional(),
  R2_ACCESS_KEY_ID: z.string().min(1).optional(),
  R2_SECRET_ACCESS_KEY: z.string().min(1).optional(),
  R2_BUCKET: z.string().min(1).optional(),
  R2_PUBLIC_BASE_URL: z.string().url().optional(),
  RATE_LIMIT_WINDOW_MS: z.coerce.number().default(15 * 60 * 1000),
  RATE_LIMIT_MAX: z.coerce.number().default(100),
  RATE_LIMIT_AUTH_MAX: z.coerce.number().default(5),
  TRUST_PROXY: z.coerce.number().int().min(0).max(32).default(0),
  MATCH_MAX_DISTANCE: z.coerce.number().min(0).max(2).default(0.75),
  TOKEN_ENCRYPTION_KEY: z.string().min(1).optional(),
  ALLOW_CLIENT_SOCIAL_TOKENS: booleanFromEnv.default(false),
}).superRefine((data, ctx) => {
  if (data.NODE_ENV === "production") {
    const agentKeyIssue = productionAgentKeyIssue(data.AGENT_API_KEY);
    if (agentKeyIssue) {
      ctx.addIssue({
        code: "custom",
        path: ["AGENT_API_KEY"],
        message: agentKeyIssue,
      });
    }
  }
  if (data.NODE_ENV === "production" && !data.TOKEN_ENCRYPTION_KEY) {
    ctx.addIssue({
      code: "custom",
      path: ["TOKEN_ENCRYPTION_KEY"],
      message: "TOKEN_ENCRYPTION_KEY is required in production",
    });
  }
  if (data.ALLOW_CLIENT_SOCIAL_TOKENS && !data.TOKEN_ENCRYPTION_KEY) {
    ctx.addIssue({
      code: "custom",
      path: ["TOKEN_ENCRYPTION_KEY"],
      message: "TOKEN_ENCRYPTION_KEY is required when ALLOW_CLIENT_SOCIAL_TOKENS is enabled",
    });
  }
  if (!data.TOKEN_ENCRYPTION_KEY) return;
  try {
    decodeTokenEncryptionKey(data.TOKEN_ENCRYPTION_KEY);
  } catch (err) {
    ctx.addIssue({
      code: "custom",
      path: ["TOKEN_ENCRYPTION_KEY"],
      message: err instanceof Error ? err.message : "Invalid TOKEN_ENCRYPTION_KEY",
    });
  }
});

export type Env = z.infer<typeof envSchema>;

export function evaluateEnv(source: NodeJS.ProcessEnv) {
  return envSchema.safeParse(source);
}

function loadEnv(): Env {
  const result = evaluateEnv(process.env);
  if (!result.success) {
    const errors = result.error.flatten().fieldErrors;
    const message = Object.entries(errors)
      .map(([key, vals]) => `${key}: ${vals?.join(", ")}`)
      .join("\n");
    throw new Error(`Invalid environment variables:\n${message}`);
  }
  return result.data;
}

export const env = loadEnv();
