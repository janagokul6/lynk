import type { Request, Response } from "express";
import { eq, inArray } from "drizzle-orm";
import { fromNodeHeaders } from "better-auth/node";
import { auth } from "../../lib/auth.js";
import { db } from "../../lib/db.js";
import { brandProfile, influencerProfile } from "../../db/schema.js";
import * as service from "./marketplace.service.js";
import { marketplaceQuerySchema } from "./marketplace.validation.js";

export async function list(req: Request, res: Response): Promise<void> {
  const parsed = marketplaceQuerySchema.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: "Validation failed", details: parsed.error.flatten() });
    return;
  }

  const rows = await service.listMarketplaceCampaigns(parsed.data);
  const ownerIds = [...new Set(rows.map((row) => row.userId))];
  const verifiedOwners = new Set<string>();
  if (ownerIds.length > 0) {
    const profiles = await db
      .select({ userId: brandProfile.userId })
      .from(brandProfile)
      .where(inArray(brandProfile.userId, ownerIds));
    for (const profile of profiles) verifiedOwners.add(profile.userId);
  }
  let viewerNiches: string[] = [];
  const session = await auth.api.getSession({ headers: fromNodeHeaders(req.headers) }).catch(() => null);
  const role = (session?.user as { role?: string } | undefined)?.role;
  if (session?.user && role === "influencer") {
    const [profile] = await db
      .select({ niches: influencerProfile.niches })
      .from(influencerProfile)
      .where(eq(influencerProfile.userId, session.user.id))
      .limit(1);
    viewerNiches = profile?.niches ?? [];
  }
  res.json(
    rows.map((row) =>
      service.toMarketplaceCampaignResponse(row, {
        verified: verifiedOwners.has(row.userId),
        viewerNiches,
      })
    )
  );
}
