import { test, expect } from "@playwright/test";

test("agent chat shell renders", async ({ page }) => {
  await page.goto("/agent");
  await expect(page.getByText("Lynk").first()).toBeVisible();
  await expect(page.getByText("Brand agent").first()).toBeVisible();
  await expect(
    page.getByText(/Tell me who you want to find/i)
  ).toBeVisible({ timeout: 15_000 });
});
