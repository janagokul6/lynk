import type { Request, Response } from "express";
import { z } from "zod";
import { searchMetaCreators } from "../../lib/providers/meta.js";
import { searchYoutubeChannels } from "../../lib/providers/youtube.js";
import { logger } from "../../utils/logger.js";
import { matchCreators, searchAndHydrate, toDiscoveryInfluencer } from "../creators/creators.service.js";

const querySchema = z.object({
  q: z.string().trim().min(1).max(100),
});

export async function getSuggestions(req: Request, res: Response): Promise<void> {
  const parsed = querySchema.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: "Validation failed", details: parsed.error.flatten() });
    return;
  }

  try {
    const cached = await matchCreators({ q: parsed.data.q, limit: 8 });
    if (cached.length > 0) {
      res.json({
        suggestions: cached.map((c) => ({
          id: c.externalId,
          name: c.displayName,
          handle: c.handle,
          imageUrl: c.imageUrl ?? "",
          platform: c.platform,
        })),
      });
      return;
    }

    const [yt, ig] = await Promise.all([
      searchYoutubeChannels(parsed.data.q, 8),
      searchMetaCreators(parsed.data.q),
    ]);

    res.json({
      suggestions: [
        ...ig.map((c) => ({
          id: c.externalId,
          name: c.displayName,
          handle: c.handle,
          imageUrl: c.imageUrl ?? "",
          platform: "instagram" as const,
        })),
        ...yt.map((c) => ({
          id: c.externalId,
          name: c.displayName,
          handle: c.handle,
          imageUrl: c.imageUrl ?? "",
          platform: "youtube" as const,
        })),
      ],
    });
  } catch (err) {
    logger.error("discovery suggestions failed", { error: err });
    res.json({ suggestions: [] });
  }
}

export async function searchInfluencers(req: Request, res: Response): Promise<void> {
  const parsed = querySchema.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: "Validation failed", details: parsed.error.flatten() });
    return;
  }

  try {
    const rows = await searchAndHydrate(parsed.data.q);
    res.json({ influencers: rows.map(toDiscoveryInfluencer) });
  } catch (err) {
    logger.error("discovery search failed", { error: err });
    res.json({ influencers: [] });
  }
}
