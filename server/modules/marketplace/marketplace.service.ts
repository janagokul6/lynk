import { and, eq, gte, lte, desc, asc, sql, inArray, or, ilike, type SQL } from "drizzle-orm";
import { db } from "../../lib/db.js";
import { campaign } from "../../db/schema.js";

export interface MarketplaceFilters {
  search?: string;
  platforms?: string[];
  categories?: string[];
  compensationTypes?: string[];
  payMin?: number;
  payMax?: number;
  locations?: string[];
  workTypes?: string[];
  posted?: "7" | "30" | "Any";
  sort?: string;
  limit?: number;
  offset?: number;
}

export interface MarketplaceCampaignRow {
  id: string;
  brandName: string | null;
  campaignImage: string | null;
  compensationType: string;
  payMin: string;
  payMax: string;
  location: string | null;
  deliverables: string[];
  platforms: string[];
  niches: string[];
  listedAt: Date | null;
  applicationDeadline: string | null;
  title: string;
  description?: string;
}

function normalizeCompensationType(s: string): string {
  const m: Record<string, string> = {
    "Fixed Payment": "Fixed",
    "Product / Barter": "Barter",
    Affiliate: "Affiliate",
    Hybrid: "Hybrid",
  };
  return m[s] ?? s;
}

function deliverableToIcon(name: string): string {
  if (name.includes("Reel") || name.includes("Short")) return "movie";
  if (name.includes("YouTube")) return "play_circle";
  if (name.includes("TikTok")) return "music_note";
  if (name.includes("Story")) return "auto_stories";
  if (name.includes("UGC")) return "movie";
  return "perm_media";
}

function jsonbHasAny(column: SQL, values: string[]): SQL {
  const list = sql.join(
    values.map((value) => sql`${value}`),
    sql`, `
  );
  return sql`${column} ?| ARRAY[${list}]::text[]`;
}

function deliverableToColor(name: string): string {
  if (name.includes("YouTube")) return "text-red-500";
  if (name.includes("TikTok")) return "text-black bg-white rounded-full";
  if (name.includes("Instagram")) return "text-purple-500";
  return "text-primary";
}

export async function listMarketplaceCampaigns(
  filters: MarketplaceFilters
): Promise<MarketplaceCampaignRow[]> {
  const conditions: SQL[] = [eq(campaign.status, "live")];

  if (filters.search?.trim()) {
    const q = `%${filters.search.trim()}%`;
    conditions.push(
      or(
        ilike(campaign.title, q),
        ilike(campaign.brandName, q)
      )!
    );
  }

  if (filters.platforms?.length) {
    conditions.push(jsonbHasAny(sql`${campaign.platforms}`, filters.platforms));
  }

  if (filters.categories?.length) {
    conditions.push(jsonbHasAny(sql`${campaign.niches}`, filters.categories));
  }

  if (filters.compensationTypes?.length) {
    const normalized = filters.compensationTypes.flatMap((c) =>
      c === "Fixed" ? ["Fixed", "Fixed Payment"] : c === "Barter" ? ["Barter", "Product / Barter"] : [c]
    );
    conditions.push(inArray(campaign.compensationType, normalized));
  }

  if (filters.payMin != null) {
    conditions.push(gte(campaign.payMax, String(filters.payMin)));
  }
  if (filters.payMax != null) {
    conditions.push(lte(campaign.payMin, String(filters.payMax)));
  }

  if (filters.locations?.length) {
    conditions.push(inArray(campaign.location, filters.locations));
  }

  if (filters.workTypes?.length) {
    conditions.push(jsonbHasAny(sql`${campaign.deliverables}`, filters.workTypes));
  }

  if (filters.posted && filters.posted !== "Any") {
    const since = new Date();
    since.setDate(since.getDate() - (filters.posted === "7" ? 7 : 30));
    conditions.push(gte(campaign.listedAt, since));
  }

  const orderBy =
    filters.sort === "Pay: High to low"
      ? desc(campaign.payMax)
      : filters.sort === "Newest"
        ? desc(campaign.listedAt)
        : filters.sort === "Deadline: Soonest"
          ? asc(campaign.applicationDeadline)
          : desc(campaign.listedAt);

  const limit = Math.min(filters.limit ?? 50, 100);
  const offset = filters.offset ?? 0;

  const rows = await db
    .select({
      id: campaign.id,
      brandName: campaign.brandName,
      campaignImage: campaign.campaignImage,
      compensationType: campaign.compensationType,
      payMin: campaign.payMin,
      payMax: campaign.payMax,
      location: campaign.location,
      deliverables: campaign.deliverables,
      platforms: campaign.platforms,
      niches: campaign.niches,
      listedAt: campaign.listedAt,
      applicationDeadline: campaign.applicationDeadline,
      title: campaign.title,
      description: campaign.description,
    })
    .from(campaign)
    .where(and(...conditions))
    .orderBy(orderBy)
    .limit(limit)
    .offset(offset);

  return rows as MarketplaceCampaignRow[];
}

export function toMarketplaceCampaignResponse(row: MarketplaceCampaignRow) {
  const compType = normalizeCompensationType(row.compensationType);
  const category = row.niches?.[0] ?? "Other";
  const deliverable = row.deliverables?.[0] ?? "Campaign";
  const payMinNum = Number(row.payMin);
  const payMaxNum = Number(row.payMax);
  return {
    id: row.id,
    brandName: row.brandName ?? "Brand",
    category,
    brandImage: "",
    campaignImage: row.campaignImage ?? "",
    verified: false,
    matchScore: 0,
    compensation: `₹${payMaxNum.toLocaleString()}`,
    compensationExtra: compType !== "Fixed" ? `+ ${compType}` : undefined,
    deliverable,
    deliverableIcon: deliverableToIcon(deliverable),
    deliverableColor: deliverableToColor(deliverable),
    location: row.location ? `🇺🇸 ${row.location}` : "Remote",
    isPrimary: false,
    isTrending: false,
    platform: row.platforms?.[0] ?? "Instagram",
    compensationType: compType,
    payMin: payMinNum,
    payMax: payMaxNum,
    locationCode: (row.location as "Remote" | "US Only" | "UK" | "Europe" | "Global" | "Other") ?? "Remote",
    deliverableType: "Integration/Review",
    workTypes: row.deliverables ?? [],
    postedAt: row.listedAt?.toISOString() ?? new Date().toISOString(),
    deadline: row.applicationDeadline ?? undefined,
  };
}
