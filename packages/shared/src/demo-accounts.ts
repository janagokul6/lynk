export const DEMO_PASSWORD = "password123";

export const demoAccounts = {
  brand: { email: "brand@demo.lynk.test", name: "Northwind Studio", role: "brand" as const },
  otherBrand: { email: "other-brand@demo.lynk.test", name: "Other Brand Co", role: "brand" as const },
  proBrand: { email: "pro@demo.lynk.test", name: "Pro Atelier", role: "brand" as const },
  influencer: { email: "influencer@demo.lynk.test", name: "Mina Patel", role: "influencer" as const },
  otherInfluencer: { email: "other-influencer@demo.lynk.test", name: "Jon Ellis", role: "influencer" as const },
};

export const demoCampaignTitles = {
  summer: "Summer Run Challenge",
  glow: "Glow Barter",
  open: "Open Collab",
  rejected: "Rejected Gig",
  withdrawn: "Withdrawn Gig",
  draft: "Hidden Draft Launch",
  other: "Other Brand Drop",
  playwright: "Playwright Collab",
} as const;
