import { describe, expect, it } from "vitest";
import { roleForSignup } from "./auth.js";
import { devMailboxEnabled, mailLogFields } from "./mailer.js";
import { safeAppPath } from "./notify.js";
import { bytesMatchContentType } from "./storage.js";

describe("review guards", () => {
  it("locks only an explicit signup role", () => {
    expect(roleForSignup("influencer")).toEqual({ role: "influencer", lock: true });
    expect(roleForSignup(undefined)).toEqual({ role: "brand", lock: false });
    expect(roleForSignup("admin")).toBeNull();
  });

  it("keeps the dev mailbox and message bodies out of production", () => {
    expect(devMailboxEnabled("production")).toBe(false);
    expect(devMailboxEnabled("test", false)).toBe(true);
    expect(mailLogFields({ to: "a@example.com", subject: "Reset", text: "https://secret" }, "production")).toEqual({
      to: "a@example.com",
      subject: "Reset",
    });
    expect(mailLogFields({ to: "a@example.com", subject: "Reset", text: "https://secret" }, "test").text).toContain("secret");
  });

  it("stores notification links as app paths", () => {
    expect(safeAppPath("/collab/1")).toBe("/collab/1");
    expect(safeAppPath("https://evil.example/phish")).toBeNull();
    expect(safeAppPath("//evil.example")).toBeNull();
  });

  it("rejects a file whose bytes do not match the declared type", () => {
    const png = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0, 0, 0, 0]);
    expect(bytesMatchContentType("image/png", png)).toBe(true);
    expect(bytesMatchContentType("image/png", Buffer.from("<html><script>alert(1)</script></html>"))).toBe(false);
    expect(bytesMatchContentType("application/pdf", Buffer.from("%PDF-1.7\n"))).toBe(true);
  });
});
