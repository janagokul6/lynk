import type { Request, Response } from "express";
import { z } from "zod";
import { env } from "../../config/env.js";
import { logger } from "../../utils/logger.js";

const suggestionsQuerySchema = z.object({
  q: z
    .string()
    .trim()
    .min(1)
    .max(100),
});

type SuggestionPlatform = "youtube" | "instagram";

export type DiscoverySuggestion = {
  id: string;
  name: string;
  handle: string;
  imageUrl: string;
  platform: SuggestionPlatform;
};

type SuggestionsResponse = { suggestions: DiscoverySuggestion[] };

type YouTubeSearchResponse = {
  items?: Array<{
    id?: { channelId?: string };
    snippet?: {
      title?: string;
      channelTitle?: string;
      thumbnails?: {
        default?: { url?: string };
        medium?: { url?: string };
        high?: { url?: string };
      };
    };
  }>;
};

type MetaCreatorMarketplaceResponse = {
  data?: Array<{
    id?: string;
    username?: string;
    biography?: string;
    is_account_verified?: boolean;
    country?: string;
  }>;
  error?: {
    message?: string;
    type?: string;
    code?: number;
    error_subcode?: number;
    fbtrace_id?: string;
  };
};

type YouTubeChannelsResponse = {
  items?: Array<{
    id?: string;
    snippet?: {
      title?: string;
      thumbnails?: {
        default?: { url?: string };
        medium?: { url?: string };
        high?: { url?: string };
      };
    };
    statistics?: {
      subscriberCount?: string;
    };
  }>;
};

type InfluencerPlatform = "YouTube" | "Instagram";

export type DiscoveryInfluencer = {
  id: string;
  name: string;
  handle: string;
  category: string;
  imageUrl: string;
  followers: string;
  followersCount: number;
  engagement: string;
  engagementRate: number;
  verified: boolean;
  platform: InfluencerPlatform;
  region: string;
  gender: string;
  priceRange: string;
  priceValue: number;
};

type SearchResponse = { influencers: DiscoveryInfluencer[] };

function formatFollowers(count: number): string {
  if (!Number.isFinite(count) || count < 0) return "—";
  if (count >= 1_000_000_000) return `${(count / 1_000_000_000).toFixed(1)}B`;
  if (count >= 1_000_000) return `${(count / 1_000_000).toFixed(1)}M`;
  if (count >= 1_000) return `${Math.round(count / 1_000)}k`;
  return `${count}`;
}

async function fetchYouTubeSuggestions(query: string): Promise<DiscoverySuggestion[]> {
  if (!env.YOUTUBE_API_KEY) return [];

  const url = new URL("https://www.googleapis.com/youtube/v3/search");
  url.searchParams.set("part", "snippet");
  url.searchParams.set("type", "channel");
  url.searchParams.set("maxResults", "8");
  url.searchParams.set("q", query);
  url.searchParams.set("key", env.YOUTUBE_API_KEY);

  const resp = await fetch(url.toString());
  if (!resp.ok) {
    logger.warn("YouTube suggestions request failed", {
      status: resp.status,
      statusText: resp.statusText,
    });
    return [];
  }

  const data = (await resp.json()) as YouTubeSearchResponse;
  const items = data.items ?? [];

  return items
    .map((item) => {
      const id = item.id?.channelId;
      const title = item.snippet?.title ?? item.snippet?.channelTitle ?? "";
      const imageUrl =
        item.snippet?.thumbnails?.high?.url ??
        item.snippet?.thumbnails?.medium?.url ??
        item.snippet?.thumbnails?.default?.url ??
        "";

      if (!id || !title) return null;

      const sug: DiscoverySuggestion = {
        id,
        name: title,
        handle: title,
        imageUrl,
        platform: "youtube",
      };
      return sug;
    })
    .filter((x): x is DiscoverySuggestion => x != null);
}

async function fetchInstagramSuggestions(_query: string): Promise<DiscoverySuggestion[]> {
  if (!env.META_IG_USER_ID || !env.META_PAGE_ACCESS_TOKEN) return [];

  const url = new URL(`https://graph.facebook.com/${env.META_GRAPH_API_VERSION}/${env.META_IG_USER_ID}/creator_marketplace_creators`);
  url.searchParams.set("query", _query);
  url.searchParams.set("fields", "id,username,biography,is_account_verified,country");
  url.searchParams.set("access_token", env.META_PAGE_ACCESS_TOKEN);

  const resp = await fetch(url.toString());
  const data = (await resp.json()) as MetaCreatorMarketplaceResponse;

  if (!resp.ok) {
    logger.warn("Instagram creator marketplace discovery failed", {
      status: resp.status,
      code: data.error?.code,
      subcode: data.error?.error_subcode,
      type: data.error?.type,
      message: data.error?.message,
    });
    return [];
  }

  const creators = data.data ?? [];
  return creators
    .map((c) => {
      const id = c.id ?? "";
      const username = c.username ?? "";
      if (!id || !username) return null;

      const sug: DiscoverySuggestion = {
        id,
        name: username,
        handle: `@${username}`,
        imageUrl: "",
        platform: "instagram",
      };
      return sug;
    })
    .filter((x): x is DiscoverySuggestion => x != null);
}

async function fetchYouTubeInfluencers(query: string): Promise<DiscoveryInfluencer[]> {
  if (!env.YOUTUBE_API_KEY) return [];

  const searchUrl = new URL("https://www.googleapis.com/youtube/v3/search");
  searchUrl.searchParams.set("part", "snippet");
  searchUrl.searchParams.set("type", "channel");
  searchUrl.searchParams.set("maxResults", "12");
  searchUrl.searchParams.set("q", query);
  searchUrl.searchParams.set("key", env.YOUTUBE_API_KEY);

  const searchResp = await fetch(searchUrl.toString());
  if (!searchResp.ok) {
    logger.warn("YouTube influencer search failed", {
      status: searchResp.status,
      statusText: searchResp.statusText,
    });
    return [];
  }

  const searchData = (await searchResp.json()) as YouTubeSearchResponse;
  const channelIds = (searchData.items ?? [])
    .map((i) => i.id?.channelId)
    .filter((x): x is string => typeof x === "string" && x.length > 0);

  if (channelIds.length === 0) return [];

  const channelsUrl = new URL("https://www.googleapis.com/youtube/v3/channels");
  channelsUrl.searchParams.set("part", "snippet,statistics");
  channelsUrl.searchParams.set("id", channelIds.join(","));
  channelsUrl.searchParams.set("key", env.YOUTUBE_API_KEY);

  const channelsResp = await fetch(channelsUrl.toString());
  if (!channelsResp.ok) {
    logger.warn("YouTube channels lookup failed", {
      status: channelsResp.status,
      statusText: channelsResp.statusText,
    });
    return [];
  }

  const channelsData = (await channelsResp.json()) as YouTubeChannelsResponse;
  const items = channelsData.items ?? [];

  return items
    .map((ch) => {
      const id = ch.id ?? "";
      const title = ch.snippet?.title ?? "";
      const imageUrl =
        ch.snippet?.thumbnails?.high?.url ??
        ch.snippet?.thumbnails?.medium?.url ??
        ch.snippet?.thumbnails?.default?.url ??
        "";
      const subs = Number.parseInt(ch.statistics?.subscriberCount ?? "0", 10);
      const followersCount = Number.isFinite(subs) ? subs : 0;

      if (!id || !title) return null;

      const influencer: DiscoveryInfluencer = {
        id,
        name: title,
        handle: `@${id}`,
        category: "YouTube",
        imageUrl,
        followers: formatFollowers(followersCount),
        followersCount,
        engagement: "—",
        engagementRate: 0,
        verified: false,
        platform: "YouTube",
        region: "—",
        gender: "—",
        priceRange: "—",
        priceValue: 0,
      };
      return influencer;
    })
    .filter((x): x is DiscoveryInfluencer => x != null);
}

export async function getSuggestions(req: Request, res: Response): Promise<void> {
  const parsed = suggestionsQuerySchema.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({
      error: "Validation failed",
      details: parsed.error.flatten().fieldErrors,
    });
    return;
  }

  const { q } = parsed.data;

  try {
    const [instagram, youtube] = await Promise.all([
      fetchInstagramSuggestions(q),
      fetchYouTubeSuggestions(q),
    ]);

    const payload: SuggestionsResponse = { suggestions: [...instagram, ...youtube] };
    res.json(payload);
  } catch (err) {
    logger.error("Failed to fetch discovery suggestions", { error: err });
    res.json({ suggestions: [] } satisfies SuggestionsResponse);
  }
}

export async function searchInfluencers(req: Request, res: Response): Promise<void> {
  const parsed = suggestionsQuerySchema.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({
      error: "Validation failed",
      details: parsed.error.flatten().fieldErrors,
    });
    return;
  }

  const { q } = parsed.data;

  try {
    const influencers = await fetchYouTubeInfluencers(q);
    res.json({ influencers } satisfies SearchResponse);
  } catch (err) {
    logger.error("Failed to search discovery influencers", { error: err });
    res.json({ influencers: [] } satisfies SearchResponse);
  }
}

