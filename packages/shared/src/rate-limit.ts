export type RateLimitDecision =
  | { ok: true; remaining: number }
  | { ok: false; retryAfterMs: number };

export function createSlidingWindowLimiter(options: {
  limit: number;
  windowMs: number;
  now?: () => number;
}) {
  const hits = new Map<string, number[]>();
  const now = options.now ?? (() => Date.now());

  return {
    check(key: string): RateLimitDecision {
      const at = now();
      const start = at - options.windowMs;
      const recent = (hits.get(key) ?? []).filter((stamp) => stamp > start);
      if (recent.length >= options.limit) {
        hits.set(key, recent);
        const oldest = recent[0] ?? at;
        return { ok: false, retryAfterMs: Math.max(0, oldest + options.windowMs - at) };
      }
      recent.push(at);
      hits.set(key, recent);
      return { ok: true, remaining: options.limit - recent.length };
    },
    reset(): void {
      hits.clear();
    },
  };
}
