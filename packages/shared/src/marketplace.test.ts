import { describe, expect, it } from "vitest";
import {
  MARKETPLACE_CATEGORIES,
  MARKETPLACE_LOCATIONS,
  MARKETPLACE_PLATFORMS,
  MARKETPLACE_WORK_TYPES,
  marketplaceCategorySchema,
  marketplaceLocationSchema,
  marketplacePlatformSchema,
  marketplaceWorkTypeSchema,
} from "./marketplace.js";

describe("marketplace vocabulary", () => {
  it("accepts values the marketplace filters search for", () => {
    const niche = marketplaceCategorySchema.parse("Fitness & Health");
    const platform = marketplacePlatformSchema.parse("Instagram");
    const deliverable = marketplaceWorkTypeSchema.parse("Reels / Shorts");
    const location = marketplaceLocationSchema.parse("Global");
    expect(MARKETPLACE_CATEGORIES).toContain(niche);
    expect(MARKETPLACE_PLATFORMS).toContain(platform);
    expect(MARKETPLACE_WORK_TYPES).toContain(deliverable);
    expect(MARKETPLACE_LOCATIONS).toContain(location);
    expect(marketplaceWorkTypeSchema.parse("Instagram Stories")).toBe("Instagram Stories");
  });

  it("rejects niche, location, and deliverable values the filters cannot match", () => {
    expect(() => marketplaceCategorySchema.parse("Fitness")).toThrow();
    expect(() => marketplaceWorkTypeSchema.parse("1 Instagram Reel (15-60 seconds)")).toThrow();
    expect(() => marketplaceLocationSchema.parse("Global (Anywhere)")).toThrow();
  });
});
