import { and, eq } from "drizzle-orm";
import type { SocialConnectionCreate } from "@lynk/shared";
import { db } from "../../lib/db.js";
import { socialConnection } from "../../db/schema.js";
import { domainEvents } from "../../lib/events.js";
import { encryptSecret } from "../../lib/secrets.js";
import { enqueueCreatorSync } from "../creators/creators.service.js";

const publicColumns = {
  id: socialConnection.id,
  platform: socialConnection.platform,
  externalAccountId: socialConnection.externalAccountId,
  handle: socialConnection.handle,
  createdAt: socialConnection.createdAt,
  updatedAt: socialConnection.updatedAt,
};

export async function listConnections(userId: string) {
  return db.select(publicColumns).from(socialConnection).where(eq(socialConnection.userId, userId));
}

export async function upsertConnection(userId: string, input: SocialConnectionCreate) {
  const tokens: { accessToken?: string; refreshToken?: string } = {};
  if (input.accessToken) tokens.accessToken = encryptSecret(input.accessToken);
  if (input.refreshToken) tokens.refreshToken = encryptSecret(input.refreshToken);
  const values = {
    userId,
    platform: input.platform,
    externalAccountId: input.externalAccountId,
    handle: input.handle ?? null,
    scopes: input.scopes ?? null,
    updatedAt: new Date(),
    ...tokens,
  };

  const [row] = await db
    .insert(socialConnection)
    .values({
      ...values,
      accessToken: tokens.accessToken ?? null,
      refreshToken: tokens.refreshToken ?? null,
    })
    .onConflictDoUpdate({
      target: [socialConnection.userId, socialConnection.platform],
      set: values,
    })
    .returning(publicColumns);

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
