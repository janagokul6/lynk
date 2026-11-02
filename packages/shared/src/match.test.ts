import { describe, expect, it } from "vitest";
import { creatorMatchQuerySchema, creatorMatchResultSchema } from "./match.js";

describe("creatorMatchQuerySchema", () => {
  it("applies default limit", () => {
    expect(creatorMatchQuerySchema.parse({ q: "beauty" }).limit).toBe(20);
  });
});

describe("creatorMatchResultSchema", () => {
  it("accepts creator cards", () => {
    const parsed = creatorMatchResultSchema.parse({
      count: 1,
      creators: [
        {
          id: "11111111-1111-4111-8111-111111111111",
          platform: "instagram",
          handle: "novacreates",
          displayName: "Nova Creates",
          followerCount: 88000,
          niches: ["lifestyle"],
          country: "IN",
        },
      ],
    });
    expect(parsed.creators[0]?.handle).toBe("novacreates");
  });
});
