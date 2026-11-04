import { expect, test, type Page } from "@playwright/test";

const API = "http://127.0.0.1:43124";

async function latestMail(request: { get: (url: string) => Promise<{ json: () => Promise<{ messages: { text: string; subject: string }[] }> }> }, email: string) {
  const response = await request.get(`${API}/api/dev/mailbox?email=${encodeURIComponent(email)}`);
  const body = await response.json();
  return body.messages.at(-1);
}

async function signUp(page: Page, input: { name: string; email: string; password: string; role: "brand" | "influencer" }) {
  await page.goto("/signup");
  await page.getByLabel("Name").fill(input.name);
  await page.getByLabel("Email").fill(input.email);
  await page.getByLabel("Password").fill(input.password);
  await page.locator("select").selectOption(input.role);
  await page.getByRole("button", { name: "Sign up" }).click();
  await page.waitForURL(/\/(brand|influencer)\/home/);
}

test("signup, verify, reset, profile, collab, message, and notification", async ({ page, request }) => {
  test.setTimeout(120_000);
  const stamp = Date.now();
  const brandEmail = `brand-${stamp}@example.com`;
  const creatorEmail = `creator-${stamp}@example.com`;
  await page.addInitScript(() => window.localStorage.setItem("lynk-cookie", "1"));

  await signUp(page, { name: "Flow Brand", email: brandEmail, password: "password123", role: "brand" });
  const verify = await latestMail(request, brandEmail);
  expect(verify?.subject ?? "").toMatch(/verify/i);
  const verifyUrl = verify?.text.match(/https?:\/\/\S+/)?.[0];
  expect(verifyUrl).toBeTruthy();
  await page.goto(verifyUrl!);
  await page.goto("/brand/onboarding");
  await page.getByLabel("Company name").fill("Flow Studio");
  await page.getByRole("button", { name: "Save and continue" }).click();
  await page.waitForURL(/\/brand\/home/);

  const created = await page.request.post(`${API}/api/campaigns`, {
    data: {
      status: "live",
      title: `Flow ${stamp}`,
      campaignType: "Sponsored Post",
      description: "Show the bottle and disclose the partnership.",
      niches: ["Beauty & Wellness"],
      platforms: ["Instagram"],
      deliverables: ["Reels / Shorts"],
      compensationType: "Fixed",
      payMin: "1500",
      payMax: "2200",
      disclosureChecks: ["paid-partnership", "asci-upfront"],
    },
  });
  expect(created.ok()).toBeTruthy();
  const campaign = await created.json();

  await page.getByRole("button", { name: "Log out" }).first().click();
  await page.waitForURL(/\/login/);
  await page.goto("/forgot-password");
  await page.getByLabel("Email").fill(brandEmail);
  await page.getByRole("button", { name: "Send reset link" }).click();
  await expect(page.getByText("If that email has an account, check it for a reset link.")).toBeVisible();
  const reset = await latestMail(request, brandEmail);
  const resetUrl = reset?.text.match(/https?:\/\/\S+/)?.[0];
  expect(resetUrl).toBeTruthy();
  await page.goto(resetUrl!);
  await page.waitForURL(/\/reset-password/);
  await page.getByLabel("New password").fill("password456");
  await page.getByRole("button", { name: "Update password" }).click();
  await expect(page.getByText(/Password updated/i)).toBeVisible();

  await page.goto("/login");
  await page.getByLabel("Email").fill(brandEmail);
  await page.getByLabel("Password").fill("password456");
  await page.getByRole("button", { name: "Sign in" }).click();
  await page.waitForURL(/\/brand\/home/);

  const creator = await page.context().browser()!.newContext();
  await creator.addInitScript(() => window.localStorage.setItem("lynk-cookie", "1"));
  const creatorPage = await creator.newPage();
  await signUp(creatorPage, { name: "Flow Creator", email: creatorEmail, password: "password123", role: "influencer" });
  await creatorPage.goto("/influencer/profile");
  await creatorPage.getByLabel("Bio").fill("I film skincare routines.");
  await creatorPage.getByLabel("Niches").fill("beauty");
  await creatorPage.getByLabel("Location").fill("IN");
  await creatorPage.getByRole("button", { name: "Save profile" }).click();
  await expect(creatorPage.getByText("Profile saved.")).toBeVisible();
  await expect(creatorPage.getByText("YouTube connect is not configured.")).toBeVisible();

  await creatorPage.goto("/marketplace");
  await creatorPage.getByPlaceholder("Search campaigns...").fill(`Flow ${stamp}`);
  const apply = creatorPage.getByRole("button", { name: "Apply Now" }).first();
  await expect(apply).toBeEnabled();
  await apply.click();
  await creatorPage.getByPlaceholder("Why you're a fit for this campaign").fill("I can film this week");
  await creatorPage.getByRole("button", { name: "Send application" }).click();
  await expect(creatorPage.getByText("Applied").first()).toBeVisible();

  await page.goto("/notifications");
  await expect(page.getByText(`New application for Flow ${stamp}`)).toBeVisible();
  await page.getByRole("button", { name: "Mark read" }).first().click();

  await page.goto("/brand/applications");
  const card = page.locator("article").filter({ hasText: `Flow ${stamp}` });
  await card.getByRole("button", { name: "Accept" }).click();
  await expect(card.getByText("accepted", { exact: false })).toBeVisible();
  await card.getByRole("link", { name: "Open collaboration" }).click();
  await page.waitForURL(/\/collab\//);

  await creatorPage.goto(page.url());
  await creatorPage.getByPlaceholder("Link to the draft").fill("https://example.com/draft");
  await creatorPage.getByRole("button", { name: "Send link" }).click();
  await expect(creatorPage.getByText("submitted", { exact: false })).toBeVisible();

  await page.reload();
  await page.getByRole("button", { name: "Request revision" }).click();
  await page.getByPlaceholder("What should change?").fill("Show the label");
  await page.getByRole("button", { name: "Request revision" }).click();
  await expect(page.getByText("revision", { exact: false })).toBeVisible();

  await creatorPage.reload();
  await creatorPage.getByPlaceholder("Link to the draft").fill("https://example.com/draft-2");
  await creatorPage.getByRole("button", { name: "Send link" }).click();
  await page.reload();
  await page.getByRole("button", { name: "Approve content" }).click();
  await expect(page.getByText("approved", { exact: false })).toBeVisible();

  await creatorPage.reload();
  await creatorPage.getByPlaceholder("Live post URL").fill("https://example.com/live-post");
  await creatorPage.getByRole("button", { name: "Mark complete" }).click();
  await expect(creatorPage.getByRole("button", { name: "Submit rating" })).toBeVisible();
  await creatorPage.getByRole("button", { name: "Submit rating" }).click();

  await page.reload();
  await page.getByRole("button", { name: "Submit rating" }).click();
  await expect(page.getByText("You already left a rating.")).toBeVisible();

  await page.goto("/messages");
  await page.getByRole("link", { name: `Flow ${stamp}` }).click();
  await page.getByPlaceholder("Write a message").fill("Thanks for the post");
  await page.getByRole("button", { name: "Send" }).click();
  await expect(page.getByText("Thanks for the post")).toBeVisible();

  await creatorPage.goto("/messages");
  await creatorPage.getByRole("link", { name: `Flow ${stamp}` }).click();
  await expect(creatorPage.getByText("Thanks for the post")).toBeVisible({ timeout: 10000 });

  expect(campaign.id).toBeTruthy();
  await creator.close();
});
