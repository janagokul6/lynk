import { createTool } from "@mastra/core/tools";
import { z } from "zod";
import { invokeLynkTool } from "../lynk-client.js";
import { cookieFromToolContext } from "../request-scope.js";

const healthResultSchema = z.object({
  ok: z.boolean(),
});

export const healthCheckTool = createTool({
  id: "health_check",
  description: "Ping the Lynk API tool layer to verify connectivity before heavier tool calls.",
  inputSchema: z.object({}).strict(),
  outputSchema: healthResultSchema,
  execute: async (_input, context) => {
    const cookie = cookieFromToolContext(context);
    return invokeLynkTool("health.check", {}, cookie ? { cookie } : undefined);
  },
});
