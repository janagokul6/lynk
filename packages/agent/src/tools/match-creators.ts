import { createTool } from "@mastra/core/tools";
import { creatorMatchQuerySchema, creatorMatchResultSchema } from "@lynk/shared";
import { invokeLynkTool } from "../lynk-client.js";
import { cookieFromToolContext } from "../request-scope.js";

export const matchCreatorsTool = createTool({
  id: "creators_match",
  description:
    "Search and rank influencers/creators by free-text query, niches, platform, or follower floor. Use when a brand wants creator recommendations.",
  inputSchema: creatorMatchQuerySchema,
  outputSchema: creatorMatchResultSchema,
  execute: async (input, context) => {
    const cookie = cookieFromToolContext(context);
    return invokeLynkTool("creators.match", input, cookie ? { cookie } : undefined);
  },
});
