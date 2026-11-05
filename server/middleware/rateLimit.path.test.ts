import { describe, expect, it } from "vitest";
import { isCredentialAuthPath, isProductMailPath } from "./rateLimit.js";

describe("isCredentialAuthPath", () => {
  it("covers credential attempts and leaves session reads alone", () => {
    expect(isCredentialAuthPath("/api/auth/sign-in/email")).toBe(true);
    expect(isCredentialAuthPath("/api/auth/sign-up/email")).toBe(true);
    expect(isCredentialAuthPath("/api/auth/forget-password")).toBe(true);
    expect(isCredentialAuthPath("/api/auth/reset-password")).toBe(true);
    expect(isCredentialAuthPath("/api/auth/request-password-reset")).toBe(true);
    expect(isCredentialAuthPath("/api/auth/change-password")).toBe(true);
    expect(isCredentialAuthPath("/api/auth/delete-user")).toBe(true);
    expect(isCredentialAuthPath("/api/auth/delete-user/callback")).toBe(true);
    expect(isCredentialAuthPath("/api/auth/get-session")).toBe(false);
    expect(isCredentialAuthPath("/api/auth/sign-out")).toBe(false);
    expect(isCredentialAuthPath("/api/me")).toBe(false);
    expect(isProductMailPath("POST", "/api/invites")).toBe(true);
    expect(isProductMailPath("POST", "/api/applications")).toBe(true);
    expect(isProductMailPath("POST", "/api/applications/abc/accept")).toBe(true);
    expect(isProductMailPath("GET", "/api/invites")).toBe(false);
    expect(isProductMailPath("POST", "/api/collab/abc/approve")).toBe(false);
  });
});
