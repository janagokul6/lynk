import { describe, expect, it } from "vitest";
import { EXAMPLE_AGENT_API_KEY } from "@lynk/shared";
import { evaluateEnv } from "./env.js";

const base = {
  NODE_ENV: "production",
  DATABASE_URL: "postgresql://lynk:lynk@127.0.0.1:5432/lynk",
  BETTER_AUTH_SECRET: "production-secret-key-minimum-32-characters",
  TOKEN_ENCRYPTION_KEY: "a".repeat(64),
};

describe("production agent key", () => {
  it("refuses the example key and a short key, and accepts a long unique key", () => {
    const example = evaluateEnv({ ...base, AGENT_API_KEY: EXAMPLE_AGENT_API_KEY });
    expect(example.success).toBe(false);
    const short = evaluateEnv({ ...base, AGENT_API_KEY: "1234567890123456" });
    expect(short.success).toBe(false);
    const ok = evaluateEnv({ ...base, AGENT_API_KEY: "p".repeat(32) });
    expect(ok.success).toBe(true);

    const dev = evaluateEnv({
      ...base,
      NODE_ENV: "development",
      AGENT_API_KEY: EXAMPLE_AGENT_API_KEY,
    });
    expect(dev.success).toBe(true);
  });
});
