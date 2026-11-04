import { env } from "../../config/env.js";
import { logger } from "../../utils/logger.js";

export type MetaCreator = {
  externalId: string;
  handle: string;
  displayName: string;
  imageUrl: string | null;
  country: string | null;
};

type MetaResponse = {
  data?: Array<{
    id?: string;
    username?: string;
    country?: string;
  }>;
  error?: { message?: string; code?: number };
};

function metaConfigured(): boolean {
  return Boolean(env.META_IG_USER_ID && env.META_PAGE_ACCESS_TOKEN);
}

export async function searchMetaCreators(query: string): Promise<MetaCreator[]> {
  if (!metaConfigured()) return [];

  const url = new URL(
    `https://graph.facebook.com/${env.META_GRAPH_API_VERSION}/${env.META_IG_USER_ID}/creator_marketplace_creators`
  );
  url.searchParams.set("query", query);
  url.searchParams.set("fields", "id,username,country");

  const resp = await fetch(url, {
    headers: {
      Authorization: `Bearer ${env.META_PAGE_ACCESS_TOKEN}`,
    },
  });
  const data = (await resp.json()) as MetaResponse;
  if (!resp.ok) {
    logger.warn("Meta creator search failed", {
      status: resp.status,
      message: data.error?.message,
      code: data.error?.code,
    });
    return [];
  }

  const out: MetaCreator[] = [];
  for (const c of data.data ?? []) {
    const externalId = c.id ?? "";
    const handle = c.username ?? "";
    if (!externalId || !handle) continue;
    out.push({
      externalId,
      handle,
      displayName: handle,
      imageUrl: null,
      country: c.country ?? null,
    });
  }
  return out;
}
