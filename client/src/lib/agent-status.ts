export function agentStatusUrl(runtimeUrl: string): string {
  const url = new URL(runtimeUrl);
  url.pathname = "/status";
  url.search = "";
  url.hash = "";
  return url.toString();
}

export async function readAgentLlm(runtimeUrl: string): Promise<{ llm: boolean; reason: string }> {
  try {
    const res = await fetch(agentStatusUrl(runtimeUrl));
    if (!res.ok) {
      return { llm: false, reason: "The assistant runtime did not respond. The dashboard still works." };
    }
    const body = (await res.json()) as { llm?: boolean };
    if (body.llm) return { llm: true, reason: "" };
    return {
      llm: false,
      reason: "Chat needs an OPENAI_API_KEY on the agent runtime. The dashboard still works.",
    };
  } catch {
    return {
      llm: false,
      reason: "The assistant runtime is not reachable. The dashboard still works.",
    };
  }
}
