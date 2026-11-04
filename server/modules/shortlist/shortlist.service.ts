import { and, desc, eq } from "drizzle-orm";
import type { ShortlistList } from "@lynk/shared";
import { db } from "../../lib/db.js";
import { creatorProfile, shortlistGroup, shortlistItem } from "../../db/schema.js";
import { ToolError } from "../tools/tools.errors.js";

function isUniqueViolation(err: unknown): boolean {
  const candidates = [err, err instanceof Error ? (err as { cause?: unknown }).cause : undefined];
  return candidates.some(
    (candidate) =>
      typeof candidate === "object" &&
      candidate !== null &&
      "code" in candidate &&
      (candidate as { code?: string }).code === "23505"
  );
}

function toCreator(row: typeof creatorProfile.$inferSelect) {
  return {
    id: row.id,
    platform: row.platform,
    handle: row.handle,
    displayName: row.displayName,
    followerCount: row.followerCount,
    engagementRate: row.engagementRate == null ? null : Number(row.engagementRate),
    niches: row.niches ?? [],
    country: row.country,
  };
}

export async function listShortlist(userId: string): Promise<ShortlistList> {
  const groups = await db
    .select()
    .from(shortlistGroup)
    .where(eq(shortlistGroup.userId, userId))
    .orderBy(desc(shortlistGroup.createdAt));
  const items = await db
    .select({ item: shortlistItem, creator: creatorProfile })
    .from(shortlistItem)
    .innerJoin(creatorProfile, eq(shortlistItem.creatorId, creatorProfile.id))
    .where(eq(shortlistItem.userId, userId))
    .orderBy(desc(shortlistItem.createdAt));
  return {
    groups: groups.map((group) => ({
      id: group.id,
      name: group.name,
      createdAt: group.createdAt.toISOString(),
    })),
    items: items.map(({ item, creator }) => ({
      id: item.id,
      creatorId: item.creatorId,
      groupId: item.groupId,
      createdAt: item.createdAt.toISOString(),
      creator: toCreator(creator),
    })),
  };
}

async function requireCreator(creatorId: string) {
  const [row] = await db
    .select({ id: creatorProfile.id })
    .from(creatorProfile)
    .where(eq(creatorProfile.id, creatorId))
    .limit(1);
  if (!row) throw new ToolError("Creator not found", 404);
}

async function requireOwnGroup(userId: string, groupId: string) {
  const [row] = await db
    .select({ id: shortlistGroup.id })
    .from(shortlistGroup)
    .where(and(eq(shortlistGroup.id, groupId), eq(shortlistGroup.userId, userId)))
    .limit(1);
  if (!row) throw new ToolError("Group not found", 404);
}

export async function createGroup(userId: string, name: string): Promise<ShortlistList> {
  const trimmed = name.trim();
  const [existing] = await db
    .select({ id: shortlistGroup.id })
    .from(shortlistGroup)
    .where(and(eq(shortlistGroup.userId, userId), eq(shortlistGroup.name, trimmed)))
    .limit(1);
  if (!existing) {
    try {
      await db.insert(shortlistGroup).values({ userId, name: trimmed });
    } catch (err) {
      if (!isUniqueViolation(err)) throw err;
    }
  }
  return listShortlist(userId);
}

export async function deleteGroup(userId: string, groupId: string): Promise<void> {
  const [deleted] = await db
    .delete(shortlistGroup)
    .where(and(eq(shortlistGroup.id, groupId), eq(shortlistGroup.userId, userId)))
    .returning({ id: shortlistGroup.id });
  if (!deleted) throw new ToolError("Group not found", 404);
}

async function resolveGroupId(
  userId: string,
  input: { groupId?: string; groupName?: string }
): Promise<string | null> {
  if (input.groupId && input.groupName) {
    throw new ToolError("Pass a group id or a group name, not both", 400);
  }
  if (input.groupId) {
    await requireOwnGroup(userId, input.groupId);
    return input.groupId;
  }
  if (input.groupName) {
    const name = input.groupName.trim();
    const [existing] = await db
      .select({ id: shortlistGroup.id })
      .from(shortlistGroup)
      .where(and(eq(shortlistGroup.userId, userId), eq(shortlistGroup.name, name)))
      .limit(1);
    if (existing) return existing.id;
    try {
      const [created] = await db
        .insert(shortlistGroup)
        .values({ userId, name })
        .returning({ id: shortlistGroup.id });
      if (created) return created.id;
    } catch (err) {
      if (!isUniqueViolation(err)) throw err;
      const [again] = await db
        .select({ id: shortlistGroup.id })
        .from(shortlistGroup)
        .where(and(eq(shortlistGroup.userId, userId), eq(shortlistGroup.name, name)))
        .limit(1);
      if (again) return again.id;
    }
  }
  return null;
}

export async function addToShortlist(
  userId: string,
  input: { creatorId: string; groupId?: string; groupName?: string }
): Promise<ShortlistList> {
  await requireCreator(input.creatorId);
  const groupId = await resolveGroupId(userId, input);
  const [existing] = await db
    .select({ id: shortlistItem.id })
    .from(shortlistItem)
    .where(and(eq(shortlistItem.userId, userId), eq(shortlistItem.creatorId, input.creatorId)))
    .limit(1);
  if (existing) {
    await db
      .update(shortlistItem)
      .set({ groupId })
      .where(eq(shortlistItem.id, existing.id));
  } else {
    await db.insert(shortlistItem).values({
      userId,
      creatorId: input.creatorId,
      groupId,
    });
  }
  return listShortlist(userId);
}

export async function removeFromShortlist(userId: string, creatorId: string): Promise<ShortlistList> {
  await db
    .delete(shortlistItem)
    .where(and(eq(shortlistItem.userId, userId), eq(shortlistItem.creatorId, creatorId)));
  return listShortlist(userId);
}

export async function deleteShortlistItem(userId: string, itemId: string): Promise<void> {
  const [deleted] = await db
    .delete(shortlistItem)
    .where(and(eq(shortlistItem.id, itemId), eq(shortlistItem.userId, userId)))
    .returning({ id: shortlistItem.id });
  if (!deleted) throw new ToolError("Shortlist item not found", 404);
}
