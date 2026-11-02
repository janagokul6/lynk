import { PgBoss } from "pg-boss";
import type { Job, SendOptions } from "pg-boss";
import { env } from "../config/env.js";

const queue = new PgBoss({
  connectionString: env.DATABASE_URL,
});

export async function startQueue(): Promise<void> {
  await queue.start();
}

export async function stopQueue(): Promise<void> {
  await queue.stop();
}

export async function ensureQueue(name: string): Promise<void> {
  await queue.createQueue(name);
}

export function sendJob<T extends Record<string, unknown>>(
  name: string,
  data: T,
  options?: SendOptions
): Promise<string | null> {
  return queue.send(name, data, options);
}

export function work<T extends Record<string, unknown>>(
  name: string,
  handler: (jobs: Job<T>[]) => Promise<void>
): Promise<string> {
  return queue.work(name, handler as unknown as (jobs: Job<unknown>[]) => Promise<void>);
}
