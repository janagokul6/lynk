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

  it("posts to /api/tools/:name with agent key", async () => {
    const { invokeLynkTool } = await import("./lynk-client.js");
    const result = await invokeLynkTool<{ ok: boolean }>("health.check", {});
    expect(result).toEqual({ ok: true });
    expect(fetch).toHaveBeenCalledWith(
      "http://127.0.0.1:43124/api/tools/health.check",
      expect.objectContaining({
        method: "POST",
        headers: expect.objectContaining({
          "x-agent-key": "lynk-dev-agent-key-16",
        }),
      })
    );
  });
});
