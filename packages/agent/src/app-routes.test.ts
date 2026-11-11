import { describe, expect, it } from "vitest";
import { isAppRoute } from "./app-routes.js";

describe("isAppRoute", () => {
  it("allows only the Lynk chat and status routes", () => {
    expect(isAppRoute("/copilotkit")).toBe(true);
    expect(isAppRoute("/copilotkit/info")).toBe(true);
    expect(isAppRoute("/status")).toBe(true);
    expect(isAppRoute("/api/agents")).toBe(false);
    expect(isAppRoute("/api/agents/brandAgent/generate")).toBe(false);
    expect(isAppRoute("/api/memory/threads")).toBe(false);
    expect(isAppRoute("/copilotkitx")).toBe(false);
    expect(isAppRoute("/")).toBe(false);
  });
});
