export type CopilotAuth = "ok" | "unauthorized" | "forbidden";

export type CopilotIdentity = {
  userId: string;
  role: "brand" | "influencer";
};

export function roleFromMePayload(body: unknown): string | null {
  return identityFromMePayload(body)?.role ?? null;
}

export function identityFromMePayload(body: unknown): { userId: string; role: string } | null {
  if (!body || typeof body !== "object") return null;
  const user = (body as { user?: { id?: unknown; role?: unknown } }).user;
  if (!user || typeof user.id !== "string" || user.id.length === 0) return null;
  if (typeof user.role !== "string" || user.role.length === 0) return null;
  return { userId: user.id, role: user.role };
}

export function agentIdFromCopilotBody(body: unknown): string | null {
  if (!body || typeof body !== "object") return null;
  const record = body as Record<string, unknown>;
  if (typeof record.agent === "string") return record.agent;
  if (typeof record.agentId === "string") return record.agentId;
  for (const key of ["body", "params"] as const) {
    const nested = record[key];
    if (!nested || typeof nested !== "object") continue;
    const agent = (nested as { agent?: unknown; agentId?: unknown }).agent;
    const agentId = (nested as { agentId?: unknown }).agentId;
    if (typeof agent === "string") return agent;
    if (typeof agentId === "string") return agentId;
  }
  return null;
}

export function agentAllowedForRole(role: string, agentId: string | null): boolean {
  if (role !== "brand" && role !== "influencer") return false;
  if (!agentId) return true;
  if (agentId === "brandAgent") return role === "brand";
  if (agentId === "influencerAgent") return role === "influencer";
  return false;
}

type FetchLike = (input: string, init?: { headers?: Record<string, string> }) => Promise<{
  ok: boolean;
  json: () => Promise<unknown>;
}>;

export async function authorizeCopilotCookie(
  cookie: string | undefined,
  deps: { apiUrl: string; fetchImpl: FetchLike }
): Promise<CopilotAuth> {
  const identity = await readCopilotIdentity(cookie, deps);
  if (identity === "unauthorized") return "unauthorized";
  if (identity === "forbidden") return "forbidden";
  return "ok";
}

export async function readCopilotIdentity(
  cookie: string | undefined,
  deps: { apiUrl: string; fetchImpl: FetchLike }
): Promise<CopilotIdentity | "unauthorized" | "forbidden"> {
  if (!cookie) return "unauthorized";
  let res: { ok: boolean; json: () => Promise<unknown> };
  try {
    res = await deps.fetchImpl(`${deps.apiUrl}/api/me`, { headers: { cookie } });
  } catch {
    return "unauthorized";
  }
  if (!res.ok) return "unauthorized";
  const identity = identityFromMePayload(await res.json());
  if (!identity) return "unauthorized";
  if (identity.role !== "brand" && identity.role !== "influencer") return "forbidden";
  return { userId: identity.userId, role: identity.role };
}
