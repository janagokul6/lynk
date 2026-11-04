import { describe, expect, it } from "vitest";
import {
  EXAMPLE_AGENT_API_KEY,
  productionAgentKeyIssue,
} from "./agent-key.js";
import { agentKeyToolAllowlist } from "./tools.js";

describe("productionAgentKeyIssue", () => {
  it("rejects the example key and short keys, and allows a long unique key", () => {
    expect(productionAgentKeyIssue(undefined)).toBeNull();
    expect(productionAgentKeyIssue(EXAMPLE_AGENT_API_KEY)).toMatch(/example/);
    expect(productionAgentKeyIssue("1234567890123456")).toMatch(/32/);
    expect(productionAgentKeyIssue("k".repeat(32))).toBeNull();
  });
});

describe("agentKeyToolAllowlist", () => {
  it("does not include creator sync", () => {
    expect(agentKeyToolAllowlist).not.toContain("creators.enqueue_sync");
    expect(agentKeyToolAllowlist).toContain("creators.match");
  });
});
