export const DEMO_PASSWORD = "password123";

export const demoAccounts = {
  brand: { email: "brand@demo.lynk.test" },
  proBrand: { email: "pro@demo.lynk.test" },
  influencer: { email: "influencer@demo.lynk.test" },
};

export const demoCampaignTitles = {
  summer: "Summer Run Challenge",
  playwright: "Playwright Collab",
};

export function scriptToolMessage(toolName: string, input: unknown): string {
  return `LYNK_TOOL ${toolName} ${JSON.stringify(input ?? {})}`;
}
