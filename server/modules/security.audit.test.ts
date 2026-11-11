import path from "node:path";
import { fileURLToPath } from "node:url";
import pg from "pg";
import request from "supertest";
import { eq } from "drizzle-orm";
import { beforeAll, describe, expect, it, vi } from "vitest";

const queue = vi.hoisted(() => ({ sent: [] as unknown[] }));

vi.mock("../lib/queue.js", () => ({
  startQueue: vi.fn(async () => undefined),
  stopQueue: vi.fn(async () => undefined),
  ensureQueue: vi.fn(async () => undefined),
  sendJob: vi.fn(async (_name: string, data: unknown) => {
    queue.sent.push(data);
    return "job";
  }),
  work: vi.fn(async () => "worker"),
}));

import { migrate } from "drizzle-orm/node-postgres/migrator";
import { TOOL_CONFIRM_HEADER, creatorSyncPayloadSchema } from "@lynk/shared";
import app from "../app.js";
import { db } from "../lib/db.js";
import { creatorProfile } from "../db/schema.js";
import { syncCreator } from "./creators/creators.service.js";

const ORIGIN = "http://localhost:43123";

async function signUp(role: "brand" | "influencer" | undefined, label: string) {
  const agent = request.agent(app);
  const email = `${label}-${Date.now()}-${Math.random().toString(16).slice(2)}@example.com`;
  const created = await agent.post("/api/auth/sign-up/email").set("Origin", ORIGIN).send({
    name: label,
    email,
    password: "password123",
    ...(role ? { role } : {}),
  });
  expect(created.status).toBe(200);
  const me = await agent.get("/api/me").set("Origin", ORIGIN);
  return { agent, email, id: me.body.user.id as string };
}

describe("security audit fixes", () => {
  beforeAll(async () => {
    const client = new pg.Client({ connectionString: process.env.DATABASE_URL });
    await client.connect();
    await client.query("CREATE EXTENSION IF NOT EXISTS vector");
    await client.end();
    const migrationsFolder = path.join(path.dirname(fileURLToPath(import.meta.url)), "../drizzle");
    await migrate(db, { migrationsFolder });
  });

  it("does not let a brand take over or rewrite a linked creator through sync", async () => {
    const influencer = await signUp("influencer", "owner");
    const brand = await signUp("brand", "hijacker");
    const externalId = `ig-${Date.now()}`;
    const [linked] = await db
      .insert(creatorProfile)
      .values({
        platform: "instagram",
        externalId,
        handle: "real.creator",
        displayName: "Real Creator",
        followerCount: 5000,
        niches: ["beauty"],
        userId: influencer.id,
      })
      .returning();

    queue.sent.length = 0;
    const viaApi = await brand.agent.post("/api/creators/sync").set("Origin", ORIGIN).send({
      platform: "instagram",
      externalId,
      handle: "fake.creator",
      userId: brand.id,
    });
    expect(viaApi.status).toBe(202);
    const viaTool = await brand.agent
      .post("/api/tools/creators.enqueue_sync")
      .set("Origin", ORIGIN)
      .set(TOOL_CONFIRM_HEADER, "1")
      .send({ platform: "instagram", externalId, handle: "fake.creator", userId: brand.id });
    expect(viaTool.status).toBe(202);
    expect(queue.sent).toHaveLength(2);

    for (const payload of queue.sent) {
      expect(payload).not.toHaveProperty("userId");
      await syncCreator(creatorSyncPayloadSchema.parse(payload));
    }

    const [after] = await db.select().from(creatorProfile).where(eq(creatorProfile.id, linked.id));
    expect(after.userId).toBe(influencer.id);
    expect(after.handle).toBe("real.creator");
    expect(after.displayName).toBe("Real Creator");
    expect(after.followerCount).toBe(5000);
  });

  it("still records a new creator from a sync request", async () => {
    const externalId = `ig-new-${Date.now()}`;
    const row = await syncCreator({ platform: "instagram", externalId, handle: "fresh.creator" });
    expect(row?.handle).toBe("fresh.creator");
    expect(row?.userId).toBeNull();
  });

  it("keeps creator discovery behind a brand session", async () => {
    const anonymous = await request(app).get("/api/discovery/search").query({ q: "beauty" });
    expect(anonymous.status).toBe(401);
    const anonymousSuggest = await request(app).get("/api/discovery/suggestions").query({ q: "beauty" });
    expect(anonymousSuggest.status).toBe(401);
    const influencer = await signUp("influencer", "discover-influencer");
    const blocked = await influencer.agent.get("/api/discovery/search").query({ q: "beauty" });
    expect(blocked.status).toBe(403);
    const brand = await signUp("brand", "discover-brand");
    const allowed = await brand.agent.get("/api/discovery/suggestions").query({ q: "beauty" });
    expect(allowed.status).toBe(200);
  });
});
