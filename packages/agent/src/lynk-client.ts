import { agentEnv } from "./env.js";

export async function invokeLynkTool<T>(name: string, input: unknown): Promise<T> {
  const res = await fetch(`${agentEnv.LYNK_API_URL}/api/tools/${name}`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-agent-key": agentEnv.AGENT_API_KEY,
    },
    body: JSON.stringify(input ?? {}),
  });

  const data = (await res.json()) as { result?: T; error?: string };
  if (!res.ok) {
    throw new Error(data.error ?? `Lynk tool ${name} failed (${res.status})`);
  }
  return data.result as T;
}
