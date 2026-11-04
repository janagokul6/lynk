import { Mastra } from "@mastra/core/mastra";
import type { MiddlewareHandler } from "@mastra/core/server";
import { registerCopilotKit } from "@ag-ui/mastra/copilotkit";
import { brandAgent } from "../agents/brand.js";
import { authorizeCopilotCookie } from "../brand-session.js";
import { agentEnv } from "../env.js";

const requireBrandSession: MiddlewareHandler = async (c, next) => {
  if (c.req.method === "OPTIONS") {
    await next();
    return;
  }
  const decision = await authorizeCopilotCookie(c.req.header("cookie"), {
    apiUrl: agentEnv.LYNK_API_URL,
    fetchImpl: (input, init) => fetch(input, init),
  });
  if (decision === "unauthorized") {
    return c.json({ error: "Unauthorized" }, 401);
  }
  if (decision === "forbidden") {
    return c.json({ error: "Forbidden" }, 403);
  }
  await next();
};

const copilotRoute = registerCopilotKit({
  path: "/copilotkit",
  resourceId: "brandAgent",
});

export const mastra = new Mastra({
  agents: {
    brandAgent,
  },
  server: {
    port: 43126,
    host: agentEnv.AGENT_HOST,
    cors: {
      origin: [agentEnv.CLIENT_ORIGIN, "http://localhost:43123", "http://127.0.0.1:43123"],
      allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      allowHeaders: ["*"],
      credentials: true,
    },
    apiRoutes: [
      {
        ...copilotRoute,
        middleware: requireBrandSession,
      },
    ],
  },
});
