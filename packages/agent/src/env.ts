import { config } from "dotenv";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { productionAgentKeyIssue } from "@lynk/shared";
import { z } from "zod";

const packageRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
config({ path: path.join(packageRoot, ".env") });

const emptyToUndefined = (value: unknown) => {
  if (typeof value !== "string") return value;
  const trimmed = value.trim();
  return trimmed.length === 0 ? undefined : trimmed;
};

const booleanFromEnv = z.preprocess((value) => {
  if (value === undefined || value === "") return false;
  if (value === true || value === "true" || value === "1") return true;
  if (value === false || value === "false" || value === "0") return false;
  return value;
}, z.boolean());

const schema = z.object({
  OPENAI_API_KEY: z.preprocess(emptyToUndefined, z.string().min(1).optional()),
  LYNK_API_URL: z.string().url().default("http://127.0.0.1:43124"),
  AGENT_API_KEY: z.preprocess(emptyToUndefined, z.string().min(16)),
  CLIENT_ORIGIN: z.string().url().default("http://127.0.0.1:43123"),
  AGENT_HOST: z.string().min(1).default("127.0.0.1"),
  AGENT_TURN_LIMIT: z.coerce.number().int().positive().default(30),
  AGENT_TURN_WINDOW_MS: z.coerce.number().int().positive().default(10 * 60 * 1000),
  LYNK_SCRIPT_MODEL: booleanFromEnv.default(false),
  DATABASE_URL: z.string().min(1).default("postgresql://lynk:lynk@127.0.0.1:5432/lynk"),
});

export const agentEnv = schema.parse({
  OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  LYNK_API_URL: process.env.LYNK_API_URL,
  AGENT_API_KEY: process.env.AGENT_API_KEY,
  CLIENT_ORIGIN: process.env.CLIENT_ORIGIN,
  AGENT_HOST: process.env.AGENT_HOST,
  AGENT_TURN_LIMIT: process.env.AGENT_TURN_LIMIT,
  AGENT_TURN_WINDOW_MS: process.env.AGENT_TURN_WINDOW_MS,
  LYNK_SCRIPT_MODEL: process.env.LYNK_SCRIPT_MODEL,
  DATABASE_URL: process.env.DATABASE_URL,
});

if (process.env.NODE_ENV === "production") {
  const issue = productionAgentKeyIssue(agentEnv.AGENT_API_KEY);
  if (issue) {
    throw new Error(issue);
  }
}

if (!agentEnv.OPENAI_API_KEY && !agentEnv.LYNK_SCRIPT_MODEL) {
  console.warn(
    "[@lynk/agent] OPENAI_API_KEY is unset — Mastra boots, but chat replies fail until it is set. LYNK_SCRIPT_MODEL=1 uses the deterministic tool model."
  );
}
