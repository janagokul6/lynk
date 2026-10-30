import { describe, expect, it } from "vitest";
import { USER_ROLES } from "@lynk/shared";

describe("role policy contract", () => {
  it("exposes the three marketplace roles", () => {
    expect(USER_ROLES).toEqual(["brand", "influencer", "admin"]);
  });
});
