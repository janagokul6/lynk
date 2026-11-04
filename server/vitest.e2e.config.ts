import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    include: ["e2e/**/*.test.ts"],
    fileParallelism: false,
    testTimeout: 60_000,
    hookTimeout: 60_000,
    env: {
      NODE_ENV: "test",
      DATABASE_URL: "postgresql://lynk:lynk@127.0.0.1:5432/lynk",
      BETTER_AUTH_SECRET: "lynk-test-better-auth-secret-32chars",
      BETTER_AUTH_URL: "http://127.0.0.1:43124",
      CLIENT_ORIGIN: "http://127.0.0.1:43123",
      AGENT_API_KEY: "lynk-dev-agent-key-16",
      LYNK_API_URL: "http://127.0.0.1:43124",
      LYNK_SCRIPT_MODEL: "1",
      AGENT_TURN_LIMIT: "100000",
      RATE_LIMIT_MAX: "100000",
      RATE_LIMIT_AUTH_MAX: "100000",
    },
  },
});
