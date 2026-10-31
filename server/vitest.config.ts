import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    include: ["**/*.test.ts"],
    fileParallelism: false,
    env: {
      NODE_ENV: "test",
      DATABASE_URL: "postgresql://lynk:lynk@127.0.0.1:5432/lynk_test",
      BETTER_AUTH_SECRET: "test-secret-key-minimum-32-characters-long",
      BETTER_AUTH_URL: "http://localhost:43124",
      CLIENT_ORIGIN: "http://localhost:43123",
      RATE_LIMIT_MAX: "100000",
      RATE_LIMIT_AUTH_MAX: "100000",
      TOKEN_ENCRYPTION_KEY: "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
      ALLOW_CLIENT_SOCIAL_TOKENS: "true",
    },
  },
});
