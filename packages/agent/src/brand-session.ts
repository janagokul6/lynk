export type CopilotAuth = "ok" | "unauthorized" | "forbidden";

export function roleFromMePayload(body: unknown): string | null {
  if (!body || typeof body !== "object") return null;
  const user = (body as { user?: { role?: unknown } }).user;
  return typeof user?.role === "string" && user.role.length > 0 ? user.role : null;
}

type FetchLike = (input: string, init?: { headers?: Record<string, string> }) => Promise<{
  ok: boolean;
  json: () => Promise<unknown>;
}>;

export async function authorizeCopilotCookie(
  cookie: string | undefined,
  deps: { apiUrl: string; fetchImpl: FetchLike }
): Promise<CopilotAuth> {
  if (!cookie) return "unauthorized";
  let res: { ok: boolean; json: () => Promise<unknown> };
  try {
    res = await deps.fetchImpl(`${deps.apiUrl}/api/me`, { headers: { cookie } });
  } catch {
    return "unauthorized";
  }
  if (!res.ok) return "unauthorized";
  const role = roleFromMePayload(await res.json());
  if (!role) return "unauthorized";
  if (role !== "brand") return "forbidden";
  return "ok";
}
