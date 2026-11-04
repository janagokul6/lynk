import { RequestContext } from "@mastra/core/request-context";
import { brandAgent } from "./agents/brand.js";
import { influencerAgent } from "./agents/influencer.js";
import { createScriptModel } from "./script-model.js";
import { LYNK_COOKIE_KEY, runWithLynkScope } from "./request-scope.js";

export async function runScriptedAgentTurn(
  role: "brand" | "influencer",
  cookie: string,
  message: string
) {
  const requestContext = new RequestContext();
  requestContext.setRaw(LYNK_COOKIE_KEY, cookie);
  const agent = role === "brand" ? brandAgent : influencerAgent;
  const result = await runWithLynkScope({ cookie, userId: "scripted-turn" }, () =>
    agent.generate(message, {
      model: createScriptModel() as never,
      requestContext,
      maxSteps: 4,
    })
  );
  return {
    text: result.text ?? "",
    toolResults: JSON.stringify(result.toolResults ?? []),
  };
}
