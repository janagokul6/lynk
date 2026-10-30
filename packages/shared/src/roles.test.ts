import { describe, expect, it } from "vitest";
import { userRoleSchema, USER_ROLES } from "./roles.js";

describe("userRoleSchema", () => {
  it("accepts marketplace roles", () => {
    for (const role of USER_ROLES) {
      expect(userRoleSchema.parse(role)).toBe(role);
    }
  });

  it("rejects unknown roles", () => {
    expect(() => userRoleSchema.parse("guest")).toThrow();
  });
});
