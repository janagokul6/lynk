import { and, eq } from "drizzle-orm";
import type { SocialConnectionCreate } from "@lynk/shared";
import { db } from "../../lib/db.js";
import { socialConnection } from "../../db/schema.js";
import { domainEvents } from "../../lib/events.js";
import { enqueueCreatorSync } from "../creators/creators.service.js";

export async function listConnections(userId: string) {
  return db.select().from(socialConnection).where(eq(socialConnection.userId, userId));
}

export async function upsertConnection(userId: string, input: SocialConnectionCreate) {
  const values = {
    userId,
    platform: input.platform,
    externalAccountId: input.externalAccountId,
    handle: input.handle ?? null,
    accessToken: input.accessToken ?? null,
    refreshToken: input.refreshToken ?? null,
    scopes: input.scopes ?? null,
    updatedAt: new Date(),
  };

  const [row] = await db
    .insert(socialConnection)
    .values(values)
    .onConflictDoUpdate({
      target: [socialConnection.userId, socialConnection.platform],
      set: values,
    })
    .returning();

  domainEvents.emitEvent({
    type: "connection.upserted",
    userId,
    platform: row.platform,
  });

  await enqueueCreatorSync({
    platform: input.platform,
    externalId: input.externalAccountId,
    handle: input.handle,
  });

  return row;
}

export async function removeConnection(userId: string, platform: string) {
  await db
    .delete(socialConnection)
    .where(and(eq(socialConnection.userId, userId), eq(socialConnection.platform, platform)));
}
