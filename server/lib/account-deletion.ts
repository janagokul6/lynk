import { and, eq, or } from "drizzle-orm";
import { creatorProfile, verification } from "../db/schema.js";
import { db } from "./db.js";

export async function purgeUserOwnedData(userId: string, email: string | null | undefined): Promise<void> {
  await db
    .delete(creatorProfile)
    .where(and(eq(creatorProfile.userId, userId), eq(creatorProfile.platform, "profile")));
  await db
    .update(creatorProfile)
    .set({ userId: null, raw: {}, updatedAt: new Date() })
    .where(eq(creatorProfile.userId, userId));
  const identifiers = [email?.trim().toLowerCase(), email?.trim()].filter((value): value is string => Boolean(value));
  if (identifiers.length === 0 && !userId) return;
  await db
    .delete(verification)
    .where(
      or(
        eq(verification.value, userId),
        ...identifiers.map((identifier) => eq(verification.identifier, identifier))
      )
    );
}
