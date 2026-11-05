import { and, desc, eq, isNull, sql } from "drizzle-orm";
import { db } from "../../lib/db.js";
import { notification } from "../../db/schema.js";

export async function listNotifications(userId: string) {
  const rows = await db
    .select()
    .from(notification)
    .where(eq(notification.userId, userId))
    .orderBy(desc(notification.createdAt))
    .limit(50);
  const [unread] = await db
    .select({ value: sql<number>`count(*)::int` })
    .from(notification)
    .where(and(eq(notification.userId, userId), isNull(notification.readAt)));
  return {
    unread: Number(unread?.value ?? 0),
    notifications: rows.map((row) => ({
      id: row.id,
      type: row.type,
      title: row.title,
      body: row.body,
      href: row.href,
      readAt: row.readAt?.toISOString() ?? null,
      createdAt: row.createdAt.toISOString(),
    })),
  };
}

export async function markRead(userId: string, id: string) {
  const [row] = await db
    .update(notification)
    .set({ readAt: new Date() })
    .where(and(eq(notification.id, id), eq(notification.userId, userId)))
    .returning({ id: notification.id });
  return Boolean(row);
}

export async function markAllRead(userId: string) {
  await db
    .update(notification)
    .set({ readAt: new Date() })
    .where(and(eq(notification.userId, userId), isNull(notification.readAt)));
}
