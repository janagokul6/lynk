import { describe, expect, it } from "vitest";
import { isCredentialAuthPath } from "./rateLimit.js";

describe("isCredentialAuthPath", () => {
  it("covers credential attempts and leaves session reads alone", () => {
    expect(isCredentialAuthPath("/api/auth/sign-in/email")).toBe(true);
    expect(isCredentialAuthPath("/api/auth/sign-up/email")).toBe(true);
    expect(isCredentialAuthPath("/api/auth/forget-password")).toBe(true);
    expect(isCredentialAuthPath("/api/auth/reset-password")).toBe(true);
    expect(isCredentialAuthPath("/api/auth/request-password-reset")).toBe(true);
    expect(isCredentialAuthPath("/api/auth/change-password")).toBe(true);
    expect(isCredentialAuthPath("/api/auth/get-session")).toBe(false);
    expect(isCredentialAuthPath("/api/auth/sign-out")).toBe(false);
    expect(isCredentialAuthPath("/api/me")).toBe(false);
  });
});
