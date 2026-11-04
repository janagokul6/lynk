import path from "node:path";
import { fileURLToPath } from "node:url";
import pg from "pg";
import { eq } from "drizzle-orm";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { creatorProfile } from "../../db/schema.js";
import { db } from "../../lib/db.js";
import { matchCreators, upsertCreator } from "./creators.service.js";

const externalId = `cutoff-${Date.now()}`;

describe("matchCreators distance cutoff", () => {
  beforeAll(async () => {
    const client = new pg.Client({ connectionString: process.env.DATABASE_URL });
    await client.connect();
    await client.query("CREATE EXTENSION IF NOT EXISTS vector");
    await client.end();
    const migrationsFolder = path.join(path.dirname(fileURLToPath(import.meta.url)), "../../drizzle");
    await migrate(db, { migrationsFolder });
  });

  afterAll(async () => {
    await db.delete(creatorProfile).where(eq(creatorProfile.externalId, externalId));
  });

  it("drops an unrelated query and still returns a niche match", async () => {
    await upsertCreator({
      platform: "youtube",
      externalId,
      handle: "auralabs",
      displayName: "Aura Labs",
      niches: ["beauty", "skincare"],
      country: "IN",
      followerCount: 1000,
    });

    const nonsense = await matchCreators({ q: "quantum-entanglement-pottery", limit: 20 });
    expect(nonsense.some((row) => row.externalId === externalId)).toBe(false);

    const relevant = await matchCreators({ q: "beauty skincare", limit: 20 });
    expect(relevant.some((row) => row.externalId === externalId)).toBe(true);
  });
});
