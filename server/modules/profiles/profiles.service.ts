import { eq } from "drizzle-orm";
import type { BrandProfileInput, InfluencerProfileInput } from "@lynk/shared";
import { db } from "../../lib/db.js";
import { brandProfile, creatorProfile, influencerProfile, user } from "../../db/schema.js";
import { upsertCreator } from "../creators/creators.service.js";

function blankToNull(value: string | undefined): string | null {
  const trimmed = value?.trim() ?? "";
  return trimmed.length > 0 ? trimmed : null;
}

export async function getBrandProfile(userId: string) {
  const [row] = await db.select().from(brandProfile).where(eq(brandProfile.userId, userId)).limit(1);
  if (!row) return null;
  return {
    companyName: row.companyName,
    logoUrl: row.logoUrl,
    category: row.category,
    website: row.website,
  };
}

export async function saveBrandProfile(userId: string, input: BrandProfileInput) {
  const values = {
    userId,
    companyName: input.companyName.trim(),
    logoUrl: blankToNull(input.logoUrl),
    category: input.category ?? null,
    website: blankToNull(input.website),
    updatedAt: new Date(),
  };
  const [row] = await db
    .insert(brandProfile)
    .values(values)
    .onConflictDoUpdate({
      target: brandProfile.userId,
      set: values,
    })
    .returning();
  return {
    companyName: row.companyName,
    logoUrl: row.logoUrl,
    category: row.category,
    website: row.website,
  };
}

export async function getInfluencerProfile(userId: string) {
  const [row] = await db.select().from(influencerProfile).where(eq(influencerProfile.userId, userId)).limit(1);
  if (!row) return null;
  return {
    bio: row.bio,
    niches: row.niches ?? [],
    location: row.location,
    rates: row.rates ?? {},
  };
}

export async function saveInfluencerProfile(userId: string, input: InfluencerProfileInput) {
  const [account] = await db
    .select({ name: user.name, email: user.email })
    .from(user)
    .where(eq(user.id, userId))
    .limit(1);
  const values = {
    userId,
    bio: input.bio ?? "",
    niches: input.niches ?? [],
    location: blankToNull(input.location),
    rates: input.rates ?? {},
    updatedAt: new Date(),
  };
  const [row] = await db
    .insert(influencerProfile)
    .values(values)
    .onConflictDoUpdate({
      target: influencerProfile.userId,
      set: values,
    })
    .returning();

  const handle = (account?.name || account?.email || "creator")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ".")
    .replace(/^\.|\.$/g, "")
    .slice(0, 40) || "creator";
  await upsertCreator({
    platform: "profile",
    externalId: userId,
    handle,
    displayName: account?.name || "Creator",
    niches: input.niches ?? [],
    country: blankToNull(input.location),
    userId,
    raw: { bio: row.bio, rates: row.rates },
  });

  return {
    bio: row.bio,
    niches: row.niches ?? [],
    location: row.location,
    rates: row.rates ?? {},
  };
}

export async function publicCreator(id: string) {
  const [row] = await db.select().from(creatorProfile).where(eq(creatorProfile.id, id)).limit(1);
  if (!row) return null;
  const profile = row.userId ? await getInfluencerProfile(row.userId) : null;
  const brand = row.userId ? await getBrandProfile(row.userId) : null;
  return {
    id: row.id,
    platform: row.platform,
    handle: row.handle,
    displayName: row.displayName,
    imageUrl: row.imageUrl,
    followerCount: row.followerCount,
    engagementRate: row.engagementRate == null ? null : Number(row.engagementRate),
    niches: profile?.niches?.length ? profile.niches : row.niches ?? [],
    country: profile?.location ?? row.country,
    verified: Boolean(row.userId),
    bio: profile?.bio ?? null,
    rates: profile?.rates ?? null,
    website: brand?.website ?? null,
  };
}

export async function accountBundle(userId: string, role: string) {
  return {
    brand: role === "brand" ? await getBrandProfile(userId) : null,
    influencer: role === "influencer" ? await getInfluencerProfile(userId) : null,
  };
}
