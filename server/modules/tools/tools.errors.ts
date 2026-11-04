export class ToolError extends Error {
  readonly status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

export function confirmationProposal(
  action: string,
  summary: string,
  input: Record<string, unknown>
) {
  return {
    needsConfirmation: true as const,
    action,
    summary,
    input,
  };
}
