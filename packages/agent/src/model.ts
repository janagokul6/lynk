import { createOpenAI } from "@ai-sdk/openai";
import { agentEnv } from "./env.js";

/**
 * Always return an OpenAI model handle so Mastra can boot.
 * Without OPENAI_API_KEY, chat calls fail with a clear provider auth error —
 * set the key in packages/agent/.env for live replies.
 */
export function resolveBrandModel() {
  const client = createOpenAI({
    apiKey: agentEnv.OPENAI_API_KEY ?? "missing-openai-api-key",
  });
  return client("gpt-4o-mini");
}
