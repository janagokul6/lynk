import { createOpenAI } from "@ai-sdk/openai";
import { agentEnv } from "./env.js";
import { createScriptModel } from "./script-model.js";

/**
 * Chat model for both role agents.
 * `LYNK_SCRIPT_MODEL=1` uses a deterministic tool-calling model so the loop can run without OpenAI.
 * Otherwise this is gpt-4o-mini. Construction still succeeds without a key so the runtime can boot.
 */
export function resolveBrandModel() {
  if (agentEnv.LYNK_SCRIPT_MODEL) return createScriptModel();
  const client = createOpenAI({
    apiKey: agentEnv.OPENAI_API_KEY ?? "missing-openai-api-key",
  });
  return client("gpt-4o-mini");
}
