import { describe, expect, it } from "vitest";
import { homePathForRole } from "./auth.js";

describe("homePathForRole", () => {
  it("sends each role to its home and everyone else to role selection", () => {
    expect(homePathForRole("brand")).toBe("/brand/dashboard");
    expect(homePathForRole("influencer")).toBe("/influencer/dashboard");
    expect(homePathForRole("admin")).toBe("/admin/dashboard");
    expect(homePathForRole(undefined)).toBe("/role");
    expect(homePathForRole(null)).toBe("/role");
    expect(homePathForRole("")).toBe("/role");
  });
});
