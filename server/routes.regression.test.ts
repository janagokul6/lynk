import path from "node:path";
import { fileURLToPath } from "node:url";
import pg from "pg";
import request from "supertest";
import { beforeAll, describe, expect, it, vi } from "vitest";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { eq } from "drizzle-orm";

vi.mock("./lib/queue.js", () => ({
  startQueue: vi.fn(async () => undefined),
  stopQueue: vi.fn(async () => undefined),
  ensureQueue: vi.fn(async () => undefined),
  sendJob: vi.fn(async () => "job"),
  work: vi.fn(async () => "worker"),
}));

import app from "./app.js";
import { campaign, user } from "./db/schema.js";
import { db } from "./lib/db.js";
import { MAX_UPLOAD_BYTES } from "./lib/storage.js";

const ORIGIN = "http://localhost:43123";
const migrationsFolder = path.join(path.dirname(fileURLToPath(import.meta.url)), "drizzle");

async function withPg<T>(fn: (client: pg.Client) => Promise<T>): Promise<T> {
  const client = new pg.Client({ connectionString: process.env.DATABASE_URL });
  await client.connect();
  try {
    return await fn(client);
  } finally {
    await client.end();
  }
}

beforeAll(async () => {
  await withPg(async (client) => {
    await client.query("CREATE EXTENSION IF NOT EXISTS vector");
  });
  await migrate(db, { migrationsFolder });

  await db.delete(campaign).where(eq(campaign.userId, "mkt-seed"));
  await db.delete(user).where(eq(user.id, "mkt-seed"));
  await db.insert(user).values({
    id: "mkt-seed",
    name: "Seed",
    email: "mkt-seed@example.com",
    emailVerified: false,
    role: "brand",
    createdAt: new Date(),
    updatedAt: new Date(),
  });
  await db.insert(campaign).values({
    id: "11111111-1111-4111-8111-111111111111",
    userId: "mkt-seed",
    status: "live",
    listedAt: new Date(),
    title: "Instagram fitness",
    campaignType: "Sponsored Post",
    description: "Findable by the crashing filters",
    niches: ["Fitness"],
    platforms: ["Instagram"],
    deliverables: ["Instagram Post"],
    compensationType: "Fixed",
    payMin: "100",
    payMax: "200",
    location: "Remote",
  });
  await db.insert(campaign).values({
    id: "22222222-2222-4222-8222-222222222222",
    userId: "mkt-seed",
    status: "live",
    listedAt: new Date(),
    title: "Aligned vocabulary",
    campaignType: "Sponsored Post",
    description: "Uses the shared marketplace vocabulary",
    niches: ["Fitness & Health"],
    platforms: ["Instagram"],
    deliverables: ["Reels / Shorts"],
    compensationType: "Fixed Payment",
    payMin: "500",
    payMax: "1000",
    location: "Global",
  });
});

describe("auth role assignment", () => {
  it("rejects sign-up that asks for admin", async () => {
    const email = `admin-${Date.now()}@example.com`;
    const res = await request(app)
      .post("/api/auth/sign-up/email")
      .set("Origin", ORIGIN)
      .send({ name: "Ada", email, password: "password123", role: "admin" });

    expect(res.status).toBeGreaterThanOrEqual(400);
    const rows = await withPg((client) =>
      client.query<{ role: string }>('select role from "user" where email = $1', [email])
    );
    expect(rows.rows.some((row) => row.role === "admin")).toBe(false);
  });

  it("keeps a chosen influencer role, strips the session token, and blocks admin", async () => {
    const agent = request.agent(app);
    const email = `influencer-${Date.now()}@example.com`;
    const created = await agent
      .post("/api/auth/sign-up/email")
      .set("Origin", ORIGIN)
      .send({ name: "Bea", email, password: "password123", role: "influencer" });
    expect(created.status).toBe(200);

    const me = await agent.get("/api/me").set("Origin", ORIGIN);
    expect(me.status).toBe(200);
    expect(me.body.user.role).toBe("influencer");
    expect(me.body.session).not.toHaveProperty("token");

    const patched = await agent.patch("/api/me/role").set("Origin", ORIGIN).send({ role: "admin" });
    expect(patched.status).toBe(400);
    const after = await agent.get("/api/me").set("Origin", ORIGIN);
    expect(after.body.user.role).toBe("influencer");

    const viaAuth = await agent
      .post("/api/auth/update-user")
      .set("Origin", ORIGIN)
      .send({ role: "admin" });
    expect(viaAuth.status).toBeGreaterThanOrEqual(400);
    const still = await agent.get("/api/me").set("Origin", ORIGIN);
    expect(still.body.user.role).toBe("influencer");
  });

  it("allows one self-serve role choice after sign-up and then locks it", async () => {
    const agent = request.agent(app);
    const email = `brand-${Date.now()}@example.com`;
    const created = await agent
      .post("/api/auth/sign-up/email")
      .set("Origin", ORIGIN)
      .send({ name: "Cam", email, password: "password123", role: "brand" });
    expect(created.status).toBe(200);

    const first = await agent.patch("/api/me/role").set("Origin", ORIGIN).send({ role: "influencer" });
    expect(first.status).toBe(200);
    expect(first.body.role).toBe("influencer");

    const second = await agent.patch("/api/me/role").set("Origin", ORIGIN).send({ role: "brand" });
    expect(second.status).toBe(409);
    const me = await agent.get("/api/me").set("Origin", ORIGIN);
    expect(me.body.user.role).toBe("influencer");
  });
});

describe("marketplace filters", () => {
  it("filters platforms and categories without crashing", async () => {
    const platforms = await request(app).get("/api/marketplace?platforms=Instagram");
    expect(platforms.status).toBe(200);
    expect(platforms.body.some((row: { id: string }) => row.id === "11111111-1111-4111-8111-111111111111")).toBe(true);

    const categories = await request(app).get("/api/marketplace?categories=Fitness");
    expect(categories.status).toBe(200);
    expect(categories.body.some((row: { id: string }) => row.id === "11111111-1111-4111-8111-111111111111")).toBe(true);
    expect(categories.body.some((row: { id: string }) => row.id === "22222222-2222-4222-8222-222222222222")).toBe(false);

    const aligned = await request(app).get("/api/marketplace").query({
      categories: "Fitness & Health",
      locations: "Global",
      workTypes: "Reels / Shorts",
    });
    expect(aligned.status).toBe(200);
    expect(aligned.body.some((row: { id: string }) => row.id === "22222222-2222-4222-8222-222222222222")).toBe(true);
  });

  it("rejects a non-numeric limit", async () => {
    const res = await request(app).get("/api/marketplace?limit=abc");
    expect(res.status).toBe(400);
    expect(JSON.stringify(res.body).toLowerCase()).not.toContain("select");
  });
});

describe("uploads", () => {
  it("rejects traversal keys and oversize bodies", async () => {
    const agent = request.agent(app);
    const email = `upload-${Date.now()}@example.com`;
    const created = await agent
      .post("/api/auth/sign-up/email")
      .set("Origin", ORIGIN)
      .send({ name: "Dee", email, password: "password123", role: "brand" });
    expect(created.status).toBe(200);

    const traversal = await agent
      .post("/api/storage/sign")
      .set("Origin", ORIGIN)
      .send({ key: "../secret.png", contentType: "image/png" });
    expect(traversal.status).toBe(400);

    const nested = await agent
      .post("/api/storage/sign")
      .set("Origin", ORIGIN)
      .send({ key: "nested/../../secret.png", contentType: "image/png" });
    expect(nested.status).toBe(400);

    const html = await agent
      .post("/api/storage/sign")
      .set("Origin", ORIGIN)
      .send({ key: "page.html", contentType: "text/html" });
    expect(html.status).toBe(400);

    const open = await request(app).get("/api/storage/files/users/someone/photo.png");
    expect(open.status).toBe(401);

    const signed = await agent
      .post("/api/storage/sign")
      .set("Origin", ORIGIN)
      .send({ key: "photo.png", contentType: "image/png" });
    expect(signed.status).toBe(200);
    const uploadUrl = new URL(signed.body.uploadUrl);
    const oversized = await request(app)
      .put(`${uploadUrl.pathname}${uploadUrl.search}`)
      .set("Content-Type", "application/octet-stream")
      .send(Buffer.alloc(MAX_UPLOAD_BYTES + 1));
    expect(oversized.status).toBe(413);
  });
});

describe("social connections", () => {
  it("never returns access or refresh tokens", async () => {
    const agent = request.agent(app);
    const email = `connect-${Date.now()}@example.com`;
    const created = await agent
      .post("/api/auth/sign-up/email")
      .set("Origin", ORIGIN)
      .send({ name: "Eve", email, password: "password123", role: "influencer" });
    expect(created.status).toBe(200);
    const me = await agent.get("/api/me").set("Origin", ORIGIN);
    const userId = me.body.user.id as string;

    const accessToken = "super-secret-access-token";
    const refreshToken = "super-secret-refresh-token";
    const saved = await agent.post("/api/connections").set("Origin", ORIGIN).send({
      platform: "instagram",
      externalAccountId: "ig-1",
      handle: "eve",
      accessToken,
      refreshToken,
    });
    expect(saved.status).toBe(201);
    expect(JSON.stringify(saved.body)).not.toContain(accessToken);
    expect(JSON.stringify(saved.body)).not.toContain(refreshToken);
    expect(saved.body).not.toHaveProperty("accessToken");
    expect(saved.body).not.toHaveProperty("refreshToken");

    const list = await agent.get("/api/connections").set("Origin", ORIGIN);
    expect(list.status).toBe(200);
    expect(JSON.stringify(list.body)).not.toContain(accessToken);
    expect(JSON.stringify(list.body)).not.toContain(refreshToken);
    expect(list.body.connections[0]).not.toHaveProperty("accessToken");
    expect(list.body.connections[0]).not.toHaveProperty("refreshToken");

    const stored = await withPg((client) =>
      client.query<{ accessToken: string; refreshToken: string }>(
        'select "accessToken", "refreshToken" from social_connection where "userId" = $1',
        [userId]
      )
    );
    expect(stored.rows[0]?.accessToken).not.toContain(accessToken);
    expect(stored.rows[0]?.refreshToken).not.toContain(refreshToken);
    expect(stored.rows[0]?.accessToken.startsWith("v1.")).toBe(true);
  });
});

describe("agent tool access", () => {
  it("lets the agent key match creators and refuses sync", async () => {
    const key = process.env.AGENT_API_KEY ?? "lynk-dev-agent-key-16";
    const match = await request(app)
      .post("/api/tools/creators.match")
      .set("x-agent-key", key)
      .send({ q: "beauty" });
    expect(match.status).toBe(200);

    const sync = await request(app)
      .post("/api/tools/creators.enqueue_sync")
      .set("x-agent-key", key)
      .send({ platform: "youtube", externalId: "agent-key-denied", handle: "nope" });
    expect(sync.status).toBe(403);

    const listed = await request(app).get("/api/tools").set("x-agent-key", key);
    expect(listed.status).toBe(200);
    const names = (listed.body.tools as Array<{ name: string }>).map((tool) => tool.name);
    expect(names).toContain("creators.match");
    expect(names).not.toContain("creators.enqueue_sync");
  });

  it("requires a brand or admin session to enqueue sync", async () => {
    const influencer = request.agent(app);
    const influencerEmail = `tool-inf-${Date.now()}@example.com`;
    const influencerSignup = await influencer
      .post("/api/auth/sign-up/email")
      .set("Origin", ORIGIN)
      .send({ name: "Tool Inf", email: influencerEmail, password: "password123", role: "influencer" });
    expect(influencerSignup.status).toBe(200);
    const denied = await influencer
      .post("/api/tools/creators.enqueue_sync")
      .set("Origin", ORIGIN)
      .send({ platform: "youtube", externalId: "inf-sync", handle: "inf" });
    expect(denied.status).toBe(403);

    const brand = request.agent(app);
    const brandEmail = `tool-brand-${Date.now()}@example.com`;
    const brandSignup = await brand
      .post("/api/auth/sign-up/email")
      .set("Origin", ORIGIN)
      .send({ name: "Tool Brand", email: brandEmail, password: "password123", role: "brand" });
    expect(brandSignup.status).toBe(200);
    const allowed = await brand
      .post("/api/tools/creators.enqueue_sync")
      .set("Origin", ORIGIN)
      .send({ platform: "youtube", externalId: "brand-sync", handle: "brand" });
    expect(allowed.status).toBe(202);
  });
});
