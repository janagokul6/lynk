import { describe, expect, it, vi } from "vitest";
import { authorizeCopilotCookie, roleFromMePayload } from "./brand-session.js";

describe("authorizeCopilotCookie", () => {
  it("requires a brand session cookie", async () => {
    expect(roleFromMePayload(null)).toBeNull();
    expect(roleFromMePayload({ user: { role: "brand" } })).toBe("brand");

    const fetchImpl = vi.fn(async () => ({
      ok: true,
      json: async () => ({ user: { role: "influencer" } }),
    }));
    await expect(
      authorizeCopilotCookie(undefined, { apiUrl: "http://127.0.0.1:43124", fetchImpl })
    ).resolves.toBe("unauthorized");
    await expect(
      authorizeCopilotCookie("better-auth.session_token=abc", {
        apiUrl: "http://127.0.0.1:43124",
        fetchImpl,
      })
    ).resolves.toBe("forbidden");

    fetchImpl.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ user: { role: "brand" } }),
    });
    await expect(
      authorizeCopilotCookie("better-auth.session_token=abc", {
        apiUrl: "http://127.0.0.1:43124",
        fetchImpl,
      })
    ).resolves.toBe("ok");
  });
});
