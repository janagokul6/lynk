import { describe, expect, it } from "vitest";
import { normalizePlan, sideBySideForPlan } from "./plan.js";

describe("plan", () => {
  it("defaults unknown values to free and gates side-by-side on pro", () => {
    expect(normalizePlan(undefined)).toBe("free");
    expect(normalizePlan("enterprise")).toBe("free");
    expect(normalizePlan("pro")).toBe("pro");
    expect(sideBySideForPlan("free")).toBe(false);
    expect(sideBySideForPlan("pro")).toBe(true);
  });
});
