import { describe, expect, it } from "vitest";
import { campaignCreateSchema } from "./campaign.js";
import {
  MARKETPLACE_CATEGORIES,
  MARKETPLACE_LOCATIONS,
  MARKETPLACE_PLATFORMS,
  MARKETPLACE_WORK_TYPES,
} from "./marketplace.js";

const base = {
  title: "Launch",
  campaignType: "Sponsored Post",
  description: "A campaign",
  compensationType: "Fixed Payment",
  payMin: 500,
  payMax: 1000,
};

describe("marketplace vocabulary", () => {
  it("accepts create-form values the marketplace filters search for", () => {
    const parsed = campaignCreateSchema.parse({
      ...base,
      niches: ["Fitness & Health"],
      platforms: ["Instagram"],
      deliverables: ["Reels / Shorts", "Instagram Stories"],
      location: "Global",
    });
    expect(MARKETPLACE_CATEGORIES).toContain(parsed.niches[0]);
    expect(MARKETPLACE_PLATFORMS).toContain(parsed.platforms[0]);
    expect(MARKETPLACE_WORK_TYPES).toContain(parsed.deliverables[0]);
    expect(MARKETPLACE_LOCATIONS).toContain(parsed.location);
  });

  it("rejects niche, location, and deliverable values the filters cannot match", () => {
    expect(() =>
      campaignCreateSchema.parse({
        ...base,
        niches: ["Fitness"],
        platforms: ["Instagram"],
        deliverables: ["1 Instagram Reel (15-60 seconds)"],
        location: "Global (Anywhere)",
      })
    ).toThrow();
  });
});
