import { describe, expect, it } from "vitest";
import { createSlidingWindowLimiter } from "./rate-limit.js";

describe("createSlidingWindowLimiter", () => {
  it("limits each key inside the window and resets after it slides", () => {
    let now = 1_000;
    const limiter = createSlidingWindowLimiter({ limit: 2, windowMs: 100, now: () => now });
    expect(limiter.check("user-a").ok).toBe(true);
    expect(limiter.check("user-a").ok).toBe(true);
    const blocked = limiter.check("user-a");
    expect(blocked.ok).toBe(false);
    expect(limiter.check("user-b").ok).toBe(true);
    now = 1_200;
    expect(limiter.check("user-a").ok).toBe(true);
  });
});
