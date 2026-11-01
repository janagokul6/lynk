import { z } from "zod";

export const MARKETPLACE_PLATFORMS = ["Instagram", "TikTok", "YouTube", "X"] as const;
export type MarketplacePlatform = (typeof MARKETPLACE_PLATFORMS)[number];
export const marketplacePlatformSchema = z.enum(MARKETPLACE_PLATFORMS);

export const MARKETPLACE_CATEGORIES = [
  "Beauty & Wellness",
  "Fashion",
  "Fitness & Health",
  "Food & Beverage",
  "Tech & Electronics",
  "Gaming",
  "Travel",
  "Lifestyle",
  "UGC",
  "Other",
] as const;
export type MarketplaceCategory = (typeof MARKETPLACE_CATEGORIES)[number];
export const marketplaceCategorySchema = z.enum(MARKETPLACE_CATEGORIES);

export const MARKETPLACE_COMPENSATION_TYPES = ["Fixed", "Barter", "Affiliate", "Hybrid"] as const;
export type MarketplaceCompensationType = (typeof MARKETPLACE_COMPENSATION_TYPES)[number];

export const MARKETPLACE_LOCATIONS = ["Remote", "US Only", "UK", "Europe", "Global", "Other"] as const;
export type MarketplaceLocation = (typeof MARKETPLACE_LOCATIONS)[number];
export const marketplaceLocationSchema = z.enum(MARKETPLACE_LOCATIONS);

export const MARKETPLACE_DELIVERABLE_TYPES = [
  "Posts",
  "Stories",
  "Reels",
  "Long-form video",
  "UGC",
  "Integration/Review",
] as const;
export type MarketplaceDeliverableType = (typeof MARKETPLACE_DELIVERABLE_TYPES)[number];

export const MARKETPLACE_WORK_TYPES = [
  "Instagram Post",
  "Reels / Shorts",
  "Instagram Stories",
  "Product Feature Video",
  "In-Video Ad",
  "Dedicated Video",
  "Multi-Platform Integration",
  "UGC",
  "Brand Ambassador",
  "Representative / Spokesperson",
  "Unboxing / Review",
  "Affiliate / Link in Bio",
] as const;
export type MarketplaceWorkType = (typeof MARKETPLACE_WORK_TYPES)[number];
export const marketplaceWorkTypeSchema = z.enum(MARKETPLACE_WORK_TYPES);

export const MARKETPLACE_SORT_OPTIONS = [
  "Recommended",
  "Match: High to low",
  "Pay: High to low",
  "Newest",
  "Deadline: Soonest",
] as const;
export type MarketplaceSortOption = (typeof MARKETPLACE_SORT_OPTIONS)[number];
