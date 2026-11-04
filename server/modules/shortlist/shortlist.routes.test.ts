import path from "node:path";
import { fileURLToPath } from "node:url";
import pg from "pg";
import request from "supertest";
import { beforeAll, describe, expect, it } from "vitest";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import app from "../../app.js";
import { creatorProfile } from "../../db/schema.js";
import { db } from "../../lib/db.js";

const ORIGIN = "http://localhost:43123";

async function signUp(role: "brand" | "influencer", label: string) {
  const agent = request.agent(app);
  const email = `${label}-${Date.now()}-${Math.random().toString(16).slice(2)}@example.com`;
  const created = await agent
    .post("/api/auth/sign-up/email")
    .set("Origin", ORIGIN)
    .send({ name: label, email, password: "password123", role, plan: "pro" });
  expect(created.status).toBe(200);
  return agent;
}

describe("shortlist", () => {
  let creatorId = "";

  beforeAll(async () => {
    const client = new pg.Client({ connectionString: process.env.DATABASE_URL });
    await client.connect();
    await client.query("CREATE EXTENSION IF NOT EXISTS vector");
    await client.end();
    const migrationsFolder = path.join(path.dirname(fileURLToPath(import.meta.url)), "../../drizzle");
    await migrate(db, { migrationsFolder });
    const [creator] = await db
      .insert(creatorProfile)
      .values({
        platform: "instagram",
        externalId: `shortlist-${Date.now()}`,
        handle: "shortlist.handle",
        displayName: "Shortlist Creator",
        followerCount: 1200,
        engagementRate: "3.50",
        niches: ["Fitness & Health"],
      })
      .returning({ id: creatorProfile.id });
    creatorId = creator?.id ?? "";
  });

  it("limits shortlist reads and writes to the owning brand", async () => {
    const brand = await signUp("brand", "sl-brand");
    const other = await signUp("brand", "sl-other");
    const influencer = await signUp("influencer", "sl-inf");

    const anon = await request(app).get("/api/shortlist").set("Origin", ORIGIN);
    expect(anon.status).toBe(401);

    const forbidden = await influencer.post("/api/shortlist").set("Origin", ORIGIN).send({ creatorId });
    expect(forbidden.status).toBe(403);

    const me = await brand.get("/api/me").set("Origin", ORIGIN);
    expect(me.body.user.plan).toBe("free");

    const added = await brand.post("/api/shortlist").set("Origin", ORIGIN).send({
      creatorId,
      groupName: "Beauty",
    });
    expect(added.status).toBe(201);
    expect(added.body.items).toHaveLength(1);
    expect(added.body.groups[0].name).toBe("Beauty");
    const itemId = added.body.items[0].id as string;

    const mine = await brand.get("/api/shortlist").set("Origin", ORIGIN);
    expect(mine.body.items.some((item: { id: string }) => item.id === itemId)).toBe(true);

    const hidden = await other.get("/api/shortlist").set("Origin", ORIGIN);
    expect(hidden.body.items.some((item: { id: string }) => item.id === itemId)).toBe(false);

    const stolen = await other.delete(`/api/shortlist/${itemId}`).set("Origin", ORIGIN);
    expect(stolen.status).toBe(404);

    const removed = await brand.delete(`/api/shortlist/${itemId}`).set("Origin", ORIGIN);
    expect(removed.status).toBe(204);
  });
});
