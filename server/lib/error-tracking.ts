import { logger } from "../utils/logger.js";

function eventId(): string {
  return crypto.randomUUID().replace(/-/g, "");
}

export function captureException(err: unknown): void {
  const dsn = process.env.SENTRY_DSN;
  if (!dsn) return;
  void postSentry(dsn, err).catch((failure) => {
    logger.warn("sentry delivery failed", {
      error: failure instanceof Error ? failure.message : String(failure),
    });
  });
}

async function postSentry(dsn: string, err: unknown): Promise<void> {
  const url = new URL(dsn);
  const projectId = url.pathname.replace(/^\//, "");
  const id = eventId();
  const message = err instanceof Error ? err.message : String(err);
  const header = JSON.stringify({ event_id: id, dsn, sent_at: new Date().toISOString() });
  const item = JSON.stringify({ type: "event" });
  const event = JSON.stringify({
    event_id: id,
    platform: "node",
    message,
    exception: {
      values: [
        {
          type: err instanceof Error ? err.name : "Error",
          value: message,
        },
      ],
    },
  });
  const endpoint = `${url.protocol}//${url.host}/api/${projectId}/envelope/?sentry_key=${encodeURIComponent(url.username)}`;
  const response = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/x-sentry-envelope" },
    body: `${header}\n${item}\n${event}`,
  });
  if (!response.ok) {
    throw new Error(`Sentry responded ${response.status}`);
  }
}
