import { describe, expect, it } from "vitest";
import { creatorMatchQuerySchema } from "./match.js";

describe("creatorMatchQuerySchema", () => {
  it("applies default limit", () => {
    expect(creatorMatchQuerySchema.parse({ q: "beauty" }).limit).toBe(20);
  });
});
