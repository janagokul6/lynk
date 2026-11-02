import { Mastra } from "@mastra/core/mastra";
import { registerCopilotKit } from "@ag-ui/mastra/copilotkit";
import { brandAgent } from "../agents/brand.js";
import { agentEnv } from "../env.js";

export const mastra = new Mastra({
  agents: {
    brandAgent,
  },
  server: {
    port: 43126,
    host: "0.0.0.0",
    cors: {
      origin: [agentEnv.CLIENT_ORIGIN, "http://localhost:43123", "http://127.0.0.1:43123"],
      allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      allowHeaders: ["*"],
      credentials: true,
    },
    apiRoutes: [
      registerCopilotKit({
        path: "/copilotkit",
        resourceId: "brandAgent",
      }),
    ],
  },
});
