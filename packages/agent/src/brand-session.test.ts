import { describe, expect, it, vi } from "vitest";
import {
  agentAllowedForRole,
  agentIdFromCopilotBody,
  authorizeCopilotCookie,
  readCopilotIdentity,
  roleFromMePayload,
} from "./brand-session.js";

describe("authorizeCopilotCookie", () => {
  it("allows brand and influencer sessions and rejects everyone else", async () => {
    expect(roleFromMePayload(null)).toBeNull();
    expect(roleFromMePayload({ user: { id: "u1", role: "brand" } })).toBe("brand");
    expect(agentIdFromCopilotBody({ body: { agent: "influencerAgent" } })).toBe("influencerAgent");
    expect(agentAllowedForRole("brand", "influencerAgent")).toBe(false);
    expect(agentAllowedForRole("influencer", "influencerAgent")).toBe(true);
    expect(agentAllowedForRole("brand", null)).toBe(true);

    const fetchImpl = vi.fn(async () => ({
      ok: true,
      json: async () => ({ user: { id: "inf-1", role: "influencer" } }),
    }));
    await expect(
      authorizeCopilotCookie(undefined, { apiUrl: "http://127.0.0.1:43124", fetchImpl })
    ).resolves.toBe("unauthorized");
    await expect(
      authorizeCopilotCookie("better-auth.session_token=abc", {
        apiUrl: "http://127.0.0.1:43124",
        fetchImpl,
      })
    ).resolves.toBe("ok");

    fetchImpl.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ user: { id: "admin-1", role: "admin" } }),
    });
    await expect(
      readCopilotIdentity("better-auth.session_token=abc", {
        apiUrl: "http://127.0.0.1:43124",
        fetchImpl,
      })
    ).resolves.toBe("forbidden");
  });
});
