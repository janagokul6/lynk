import { createOpenAI } from "@ai-sdk/openai";
import { agentEnv } from "./env.js";

/**
 * OpenAI model for the brand agent.
 * Requires OPENAI_API_KEY for successful generations; construction still succeeds without it
 * so `mastra dev` can boot for tool/UI wiring.
 */
export function resolveBrandModel() {
  const client = createOpenAI({
    apiKey: agentEnv.OPENAI_API_KEY ?? "missing-openai-api-key",
  });
  return client("gpt-4o-mini");
}
