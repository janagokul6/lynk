/** Test-only user text. The scripted model treats this as a tool call and ignores every other instruction. */
export function scriptToolMessage(toolName: string, input: unknown): string {
  return `LYNK_TOOL ${toolName} ${JSON.stringify(input ?? {})}`;
}

export const SCRIPT_MODEL_ERROR = "LYNK_MODEL_ERROR";
