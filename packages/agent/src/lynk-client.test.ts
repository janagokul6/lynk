import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";

vi.mock("./env.js", () => ({
  agentEnv: {
    LYNK_API_URL: "http://127.0.0.1:43124",
    AGENT_API_KEY: "lynk-dev-agent-key-16",
  },
}));

describe("invokeLynkTool", () => {
  beforeEach(() => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => ({
        ok: true,
        json: async () => ({ result: { ok: true } }),
      }))
    );
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.resetModules();
  });

  it("posts with x-agent-key only when no session cookie is present", async () => {
    const { invokeLynkTool } = await import("./lynk-client.js");
    const result = await invokeLynkTool<{ ok: boolean }>("health.check", {});
    expect(result).toEqual({ ok: true });
    expect(fetch).toHaveBeenCalledWith(
      "http://127.0.0.1:43124/api/tools/health.check",
      expect.objectContaining({
        method: "POST",
        headers: {
          "content-type": "application/json",
          "x-agent-key": "lynk-dev-agent-key-16",
        },
      })
    );
  });

  it("forwards the session cookie and does not send the shared agent key", async () => {
    const { invokeLynkTool } = await import("./lynk-client.js");
    await invokeLynkTool("shortlist.list", {}, { cookie: "better-auth.session_token=abc" });
    expect(fetch).toHaveBeenCalledWith(
      "http://127.0.0.1:43124/api/tools/shortlist.list",
      expect.objectContaining({
        headers: {
          "content-type": "application/json",
          cookie: "better-auth.session_token=abc",
        },
      })
    );
    const init = vi.mocked(fetch).mock.calls.at(-1)?.[1] as { headers?: Record<string, string> };
    expect(init.headers?.["x-agent-key"]).toBeUndefined();
  });
});
