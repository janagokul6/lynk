import path from "node:path";
import { fileURLToPath } from "node:url";
import pg from "pg";
import request from "supertest";
import { eq } from "drizzle-orm";
import { beforeAll, describe, expect, it, vi } from "vitest";

vi.mock("../lib/queue.js", () => ({
  startQueue: vi.fn(async () => undefined),
  stopQueue: vi.fn(async () => undefined),
  ensureQueue: vi.fn(async () => undefined),
  sendJob: vi.fn(async () => "job"),
  work: vi.fn(async () => "worker"),
}));
import { migrate } from "drizzle-orm/node-postgres/migrator";
import app from "../app.js";
import { db } from "../lib/db.js";
import { decryptSecret } from "../lib/secrets.js";
import { purgeUserOwnedData } from "../lib/account-deletion.js";
import { consumeOAuthState, issueOAuthState } from "./connections/connections.oauth.js";
import {
  application,
  conversation,
  creatorProfile,
  notification,
  rating,
  socialConnection,
  submission,
  user,
  verification,
} from "../db/schema.js";

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
  return { agent, email, id: me.body.user.id as string, roleChosenAt: me.body.user.roleChosenAt as string | null };
}

async function liveCampaign(brand: ReturnType<typeof request.agent>) {
  const campaign = await brand.post("/api/campaigns").set("Origin", ORIGIN).send({
    status: "live",
    title: "Review campaign",
    campaignType: "Sponsored Post",
    description: "A real brief",
    niches: ["Beauty & Wellness"],
    platforms: ["Instagram"],
    deliverables: ["Reels / Shorts"],
    compensationType: "Fixed",
    payMin: "1500",
    payMax: "2000",
  });
  expect(campaign.status).toBe(201);
  return campaign.body.id as string;
}

describe("review security and lifecycle fixes", () => {
  beforeAll(async () => {
    const client = new pg.Client({ connectionString: process.env.DATABASE_URL });
    await client.connect();
    await client.query("CREATE EXTENSION IF NOT EXISTS vector");
    await client.end();
    const migrationsFolder = path.join(path.dirname(fileURLToPath(import.meta.url)), "../drizzle");
    await migrate(db, { migrationsFolder });
  });

  it("backfills roleChosenAt without overwriting a choice", async () => {
    const chosenId = `chosen-${Date.now()}`;
    const openId = `open-${Date.now()}`;
    const createdAt = new Date("2020-01-01T00:00:00.000Z");
    const chosenAt = new Date("2024-05-01T00:00:00.000Z");
    await db.insert(user).values([
      {
        id: chosenId,
        name: "Chosen",
        email: `${chosenId}@example.com`,
        emailVerified: false,
        role: "brand",
        plan: "free",
        roleChosenAt: chosenAt,
        createdAt,
        updatedAt: createdAt,
      },
      {
        id: openId,
        name: "Open",
        email: `${openId}@example.com`,
        emailVerified: false,
        role: "influencer",
        plan: "free",
        roleChosenAt: null,
        createdAt,
        updatedAt: createdAt,
      },
    ]);
    const client = new pg.Client({ connectionString: process.env.DATABASE_URL });
    await client.connect();
    await client.query(
      `UPDATE "user" SET "roleChosenAt" = "createdAt" WHERE "roleChosenAt" IS NULL AND "createdAt" IS NOT NULL`
    );
    await client.end();
    const rows = await db
      .select({ id: user.id, roleChosenAt: user.roleChosenAt })
      .from(user)
      .where(eq(user.id, chosenId));
    const opened = await db
      .select({ roleChosenAt: user.roleChosenAt })
      .from(user)
      .where(eq(user.id, openId));
    expect(rows[0]?.roleChosenAt?.toISOString()).toBe(chosenAt.toISOString());
    expect(opened[0]?.roleChosenAt?.toISOString()).toBe(createdAt.toISOString());
    await db.delete(user).where(eq(user.id, chosenId));
    await db.delete(user).where(eq(user.id, openId));
  });

  it("lets a signup without a role choose once, then locks it", async () => {
    const account = await signUp(undefined, "unset-role");
    expect(account.roleChosenAt).toBeNull();
    const saved = await account.agent.patch("/api/me/role").set("Origin", ORIGIN).send({ role: "influencer" });
    expect(saved.status).toBe(200);
    const again = await account.agent.patch("/api/me/role").set("Origin", ORIGIN).send({ role: "brand" });
    expect(again.status).toBe(409);
  });

  it("blocks outsiders, illegal jumps, duplicate ratings, and duplicate invite mail", async () => {
    const brand = await signUp("brand", "sec-brand");
    const influencer = await signUp("influencer", "sec-creator");
    const outsider = await signUp("influencer", "sec-outsider");
    await influencer.agent.put("/api/profiles/influencer").set("Origin", ORIGIN).send({
      bio: "Notes",
      niches: ["beauty"],
      rates: { reel: "1500" },
    });
    const [creator] = await db
      .select({ id: creatorProfile.id })
      .from(creatorProfile)
      .where(eq(creatorProfile.userId, influencer.id))
      .limit(1);
    expect(creator).toBeTruthy();

    const campaignId = await liveCampaign(brand.agent);
    const applied = await influencer.agent.post("/api/applications").set("Origin", ORIGIN).send({ campaignId });
    expect(applied.status).toBe(201);
    const applicationId = applied.body.id as string;

    const hidden = await outsider.agent.get(`/api/collab/${applicationId}`).set("Origin", ORIGIN);
    expect(hidden.status).toBe(404);
    const stolenSubmit = await outsider.agent
      .post(`/api/collab/${applicationId}/submissions`)
      .set("Origin", ORIGIN)
      .send({ url: "https://example.com/stolen" });
    expect(stolenSubmit.status).toBe(404);

    const earlyApprove = await brand.agent.post(`/api/collab/${applicationId}/approve`).set("Origin", ORIGIN);
    expect(earlyApprove.status).toBe(409);
    const earlyRows = await db.select().from(submission).where(eq(submission.applicationId, applicationId));
    expect(earlyRows).toHaveLength(0);

    const accepted = await brand.agent.post(`/api/applications/${applicationId}/accept`).set("Origin", ORIGIN);
    expect(accepted.status).toBe(200);
    const threads = await brand.agent.get("/api/messages").set("Origin", ORIGIN);
    expect(threads.status).toBe(200);
    expect(threads.body.threads[0].id).toBeNull();
    const storedThreads = await db.select().from(conversation).where(eq(conversation.applicationId, applicationId));
    expect(storedThreads).toHaveLength(0);

    const held = await brand.agent.post("/api/tools/collab.approve").set("Origin", ORIGIN).send({ applicationId });
    expect(held.body.result.needsConfirmation).toBe(true);
    const stillAccepted = await brand.agent.get(`/api/collab/${applicationId}`).set("Origin", ORIGIN);
    expect(stillAccepted.body.application.status).toBe("accepted");

    const badKey = await influencer.agent.post(`/api/collab/${applicationId}/submissions`).set("Origin", ORIGIN).send({
      storageKey: `users/${outsider.id}/secret.png`,
    });
    expect(badKey.status).toBe(400);
    const badUrl = await influencer.agent
      .post(`/api/collab/${applicationId}/submissions`)
      .set("Origin", ORIGIN)
      .send({ url: "ftp://example.com/draft" });
    expect(badUrl.status).toBe(400);

    const invited = await brand.agent.post("/api/invites").set("Origin", ORIGIN).send({
      campaignId,
      creatorId: creator!.id,
    });
    expect(invited.status).toBe(201);
    const again = await brand.agent.post("/api/invites").set("Origin", ORIGIN).send({
      campaignId,
      creatorId: creator!.id,
    });
    expect(again.status).toBe(201);
    const inviteNotes = await db
      .select()
      .from(notification)
      .where(eq(notification.userId, influencer.id));
    expect(inviteNotes.filter((row) => row.type === "invite.created")).toHaveLength(1);

    const rejected = await brand.agent.post(`/api/applications/${applicationId}/reject`).set("Origin", ORIGIN);
    expect(rejected.status).toBe(409);

    const withdraw = await influencer.agent.post(`/api/applications/${applicationId}/withdraw`).set("Origin", ORIGIN);
    expect(withdraw.status).toBe(409);

    await db.update(application).set({ status: "rejected", updatedAt: new Date() }).where(eq(application.id, applicationId));
    const stale = await influencer.agent.post(`/api/invites/${invited.body.id}/accept`).set("Origin", ORIGIN);
    expect(stale.status).toBe(409);
    const reinvited = await brand.agent.post("/api/invites").set("Origin", ORIGIN).send({
      campaignId,
      creatorId: creator!.id,
    });
    expect(reinvited.status).toBe(201);
    const reopened = await influencer.agent.post(`/api/invites/${invited.body.id}/accept`).set("Origin", ORIGIN);
    expect(reopened.status).toBe(200);
    const afterInvite = await db
      .select()
      .from(notification)
      .where(eq(notification.userId, influencer.id));
    expect(afterInvite.filter((row) => row.type === "invite.created")).toHaveLength(2);

    const submitted = await influencer.agent.post(`/api/collab/${applicationId}/submissions`).set("Origin", ORIGIN).send({
      url: "https://example.com/draft",
    });
    expect(submitted.status).toBe(201);
    const approved = await brand.agent
      .post("/api/tools/collab.approve")
      .set("Origin", ORIGIN)
      .set("x-lynk-confirm", "1")
      .send({ applicationId });
    expect(approved.status).toBe(200);
    expect(approved.body.result.status).toBe("approved");
    const proof = await influencer.agent.post(`/api/collab/${applicationId}/proof`).set("Origin", ORIGIN).send({
      url: "https://example.com/live",
    });
    expect(proof.body.application.status).toBe("completed");
    const firstRate = await brand.agent.post(`/api/collab/${applicationId}/ratings`).set("Origin", ORIGIN).send({ score: 5 });
    expect(firstRate.status).toBe(201);
    const secondRate = await brand.agent.post(`/api/collab/${applicationId}/ratings`).set("Origin", ORIGIN).send({ score: 4 });
    expect(secondRate.status).toBe(409);
    const ratings = await db.select().from(rating).where(eq(rating.applicationId, applicationId));
    expect(ratings).toHaveLength(1);

    const [note] = await db.select().from(notification).where(eq(notification.userId, brand.id)).limit(1);
    const marked = await outsider.agent.post(`/api/notifications/${note!.id}/read`).set("Origin", ORIGIN);
    expect(marked.status).toBe(404);

    const exported = await influencer.agent.get("/api/me/export").set("Origin", ORIGIN);
    expect(exported.status).toBe(200);
    expect(JSON.stringify(exported.body)).not.toContain(brand.email);
    expect(JSON.stringify(exported.body)).not.toContain(outsider.email);
    expect(exported.body.connections ?? []).toEqual([]);
  });

  it("rejects mismatched uploads and another user's storage key", async () => {
    const influencer = await signUp("influencer", "upload-creator");
    const other = await signUp("brand", "upload-other");
    const brand = await signUp("brand", "upload-brand");
    const campaignId = await liveCampaign(brand.agent);
    const applied = await influencer.agent.post("/api/applications").set("Origin", ORIGIN).send({ campaignId });
    await brand.agent.post(`/api/applications/${applied.body.id}/accept`).set("Origin", ORIGIN);

    const signed = await influencer.agent.post("/api/storage/sign").set("Origin", ORIGIN).send({
      key: "draft.png",
      contentType: "image/png",
    });
    expect(signed.status).toBe(200);
    const token = new URL(signed.body.uploadUrl).searchParams.get("token");
    const html = await request(app)
      .put("/api/storage/upload")
      .query({ token })
      .set("Content-Type", "image/png")
      .send(Buffer.from("<html><script>alert(1)</script></html>"));
    expect(html.status).toBe(415);

    const png = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0, 0, 0, 0]);
    const ok = await request(app).put("/api/storage/upload").query({ token }).set("Content-Type", "image/png").send(png);
    expect(ok.status).toBe(201);
    const key = ok.body.key as string;
    const denied = await other.agent.get(`/api/storage/files/${key}`).set("Origin", ORIGIN);
    expect(denied.status).toBe(403);
    const allowed = await influencer.agent.get(`/api/storage/files/${key}`).set("Origin", ORIGIN);
    expect(allowed.status).toBe(200);
    expect(allowed.headers["x-content-type-options"]).toBe("nosniff");
  });

  it("uses single-use OAuth state, keeps refresh tokens, and purges creator data on delete", async () => {
    const influencer = await signUp("influencer", "oauth-creator");
    const brand = await signUp("brand", "oauth-brand");
    const state = await issueOAuthState(influencer.id, "youtube");
    expect(await consumeOAuthState(state)).toMatchObject({ userId: influencer.id, platform: "youtube" });
    expect(await consumeOAuthState(state)).toBeNull();
    expect(await consumeOAuthState("not-a-state")).toBeNull();

    const start = await brand.agent.get("/api/connections/youtube/start").set("Origin", ORIGIN);
    expect(start.status).toBe(302);
    expect(start.headers.location).toContain("connectError=forbidden");
    const creatorStart = await influencer.agent.get("/api/connections/youtube/start").set("Origin", ORIGIN);
    expect(creatorStart.status).toBe(302);
    expect(creatorStart.headers.location).toContain("connectError=not_configured");

    const firstToken = await influencer.agent.post("/api/connections").set("Origin", ORIGIN).send({
      platform: "youtube",
      externalAccountId: "channel-1",
      accessToken: "access-1",
      refreshToken: "refresh-1",
    });
    expect(firstToken.status).toBe(201);
    const secondToken = await influencer.agent.post("/api/connections").set("Origin", ORIGIN).send({
      platform: "youtube",
      externalAccountId: "channel-1",
      accessToken: "access-2",
    });
    expect(secondToken.status).toBe(201);
    const [tokens] = await db
      .select({ accessToken: socialConnection.accessToken, refreshToken: socialConnection.refreshToken })
      .from(socialConnection)
      .where(eq(socialConnection.userId, influencer.id));
    expect(decryptSecret(tokens!.accessToken!)).toBe("access-2");
    expect(decryptSecret(tokens!.refreshToken!)).toBe("refresh-1");

    await influencer.agent.put("/api/profiles/influencer").set("Origin", ORIGIN).send({ bio: "Secret bio", niches: ["beauty"] });
    await db.insert(verification).values({
      id: `ver-${influencer.id}`,
      identifier: influencer.email,
      value: influencer.id,
      expiresAt: new Date(Date.now() + 60_000),
    });
    await purgeUserOwnedData(influencer.id, influencer.email);
    const profiles = await db.select().from(creatorProfile).where(eq(creatorProfile.userId, influencer.id));
    expect(profiles).toHaveLength(0);
    const tokensLeft = await db.select().from(verification).where(eq(verification.identifier, influencer.email));
    expect(tokensLeft).toHaveLength(0);

    const deleted = await influencer.agent.post("/api/auth/delete-user").set("Origin", ORIGIN).send({ password: "password123" });
    expect(deleted.status).toBe(200);
    const me = await influencer.agent.get("/api/me").set("Origin", ORIGIN);
    expect(me.body).toBeNull();
  });
});
