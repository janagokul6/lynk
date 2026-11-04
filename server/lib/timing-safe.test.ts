import { describe, expect, it } from "vitest";
import { keysMatch } from "./timing-safe.js";

describe("keysMatch", () => {
  it("matches equal secrets and rejects different lengths and values", () => {
    expect(keysMatch("lynk-dev-agent-key-16", "lynk-dev-agent-key-16")).toBe(true);
    expect(keysMatch("lynk-dev-agent-key-16", "lynk-dev-agent-key-17")).toBe(false);
    expect(keysMatch("short", "lynk-dev-agent-key-16")).toBe(false);
  });
});
