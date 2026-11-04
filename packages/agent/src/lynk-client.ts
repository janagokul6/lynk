import type { ToolName } from "@lynk/shared";
import { agentEnv } from "./env.js";

export class LynkApiError extends Error {
  constructor(message: string, readonly status: number) {
    super(message);
    this.name = "LynkApiError";
  }
}

type FetchLike = typeof fetch;

export type LynkClientOptions = {
  baseUrl?: string;
  cookie?: string;
  agentKey?: string;
  fetchImpl?: FetchLike;
};

/**
 * One HTTP client for Lynk tool routes.
 * A session cookie is used for user-scoped calls. The shared agent key is only attached when no cookie is set.
 */
export function createLynkClient(options: LynkClientOptions = {}) {
  const baseUrl = options.baseUrl ?? agentEnv.LYNK_API_URL;
  const fetchImpl = options.fetchImpl ?? fetch;

  return {
    async invoke<T>(name: ToolName | string, input: unknown): Promise<T> {
      if (!options.cookie && !options.agentKey) {
        throw new LynkApiError("This action needs your signed-in session.", 401);
      }
      const headers: Record<string, string> = { "content-type": "application/json" };
      if (options.cookie) headers.cookie = options.cookie;
      else if (options.agentKey) headers["x-agent-key"] = options.agentKey;

      let res: Response;
      try {
        res = await fetchImpl(`${baseUrl}/api/tools/${name}`, {
          method: "POST",
          headers,
          body: JSON.stringify(input ?? {}),
        });
      } catch {
        throw new LynkApiError("Lynk API is unavailable.", 503);
      }

      let data: { result?: T; error?: string } = {};
      try {
        data = (await res.json()) as { result?: T; error?: string };
      } catch {
        data = {};
      }
      if (!res.ok) {
        throw new LynkApiError(data.error ?? `Lynk tool ${name} failed (${res.status})`, res.status);
      }
      return data.result as T;
    },
  };
}

export async function invokeLynkTool<T>(
  name: string,
  input: unknown,
  options?: { cookie?: string }
): Promise<T> {
  const client = createLynkClient(
    options?.cookie
      ? { cookie: options.cookie }
      : { agentKey: agentEnv.AGENT_API_KEY }
  );
  return client.invoke<T>(name, input);
}
