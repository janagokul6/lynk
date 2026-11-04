import { Mastra } from "@mastra/core/mastra";
import { registerApiRoute, type MiddlewareHandler } from "@mastra/core/server";
import { MASTRA_RESOURCE_ID_KEY } from "@mastra/core/request-context";
import { registerCopilotKit } from "@ag-ui/mastra/copilotkit";
import { createSlidingWindowLimiter } from "@lynk/shared";
import { brandAgent } from "../agents/brand.js";
import { influencerAgent } from "../agents/influencer.js";
import {
  agentAllowedForRole,
  agentIdFromCopilotBody,
  readCopilotIdentity,
} from "../brand-session.js";
import { agentEnv } from "../env.js";
import { LYNK_COOKIE_KEY, currentLynkScope, runWithLynkScope } from "../request-scope.js";

const turnLimiter = createSlidingWindowLimiter({
  limit: agentEnv.AGENT_TURN_LIMIT,
  windowMs: agentEnv.AGENT_TURN_WINDOW_MS,
});

const requireSignedInSession: MiddlewareHandler = async (c, next) => {
  if (c.req.method === "OPTIONS") {
    await next();
    return;
  }
  const cookie = c.req.header("cookie");
  const identity = await readCopilotIdentity(cookie, {
    apiUrl: agentEnv.LYNK_API_URL,
    fetchImpl: (input, init) => fetch(input, init),
  });
  if (identity === "unauthorized") {
    return c.json({ error: "Unauthorized" }, 401);
  }
  if (identity === "forbidden") {
    return c.json({ error: "Forbidden" }, 403);
  }

  let agentId: string | null = null;
  if (c.req.method === "POST" && (c.req.header("content-type") ?? "").includes("json")) {
    try {
      agentId = agentIdFromCopilotBody(await c.req.raw.clone().json());
    } catch {
      agentId = null;
    }
  }
  if (!agentAllowedForRole(identity.role, agentId)) {
    return c.json({ error: "Forbidden" }, 403);
  }

  const decision = turnLimiter.check(identity.userId);
  if (!decision.ok) {
    return c.json({ error: "Too many agent turns. Try again shortly." }, 429);
  }

  await runWithLynkScope({ userId: identity.userId, cookie: cookie ?? "" }, () => next());
};

const copilotRoute = registerCopilotKit({
  path: "/copilotkit",
  resourceId: "brandAgent",
  setContext: (_c, requestContext) => {
    const scope = currentLynkScope();
    if (!scope) return;
    requestContext.setRaw(MASTRA_RESOURCE_ID_KEY, scope.userId);
    if (scope.cookie) requestContext.setRaw(LYNK_COOKIE_KEY, scope.cookie);
  },
});

const statusRoute = registerApiRoute("/status", {
  method: "GET",
  requiresAuth: false,
  handler: async (c) => {
    return c.json({
      llm: Boolean(agentEnv.OPENAI_API_KEY) || agentEnv.LYNK_SCRIPT_MODEL,
      mode: agentEnv.LYNK_SCRIPT_MODEL ? "script" : agentEnv.OPENAI_API_KEY ? "openai" : "unavailable",
    });
  },
});

export const mastra = new Mastra({
  agents: {
    brandAgent,
    influencerAgent,
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
      statusRoute,
      {
        ...copilotRoute,
        middleware: requireSignedInSession,
      },
    ],
  },
});
