import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("../creators/creators.service.js", () => ({
  matchCreators: vi.fn(async () => [
    {
      id: "11111111-1111-4111-8111-111111111111",
      platform: "instagram",
      handle: "novacreates",
      displayName: "Nova Creates",
      imageUrl: null,
      followerCount: 88000,
      engagementRate: "4.20",
      niches: ["lifestyle"],
      country: "IN",
    },
  ]),
  enqueueCreatorSync: vi.fn(async () => "job_1"),
}));

describe("tools.registry", () => {
  beforeEach(() => {
    vi.resetModules();
  });

  it("exposes Zod-described tool descriptors", async () => {
    const { toolDescriptors } = await import("./tools.registry.js");
    expect(toolDescriptors.length).toBeGreaterThanOrEqual(3);
    const health = toolDescriptors.find((t) => t.name === "health.check");
    expect(health?.inputSchema).toMatchObject({ type: "object" });
    expect(health?.outputSchema).toMatchObject({ type: "object" });
  });

  it("invokes health.check", async () => {
    const { invokeTool } = await import("./tools.registry.js");
    await expect(invokeTool("health.check", {}, {})).resolves.toEqual({ ok: true });
  });

  it("rejects invalid health.check payloads", async () => {
    const { invokeTool } = await import("./tools.registry.js");
    await expect(invokeTool("health.check", { extra: true }, {})).rejects.toThrow();
  });

  it("maps creators.match rows into shared result cards", async () => {
    const { invokeTool } = await import("./tools.registry.js");
    const result = await invokeTool("creators.match", { q: "beauty", limit: 5 }, {});
    expect(result).toMatchObject({
      count: 1,
      creators: [{ handle: "novacreates", platform: "instagram" }],
    });
  });
});
