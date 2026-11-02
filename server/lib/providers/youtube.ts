import { env } from "../../config/env.js";
import { logger } from "../../utils/logger.js";

export type YoutubeChannel = {
  externalId: string;
  handle: string;
  displayName: string;
  imageUrl: string | null;
  followerCount: number | null;
};

type SearchResponse = {
  items?: Array<{
    id?: { channelId?: string };
    snippet?: {
      title?: string;
      channelTitle?: string;
      thumbnails?: { high?: { url?: string }; medium?: { url?: string }; default?: { url?: string } };
    };
  }>;
};

type ChannelsResponse = {
  items?: Array<{
    id?: string;
    snippet?: {
      title?: string;
      customUrl?: string;
      thumbnails?: { high?: { url?: string }; medium?: { url?: string }; default?: { url?: string } };
    };
    statistics?: { subscriberCount?: string };
  }>;
};

function thumb(
  t?: { high?: { url?: string }; medium?: { url?: string }; default?: { url?: string } }
): string | null {
  return t?.high?.url ?? t?.medium?.url ?? t?.default?.url ?? null;
}

export async function searchYoutubeChannels(query: string, max = 12): Promise<YoutubeChannel[]> {
  if (!env.YOUTUBE_API_KEY) return [];

  const searchUrl = new URL("https://www.googleapis.com/youtube/v3/search");
  searchUrl.searchParams.set("part", "snippet");
  searchUrl.searchParams.set("type", "channel");
  searchUrl.searchParams.set("maxResults", String(max));
  searchUrl.searchParams.set("q", query);
  searchUrl.searchParams.set("key", env.YOUTUBE_API_KEY);

  const searchResp = await fetch(searchUrl);
  if (!searchResp.ok) {
    logger.warn("YouTube search failed", { status: searchResp.status });
    return [];
  }

  const searchData = (await searchResp.json()) as SearchResponse;
  const ids = (searchData.items ?? [])
    .map((i) => i.id?.channelId)
    .filter((id): id is string => Boolean(id));
  if (ids.length === 0) return [];

  const channelsUrl = new URL("https://www.googleapis.com/youtube/v3/channels");
  channelsUrl.searchParams.set("part", "snippet,statistics");
  channelsUrl.searchParams.set("id", ids.join(","));
  channelsUrl.searchParams.set("key", env.YOUTUBE_API_KEY);

  const channelsResp = await fetch(channelsUrl);
  if (!channelsResp.ok) {
    logger.warn("YouTube channels failed", { status: channelsResp.status });
    return [];
  }

  const channelsData = (await channelsResp.json()) as ChannelsResponse;
  return (channelsData.items ?? [])
    .map((ch) => {
      const externalId = ch.id ?? "";
      const displayName = ch.snippet?.title ?? "";
      if (!externalId || !displayName) return null;
      const handle = ch.snippet?.customUrl?.replace(/^@/, "") || externalId;
      const subs = Number.parseInt(ch.statistics?.subscriberCount ?? "", 10);
      return {
        externalId,
        handle,
        displayName,
        imageUrl: thumb(ch.snippet?.thumbnails),
        followerCount: Number.isFinite(subs) ? subs : null,
      } satisfies YoutubeChannel;
    })
    .filter((x): x is YoutubeChannel => x != null);
}

export async function fetchYoutubeChannel(externalId: string): Promise<YoutubeChannel | null> {
  const rows = await searchYoutubeChannels(externalId, 1);
  const exact = rows.find((r) => r.externalId === externalId);
  if (exact) return exact;
  if (!env.YOUTUBE_API_KEY) return null;

  const channelsUrl = new URL("https://www.googleapis.com/youtube/v3/channels");
  channelsUrl.searchParams.set("part", "snippet,statistics");
  channelsUrl.searchParams.set("id", externalId);
  channelsUrl.searchParams.set("key", env.YOUTUBE_API_KEY);
  const resp = await fetch(channelsUrl);
  if (!resp.ok) return null;
  const data = (await resp.json()) as ChannelsResponse;
  const ch = data.items?.[0];
  if (!ch?.id || !ch.snippet?.title) return null;
  const subs = Number.parseInt(ch.statistics?.subscriberCount ?? "", 10);
  return {
    externalId: ch.id,
    handle: ch.snippet.customUrl?.replace(/^@/, "") || ch.id,
    displayName: ch.snippet.title,
    imageUrl: thumb(ch.snippet.thumbnails),
    followerCount: Number.isFinite(subs) ? subs : null,
  };
}
