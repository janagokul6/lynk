import { createHash, timingSafeEqual } from "node:crypto";

/** Compare two secrets without leaking which bytes differ. */
export function keysMatch(provided: string, expected: string): boolean {
  const left = createHash("sha256").update(provided).digest();
  const right = createHash("sha256").update(expected).digest();
  return timingSafeEqual(left, right);
}
