import { defineConfig, devices } from "@playwright/test";

const sharedEnv = {
  ...process.env,
  AGENT_TURN_LIMIT: "100000",
  AGENT_TURN_WINDOW_MS: "600000",
  RATE_LIMIT_MAX: "100000",
  RATE_LIMIT_AUTH_MAX: "100000",
  RATE_LIMIT_MAIL_MAX: "100000",
  LYNK_SCRIPT_MODEL: "1",
  OPENAI_API_KEY: "",
  BETTER_AUTH_URL: "http://127.0.0.1:43124",
  CLIENT_ORIGIN: "http://127.0.0.1:43123",
  NEXT_PUBLIC_API_URL: "http://127.0.0.1:43124",
  NEXT_PUBLIC_COPILOTKIT_RUNTIME_URL: "http://127.0.0.1:43126/copilotkit",
};

export default defineConfig({
  testDir: "./e2e",
  globalSetup: "./e2e/global-setup.mjs",
  fullyParallel: false,
  workers: 1,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL ?? "http://127.0.0.1:43123",
    trace: "on-first-retry",
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: [
    {
      command: "cd .. && pnpm --filter @lynk/server dev",
      url: "http://127.0.0.1:43124/api/health",
      reuseExistingServer: !process.env.CI,
      timeout: 120_000,
      env: sharedEnv,
    },
    {
      command: "cd .. && pnpm --filter @lynk/agent dev",
      url: "http://127.0.0.1:43126/status",
      reuseExistingServer: !process.env.CI,
      timeout: 120_000,
      env: sharedEnv,
    },
    {
      command: "cd .. && pnpm --filter @lynk/client dev",
      url: "http://127.0.0.1:43123",
      reuseExistingServer: !process.env.CI,
      timeout: 120_000,
      env: sharedEnv,
    },
  ],
});
