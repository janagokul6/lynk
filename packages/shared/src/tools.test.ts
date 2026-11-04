import { describe, expect, it } from "vitest";
import { buildToolDescriptors, toolInputSchemas, toolNames } from "./tools.js";

describe("tools contracts", () => {
  it("lists every registered tool with JSON schemas", () => {
    const descriptors = buildToolDescriptors();
    expect(descriptors.map((d) => d.name)).toEqual([...toolNames]);
    for (const d of descriptors) {
      expect(d.description.length).toBeGreaterThan(0);
      expect(d.inputSchema).toMatchObject({ type: "object" });
      const output = d.outputSchema as { type?: string; anyOf?: unknown[] };
      expect(output.type === "object" || Array.isArray(output.anyOf)).toBe(true);
    }
  });

  it("parses health.check empty input", () => {
    expect(toolInputSchemas["health.check"].parse({})).toEqual({});
  });
});
