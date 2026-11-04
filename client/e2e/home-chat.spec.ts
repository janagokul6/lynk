import path from "node:path";
import { expect, test, type Page } from "@playwright/test";
import { DEMO_PASSWORD, demoAccounts, demoCampaignTitles, scriptToolMessage } from "./demo";

const shots = path.resolve("/opt/cursor/artifacts/screenshots");

async function login(page: Page, email: string) {
  await page.goto("/login", { waitUntil: "networkidle" });
  const emailBox = page.getByLabel("Email");
  const passwordBox = page.getByLabel("Password");
  await emailBox.fill(email);
  await passwordBox.fill(DEMO_PASSWORD);
  await expect(emailBox).toHaveValue(email);
  await page.getByRole("button", { name: "Sign in" }).click();
  await page.waitForURL(/\/(brand|influencer)\/home/, { timeout: 20_000 });
}

async function send(page: Page, placeholder: RegExp, message: string) {
  const box = page.getByPlaceholder(placeholder);
  await box.fill(message);
  await box.press("Enter");
}

test.describe.configure({ mode: "serial", timeout: 90_000 });

test("brand chat home, toggle, confirmation, and real dashboard", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await login(page, demoAccounts.brand.email);
  await expect(page.getByText(/applicant waiting/)).toBeVisible();
  await expect(page.getByText(/\d+ shortlisted/)).toBeVisible();
  await page.screenshot({ path: path.join(shots, "brand-chat.png"), fullPage: true });

  await page.getByTestId("home-view-toggle").click();
  await expect(page.getByRole("heading", { name: "Campaigns" })).toBeVisible();
  await expect(page.getByText(demoCampaignTitles.summer).first()).toBeVisible();
  await expect(page.getByText("Nova Creates").first()).toBeVisible();
  await expect(page.getByText(/does not have campaign performance data/)).toBeVisible();
  await page.screenshot({ path: path.join(shots, "brand-dashboard.png"), fullPage: true });

  await page.reload();
  await expect(page.getByRole("heading", { name: "Campaigns" })).toBeVisible();
  await page.getByTestId("home-view-toggle").click();
  await expect(page.getByPlaceholder(/Find creators/)).toBeVisible();

  await send(
    page,
    /Find creators/,
    scriptToolMessage("campaigns_preview", {
      title: "Playwright Draft",
      campaignType: "Sponsored Post",
      description: "Shown only after confirm",
      compensationType: "Fixed",
      payMin: "15",
      payMax: "25",
    })
  );
  await expect(page.getByText("Campaign draft")).toBeVisible({ timeout: 20_000 });
  await page.screenshot({ path: path.join(shots, "confirmation-card.png"), fullPage: true });
  await expect(page.getByText("Playwright Draft").first()).toBeVisible();
  await page.getByRole("button", { name: "Save draft" }).click();
  await expect(page.getByText(/Saved/)).toBeVisible();
  await page.getByTestId("home-view-toggle").click();
  await expect(page.getByRole("heading", { name: "Campaigns" })).toBeVisible();
  await expect(page.locator("li").filter({ hasText: "Playwright Draft" })).toBeVisible();
  await page.getByTestId("home-view-toggle").click();

  await send(page, /Find creators/, "LYNK_MODEL_ERROR");
  await expect(page.getByTestId("chat-error")).toBeVisible({ timeout: 20_000 });
  await page.screenshot({ path: path.join(shots, "chat-error.png"), fullPage: true });
});

test("pro side-by-side collapses on a narrow screen", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await login(page, demoAccounts.proBrand.email);
  await expect(page.getByText(/chat and dashboard together/i)).toBeVisible();
  await expect(page.getByPlaceholder(/Find creators/)).toBeVisible();
  await expect(page.getByRole("heading", { name: "Campaigns" })).toBeVisible();
  await page.screenshot({ path: path.join(shots, "pro-side-by-side.png"), fullPage: true });

  await page.setViewportSize({ width: 390, height: 844 });
  await expect(page.getByRole("heading", { name: "Campaigns" })).toBeHidden();
  await page.getByTestId("home-view-toggle").click();
  await expect(page.getByRole("heading", { name: "Campaigns" })).toBeVisible();
  await expect(page.getByPlaceholder(/Find creators/)).toBeHidden();
  await page.screenshot({ path: path.join(shots, "pro-mobile.png"), fullPage: true });
});

test("influencer chat, apply confirmation, and empty earnings", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await login(page, demoAccounts.influencer.email);
  await expect(page.getByText(/\d+ pending ·/)).toBeVisible();
  await page.getByTestId("home-view-toggle").click();
  await expect(page.getByRole("heading", { name: "Live campaigns" })).toBeVisible();
  await expect(page.getByText(demoCampaignTitles.playwright).first()).toBeVisible();
  await expect(page.getByText(/Messaging is not available yet/)).toBeVisible();
  await page.screenshot({ path: path.join(shots, "influencer-dashboard.png"), fullPage: true });
  await page.getByTestId("home-view-toggle").click();

  await send(
    page,
    /Search live/,
    scriptToolMessage("marketplace_search", { q: demoCampaignTitles.playwright, limit: 5 })
  );
  await expect(page.getByRole("button", { name: "Apply" })).toBeVisible({ timeout: 20_000 });
  await page.getByRole("button", { name: "Apply" }).click();
  await page.getByRole("button", { name: "Send application" }).click();
  await expect(page.getByText(/Saved/)).toBeVisible();
  await page.screenshot({ path: path.join(shots, "influencer-applied.png"), fullPage: true });
});

test("chat explains a missing API key", async ({ page }) => {
  await page.route("**/status", (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ llm: false, mode: "unavailable" }),
    })
  );
  await login(page, demoAccounts.brand.email);
  await expect(page.getByText(/OPENAI_API_KEY/)).toBeVisible();
  await page.getByTestId("home-view-toggle").click();
  await expect(page.getByRole("heading", { name: "Campaigns" })).toBeVisible();
  await page.screenshot({ path: path.join(shots, "no-api-key.png"), fullPage: true });
});
