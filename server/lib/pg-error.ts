export function isUniqueViolation(err: unknown): boolean {
  const cause = err instanceof Error ? (err as { cause?: unknown }).cause : undefined;
  return [err, cause].some(
    (candidate) =>
      typeof candidate === "object" &&
      candidate !== null &&
      "code" in candidate &&
      (candidate as { code?: string }).code === "23505"
  );
}
