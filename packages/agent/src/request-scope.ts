import { AsyncLocalStorage } from "node:async_hooks";

export const LYNK_COOKIE_KEY = "lynk.cookie";

type Scope = { cookie: string; userId: string };
const scopes = new AsyncLocalStorage<Scope>();

type RequestContextLike = {
  getRaw?: (key: string) => unknown;
};

export function runWithLynkScope<T>(scope: Scope, fn: () => Promise<T>): Promise<T> {
  return scopes.run(scope, fn);
}

export function currentLynkScope(): Scope | undefined {
  return scopes.getStore();
}

export function cookieFromToolContext(context: { requestContext?: RequestContextLike } | undefined): string | undefined {
  const value = context?.requestContext?.getRaw?.(LYNK_COOKIE_KEY);
  if (typeof value === "string" && value.length > 0) return value;
  const scoped = scopes.getStore()?.cookie;
  return scoped && scoped.length > 0 ? scoped : undefined;
}
