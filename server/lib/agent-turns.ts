import { createSlidingWindowLimiter } from "@lynk/shared";
import { env } from "../config/env.js";

let limiter = createSlidingWindowLimiter({
  limit: env.AGENT_TURN_LIMIT,
  windowMs: env.AGENT_TURN_WINDOW_MS,
});

export function consumeAgentTurn(userId: string) {
  return limiter.check(userId);
}

export function setAgentTurnLimitForTests(limit: number, windowMs = env.AGENT_TURN_WINDOW_MS): void {
  limiter = createSlidingWindowLimiter({ limit, windowMs });
}
