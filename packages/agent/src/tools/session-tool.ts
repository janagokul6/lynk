import { createTool } from "@mastra/core/tools";
import type { ZodType } from "zod";
import { invokeLynkTool } from "../lynk-client.js";
import { cookieFromToolContext } from "../request-scope.js";

export function lynkSessionTool<TIn extends ZodType, TOut extends ZodType>(options: {
  id: string;
  description: string;
  inputSchema: TIn;
  outputSchema: TOut;
  apiName: string;
}) {
  return createTool({
    id: options.id,
    description: options.description,
    inputSchema: options.inputSchema,
    outputSchema: options.outputSchema,
    execute: async (input, context) => {
      const cookie = cookieFromToolContext(context);
      if (!cookie) {
        throw new Error("This action needs your signed-in session.");
      }
      return invokeLynkTool(options.apiName, input ?? {}, { cookie });
    },
  });
}
