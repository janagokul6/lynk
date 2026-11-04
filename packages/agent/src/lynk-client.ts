import { agentEnv } from "./env.js";

export async function invokeLynkTool<T>(
  name: string,
  input: unknown,
  options?: { cookie?: string }
): Promise<T> {
  const headers: Record<string, string> = {
    "content-type": "application/json",
  };
  if (options?.cookie) {
    headers.cookie = options.cookie;
  } else {
    headers["x-agent-key"] = agentEnv.AGENT_API_KEY;
  }

  const res = await fetch(`${agentEnv.LYNK_API_URL}/api/tools/${name}`, {
    method: "POST",
    headers,
    body: JSON.stringify(input ?? {}),
  });

  const data = (await res.json()) as { result?: T; error?: string };
  if (!res.ok) {
    throw new Error(data.error ?? `Lynk tool ${name} failed (${res.status})`);
  }
  return data.result as T;
}
