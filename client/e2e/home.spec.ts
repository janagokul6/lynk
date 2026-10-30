import { test, expect } from "@playwright/test";

test("home shows Lynk brand", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByText("Lynk").first()).toBeVisible();
});
