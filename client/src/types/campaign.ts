import {
  MARKETPLACE_PLATFORMS,
  MARKETPLACE_CATEGORIES,
  MARKETPLACE_COMPENSATION_TYPES,
  MARKETPLACE_LOCATIONS,
  MARKETPLACE_DELIVERABLE_TYPES,
  MARKETPLACE_WORK_TYPES,
  MARKETPLACE_SORT_OPTIONS,
  type CampaignStatus,
  type MarketplacePlatform,
  type MarketplaceCompensationType,
  type MarketplaceLocation,
  type MarketplaceDeliverableType,
  type MarketplaceWorkType,
  type MarketplaceSortOption,
} from "@lynk/shared";

export type { CampaignStatus };

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
  disclosureChecks?: string[];
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
  disclosureChecks?: string[];
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

export {
  MARKETPLACE_PLATFORMS as PLATFORMS,
  MARKETPLACE_CATEGORIES as CATEGORIES,
  MARKETPLACE_COMPENSATION_TYPES as COMPENSATION_TYPES,
  MARKETPLACE_LOCATIONS as LOCATIONS,
  MARKETPLACE_DELIVERABLE_TYPES as DELIVERABLE_TYPES,
  MARKETPLACE_WORK_TYPES as WORK_TYPES,
  MARKETPLACE_SORT_OPTIONS as SORT_OPTIONS,
};

export type Platform = MarketplacePlatform;
export type CompensationType = MarketplaceCompensationType;
export type Location = MarketplaceLocation;
export type DeliverableType = MarketplaceDeliverableType;
export type WorkType = MarketplaceWorkType;
export type SortOption = MarketplaceSortOption;

export interface MarketplaceCampaign {
  id: string;
  brandName: string;
  category: string;
  brandImage: string;
  campaignImage: string;
  verified: boolean;
  matchScore: number | null;
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
