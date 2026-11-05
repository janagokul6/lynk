import { and, desc, eq, gte, ilike, or, sql } from "drizzle-orm";
import {
  jobNames,
  type CreatorMatchQuery,
  type CreatorPlatform,
  type CreatorSyncPayload,
} from "@lynk/shared";
import { env } from "../../config/env.js";
import { db } from "../../lib/db.js";
import { creatorProfile } from "../../db/schema.js";
import { resolveEmbedding, vectorLiteral } from "../../lib/embedding.js";
import { domainEvents } from "../../lib/events.js";
import { ensureQueue, sendJob } from "../../lib/queue.js";
import { fetchYoutubeChannel, searchYoutubeChannels } from "../../lib/providers/youtube.js";
import { searchMetaCreators } from "../../lib/providers/meta.js";

export type CreatorRow = typeof creatorProfile.$inferSelect;

export async function upsertCreator(input: {
  platform: CreatorPlatform;
  externalId: string;
  handle: string;
  displayName: string;
  imageUrl?: string | null;
  followerCount?: number | null;
  engagementRate?: string | null;
  niches?: string[];
  country?: string | null;
  raw?: Record<string, unknown>;
  userId?: string | null;
}): Promise<CreatorRow> {
  const nicheText = (input.niches ?? []).join(" ");
  const embedding = await resolveEmbedding(
    `${input.displayName} ${input.handle} ${input.platform} ${nicheText} ${input.country ?? ""}`
  );

  const values = {
    platform: input.platform,
    externalId: input.externalId,
    handle: input.handle,
    displayName: input.displayName,
    imageUrl: input.imageUrl ?? null,
    followerCount: input.followerCount ?? null,
    engagementRate: input.engagementRate ?? null,
    niches: input.niches ?? [],
    country: input.country ?? null,
    raw: input.raw ?? {},
    embedding,
    syncedAt: new Date(),
    updatedAt: new Date(),
    ...(input.userId ? { userId: input.userId } : {}),
  };

  const [row] = await db
    .insert(creatorProfile)
    .values(values)
    .onConflictDoUpdate({
      target: [creatorProfile.platform, creatorProfile.externalId],
      set: values,
    })
    .returning();

  domainEvents.emitEvent({
    type: "creator.synced",
    creatorId: row.id,
    platform: row.platform,
  });
  return row;
}

export async function syncCreator(payload: CreatorSyncPayload): Promise<CreatorRow | null> {
  if (payload.platform === "profile") return null;
  if (payload.platform === "youtube") {
    const channel = await fetchYoutubeChannel(payload.externalId);
    if (!channel) {
      if (payload.handle) {
        return upsertCreator({
          platform: "youtube",
          externalId: payload.externalId,
          handle: payload.handle,
          displayName: payload.handle,
          userId: payload.userId,
        });
      }
      return null;
    }
    return upsertCreator({
      platform: "youtube",
      externalId: channel.externalId,
      handle: channel.handle,
      displayName: channel.displayName,
      imageUrl: channel.imageUrl,
      followerCount: channel.followerCount,
      niches: ["youtube"],
      raw: channel as unknown as Record<string, unknown>,
      userId: payload.userId,
    });
  }

  return upsertCreator({
    platform: "instagram",
    externalId: payload.externalId,
    handle: payload.handle ?? payload.externalId,
    displayName: payload.handle ?? payload.externalId,
    niches: ["instagram"],
    userId: payload.userId,
  });
}

export async function enqueueCreatorSync(payload: CreatorSyncPayload): Promise<string | null> {
  await ensureQueue(jobNames.creatorSync);
  return sendJob(jobNames.creatorSync, payload);
}

export async function matchCreators(query: CreatorMatchQuery): Promise<CreatorRow[]> {
  const limit = query.limit ?? 20;
  const filters = [];
  if (query.platform) filters.push(eq(creatorProfile.platform, query.platform));
  if (query.minFollowers != null) {
    filters.push(gte(creatorProfile.followerCount, query.minFollowers));
  }

  const textForEmbed = [query.q, ...(query.niches ?? [])].filter(Boolean).join(" ");
  const whereSql = filters.length ? and(...filters) : undefined;

  if (textForEmbed) {
    const vector = vectorLiteral(await resolveEmbedding(textForEmbed));
    const distance = sql`${creatorProfile.embedding} <=> ${vector}::vector`;
    const semantic = await db
      .select()
      .from(creatorProfile)
      .where(and(whereSql, sql`${distance} <= ${env.MATCH_MAX_DISTANCE}`))
      .orderBy(distance)
      .limit(limit);

    if (semantic.length > 0) return semantic;

    if (query.q) {
      const like = `%${query.q}%`;
      return db
        .select()
        .from(creatorProfile)
        .where(
          and(
            whereSql,
            or(ilike(creatorProfile.handle, like), ilike(creatorProfile.displayName, like))
          )
        )
        .orderBy(desc(creatorProfile.followerCount))
        .limit(limit);
    }
  }

  return db
    .select()
    .from(creatorProfile)
    .where(whereSql)
    .orderBy(desc(creatorProfile.followerCount))
    .limit(limit);
}

export async function searchAndHydrate(query: string): Promise<CreatorRow[]> {
  const existing = await matchCreators({ q: query, limit: 20 });
  if (existing.length > 0) return existing;

  const [yt, meta] = await Promise.all([
    searchYoutubeChannels(query, 8),
    searchMetaCreators(query),
  ]);

  const upserted: CreatorRow[] = [];
  for (const ch of yt) {
    upserted.push(
      await upsertCreator({
        platform: "youtube",
        externalId: ch.externalId,
        handle: ch.handle,
        displayName: ch.displayName,
        imageUrl: ch.imageUrl,
        followerCount: ch.followerCount,
        niches: ["youtube"],
        raw: ch as unknown as Record<string, unknown>,
      })
    );
  }
  for (const c of meta) {
    upserted.push(
      await upsertCreator({
        platform: "instagram",
        externalId: c.externalId,
        handle: c.handle,
        displayName: c.displayName,
        imageUrl: c.imageUrl,
        country: c.country,
        niches: ["instagram"],
        raw: c as unknown as Record<string, unknown>,
      })
    );
  }
  return upserted;
}

export function toDiscoveryInfluencer(row: CreatorRow) {
  const followersCount = row.followerCount ?? 0;
  const engagementRate = row.engagementRate ? Number(row.engagementRate) : 0;
  return {
    id: row.id,
    name: row.displayName,
    handle: row.handle.startsWith("@") ? row.handle : `@${row.handle}`,
    category: row.niches?.[0] ?? row.platform,
    imageUrl: row.imageUrl ?? "",
    followers: formatFollowers(followersCount),
    followersCount,
    engagement: engagementRate ? `${engagementRate.toFixed(1)}%` : "—",
    engagementRate,
    verified: Boolean(row.userId),
    platform: row.platform === "youtube" ? "YouTube" : row.platform === "instagram" ? "Instagram" : "Lynk",
    region: row.country ?? "—",
    gender: null,
    priceRange: null,
    priceValue: null,
  };
}

function formatFollowers(count: number): string {
  if (!Number.isFinite(count) || count < 0) return "—";
  if (count >= 1_000_000) return `${(count / 1_000_000).toFixed(1)}M`;
  if (count >= 1_000) return `${Math.round(count / 1_000)}k`;
  return `${count}`;
}
