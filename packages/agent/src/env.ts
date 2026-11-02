import { config } from "dotenv";
import { z } from "zod";

config();

const emptyToUndefined = (value: unknown) => {
  if (typeof value !== "string") return value;
  const trimmed = value.trim();
  return trimmed.length === 0 ? undefined : trimmed;
};

const schema = z.object({
  OPENAI_API_KEY: z.preprocess(emptyToUndefined, z.string().min(1).optional()),
  ANTHROPIC_API_KEY: z.preprocess(emptyToUndefined, z.string().min(1).optional()),
  LYNK_API_URL: z.string().url().default("http://127.0.0.1:43124"),
  AGENT_API_KEY: z.preprocess(emptyToUndefined, z.string().min(16).optional()),
  CLIENT_ORIGIN: z.string().url().default("http://127.0.0.1:43123"),
});

export const agentEnv = schema.parse({
  OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY,
  LYNK_API_URL: process.env.LYNK_API_URL,
  AGENT_API_KEY: process.env.AGENT_API_KEY,
  CLIENT_ORIGIN: process.env.CLIENT_ORIGIN,
});
