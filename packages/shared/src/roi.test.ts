import { describe, expect, it } from "vitest";
import { estimateRoi } from "./roi.js";

const nova = {
  id: "11111111-1111-4111-8111-111111111111",
  handle: "novacreates",
  displayName: "Nova",
  followerCount: 10_000,
  engagementRate: 4,
};

describe("estimateRoi", () => {
  it("returns a labeled range from stored followers and engagement", () => {
    const estimate = estimateRoi({
      creators: [nova],
      budget: 1000,
      budgetSource: "provided",
    });
    expect(estimate.label).toBe("estimate");
    expect(estimate.sufficient).toBe(true);
    expect(estimate.combined?.expectedEngagements).toEqual({ low: 240, high: 640 });
    expect(estimate.assumptions[0]).toMatch(/not revenue/i);
    expect(estimate.creators[0]?.costPerEngagement?.low).toBeLessThan(
      estimate.creators[0]?.costPerEngagement?.high ?? 0
    );
  });

  it("says when follower or engagement data is missing", () => {
    const estimate = estimateRoi({
      creators: [{ ...nova, followerCount: null, engagementRate: null }],
      budget: null,
      budgetSource: "missing",
    });
    expect(estimate.sufficient).toBe(false);
    expect(estimate.reason).toMatch(/Not enough creator data/);
    expect(estimate.combined).toBeUndefined();
  });
});
