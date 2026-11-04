export const EXAMPLE_AGENT_API_KEY = "lynk-dev-agent-key-16";
export const MIN_PRODUCTION_AGENT_KEY_LENGTH = 32;

/** Why a production process must refuse this key, or null when it is acceptable. Unset keys are allowed. */
export function productionAgentKeyIssue(key: string | undefined): string | null {
  if (!key) return null;
  if (key === EXAMPLE_AGENT_API_KEY) {
    return "AGENT_API_KEY must not use the published example value in production";
  }
  if (key.length < MIN_PRODUCTION_AGENT_KEY_LENGTH) {
    return `AGENT_API_KEY must be at least ${MIN_PRODUCTION_AGENT_KEY_LENGTH} characters in production`;
  }
  return null;
}
