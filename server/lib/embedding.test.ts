import { describe, expect, it } from "vitest";
import { embedText } from "./embedding.js";

describe("embedText", () => {
  it("returns a unit vector of fixed size", () => {
    const v = embedText("beauty skincare india");
    expect(v).toHaveLength(1536);
    const norm = Math.sqrt(v.reduce((s, x) => s + x * x, 0));
    expect(norm).toBeCloseTo(1, 5);
  });

  it("is deterministic", () => {
    expect(embedText("nova")).toEqual(embedText("nova"));
  });
});
