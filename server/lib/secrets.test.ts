import { describe, expect, it } from "vitest";
import { decryptSecret, encryptSecret } from "./secrets.js";

describe("secret encryption", () => {
  it("round-trips a token and does not store the plaintext", () => {
    const plaintext = "super-secret-access-token";
    const stored = encryptSecret(plaintext);
    expect(stored).not.toContain(plaintext);
    expect(stored.startsWith("v1.")).toBe(true);
    expect(decryptSecret(stored)).toBe(plaintext);
  });
});
