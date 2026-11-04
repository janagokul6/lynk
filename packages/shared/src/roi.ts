import { z } from "zod";

const BAND_LOW = 0.6;
const BAND_HIGH = 1.6;

export const roiRangeSchema = z.object({
  low: z.number(),
  high: z.number(),
});

export const roiCreatorInputSchema = z.object({
  id: z.string(),
  handle: z.string(),
  displayName: z.string(),
  followerCount: z.number().int().nonnegative().nullable(),
  engagementRate: z.number().nonnegative().nullable(),
});
export type RoiCreatorInput = z.infer<typeof roiCreatorInputSchema>;

export const roiCreatorEstimateSchema = roiCreatorInputSchema.extend({
  sufficient: z.boolean(),
  reason: z.string().optional(),
  expectedEngagements: roiRangeSchema.optional(),
  costPerEngagement: roiRangeSchema.optional(),
});

export const roiEstimateSchema = z.object({
  label: z.literal("estimate"),
  sufficient: z.boolean(),
  reason: z.string().optional(),
  assumptions: z.array(z.string()),
  inputs: z.object({
    budget: z.number().nullable(),
    budgetSource: z.enum(["provided", "campaign-pay-midpoint", "missing"]),
    creatorsConsidered: z.number().int().nonnegative(),
    creatorsUsed: z.number().int().nonnegative(),
  }),
  creators: z.array(roiCreatorEstimateSchema),
  combined: z
    .object({
      expectedEngagements: roiRangeSchema,
      costPerEngagement: roiRangeSchema.optional(),
    })
    .optional(),
});
export type RoiEstimate = z.infer<typeof roiEstimateSchema>;

function roundInt(value: number): number {
  return Math.max(0, Math.round(value));
}

function roundMoney(value: number): number {
  return Math.round(value * 100) / 100;
}

/** Rates above 1 are percentages (3.8 means 3.8%). Rates in (0, 1] are fractions. */
export function engagementFraction(rate: number): number | null {
  if (!Number.isFinite(rate) || rate <= 0) return null;
  const fraction = rate > 1 ? rate / 100 : rate;
  if (fraction <= 0 || fraction > 1) return null;
  return fraction;
}

export function estimateRoi(input: {
  creators: RoiCreatorInput[];
  budget: number | null;
  budgetSource: "provided" | "campaign-pay-midpoint" | "missing";
}): RoiEstimate {
  const assumptions = [
    "This is a cost-per-engagement estimate, not revenue or return on spend. Lynk has no click, conversion, or revenue data.",
    "Expected engagements are follower count times the stored engagement rate, with a 0.6×–1.6× band because that rate is a profile aggregate, not a result from this campaign.",
    "Engagement rates greater than 1 are treated as percentages. Rates from 0 to 1 are treated as fractions.",
  ];
  if (input.budgetSource === "campaign-pay-midpoint") {
    assumptions.push("Budget is the midpoint of the campaign's pay range. It is not measured spend.");
  } else if (input.budgetSource === "provided") {
    assumptions.push("Budget is the amount supplied with this request. It is not checked against payouts.");
  } else {
    assumptions.push("No budget was available, so this estimate has no cost range.");
  }

  const creators = input.creators.map((creator) => {
    const fraction =
      creator.engagementRate == null ? null : engagementFraction(creator.engagementRate);
    if (creator.followerCount == null || creator.followerCount <= 0 || fraction == null) {
      return {
        ...creator,
        sufficient: false as const,
        reason: "Needs both a follower count and a usable engagement rate.",
      };
    }
    const point = creator.followerCount * fraction;
    const low = roundInt(point * BAND_LOW);
    const high = roundInt(point * BAND_HIGH);
    const estimate: z.infer<typeof roiCreatorEstimateSchema> = {
      ...creator,
      sufficient: true,
      expectedEngagements: { low, high: Math.max(low, high) },
    };
    if (input.budget != null && input.budget > 0 && low > 0) {
      estimate.costPerEngagement = {
        low: roundMoney(input.budget / Math.max(low, high)),
        high: roundMoney(input.budget / low),
      };
    }
    return estimate;
  });

  const used = creators.filter((creator) => creator.sufficient && creator.expectedEngagements);
  const base = {
    label: "estimate" as const,
    assumptions,
    inputs: {
      budget: input.budget,
      budgetSource: input.budgetSource,
      creatorsConsidered: creators.length,
      creatorsUsed: used.length,
    },
    creators,
  };

  if (used.length === 0) {
    return {
      ...base,
      sufficient: false,
      reason:
        "Not enough creator data. At least one creator needs a follower count and an engagement rate.",
    };
  }

  const expectedEngagements = used.reduce(
    (sum, creator) => ({
      low: sum.low + (creator.expectedEngagements?.low ?? 0),
      high: sum.high + (creator.expectedEngagements?.high ?? 0),
    }),
    { low: 0, high: 0 }
  );

  const combined: NonNullable<RoiEstimate["combined"]> = { expectedEngagements };
  if (input.budget != null && input.budget > 0 && expectedEngagements.low > 0) {
    combined.costPerEngagement = {
      low: roundMoney(input.budget / expectedEngagements.high),
      high: roundMoney(input.budget / expectedEngagements.low),
    };
  }

  return { ...base, sufficient: true, combined };
}
