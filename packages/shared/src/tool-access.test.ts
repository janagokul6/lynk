import { describe, expect, it } from "vitest";
import { toolCallerAllowed, toolsForCaller } from "./tool-access.js";

describe("tool access", () => {
  it("keeps the agent key off user-scoped tools", () => {
    expect(toolCallerAllowed("creators.match", { kind: "key" })).toBe(true);
    expect(toolCallerAllowed("shortlist.add", { kind: "key" })).toBe(false);
    expect(toolCallerAllowed("applications.apply", { kind: "key" })).toBe(false);
    expect(toolCallerAllowed("applications.decide", { kind: "key" })).toBe(false);
  });

  it("splits brand and influencer tools", () => {
    expect(toolCallerAllowed("shortlist.add", { kind: "session", role: "influencer" })).toBe(false);
    expect(toolCallerAllowed("applications.apply", { kind: "session", role: "brand" })).toBe(false);
    expect(toolCallerAllowed("roi.estimate", { kind: "session", role: "brand" })).toBe(true);
    expect(toolCallerAllowed("insights.public", { kind: "session", role: "influencer" })).toBe(true);
    expect(toolsForCaller({ kind: "session", role: "brand" })).toContain("campaigns.create");
    expect(toolsForCaller({ kind: "session", role: "brand" })).not.toContain("applications.mine");
  });
});
