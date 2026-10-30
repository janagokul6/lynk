export type CampaignStatus = "draft" | "live" | "completed";

export interface Campaign {
  id: string;
  userId: string;
  status: CampaignStatus;
  listedAt: string | null;
  title: string;
  campaignType: string;
  description: string;
  guidelines: string | null;
  niches: string[];
  platforms: string[];
  deliverables: string[];
  perks: string[];
  followerRange: string | null;
  minEngagement: string | null;
  location: string | null;
  minAge: number | null;
  maxAge: number | null;
  compensationType: string;
  payMin: string;
  payMax: string;
  totalBudget: string | null;
  creatorsNeeded: number | null;
  applicationDeadline: string | null;
  startDate: string | null;
  endDate: string | null;
  brandName: string | null;
  brandImage: string | null;
  campaignImage: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCampaignPayload {
  status?: CampaignStatus;
  title: string;
  campaignType: string;
  description: string;
  guidelines?: string;
  niches: string[];
  platforms: string[];
  deliverables: string[];
  perks: string[];
  followerRange?: string;
  minEngagement?: string;
  location?: string;
  minAge?: number;
  maxAge?: number;
  compensationType: string;
  payMin: string;
  payMax: string;
  totalBudget?: string;
  creatorsNeeded?: number;
  applicationDeadline?: string;
  startDate?: string;
  endDate?: string;
  brandName?: string;
  brandImage?: string;
  campaignImage?: string;
}

export interface CampaignSummary {
  id: string;
  name: string;
  title: string;
  status: CampaignStatus;
  campaignType: string;
  payMin: string;
  payMax: string;
  startDate: string | null;
  endDate: string | null;
  listedAt: string | null;
  createdAt: string;
}

export const PLATFORMS = ["Instagram", "TikTok", "YouTube", "X"] as const;
export const CATEGORIES = [
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
export const COMPENSATION_TYPES = ["Fixed", "Barter", "Affiliate", "Hybrid"] as const;
export const LOCATIONS = ["Remote", "US Only", "UK", "Europe", "Global", "Other"] as const;
export const DELIVERABLE_TYPES = ["Posts", "Stories", "Reels", "Long-form video", "UGC", "Integration/Review"] as const;
export const WORK_TYPES = [
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
export const SORT_OPTIONS = [
  "Recommended",
  "Match: High to low",
  "Pay: High to low",
  "Newest",
  "Deadline: Soonest",
] as const;

export type Platform = (typeof PLATFORMS)[number];
export type Category = (typeof CATEGORIES)[number];
export type CompensationType = (typeof COMPENSATION_TYPES)[number];
export type Location = (typeof LOCATIONS)[number];
export type DeliverableType = (typeof DELIVERABLE_TYPES)[number];
export type WorkType = (typeof WORK_TYPES)[number];
export type SortOption = (typeof SORT_OPTIONS)[number];

export interface MarketplaceCampaign {
  id: string;
  brandName: string;
  category: string;
  brandImage: string;
  campaignImage: string;
  verified: boolean;
  matchScore: number;
  compensation: string;
  compensationExtra?: string;
  deliverable: string;
  deliverableIcon: string;
  deliverableColor: string;
  location: string;
  isPrimary: boolean;
  isTrending?: boolean;
  platform: Platform | Platform[];
  compensationType: CompensationType;
  payMin: number;
  payMax: number;
  locationCode: Location;
  deliverableType: DeliverableType;
  workTypes: WorkType[];
  postedAt: string;
  deadline?: string;
}

export interface MarketplaceFilters {
  search?: string;
  platforms?: string[];
  categories?: string[];
  compensationTypes?: string[];
  payMin?: number;
  payMax?: number;
  locations?: string[];
  deliverableTypes?: string[];
  workTypes?: string[];
  posted?: "7" | "30" | "Any";
  verifiedOnly?: boolean;
  minMatchScore?: number;
  sort?: SortOption;
  limit?: number;
  offset?: number;
}
