import path from "node:path";
import { fileURLToPath } from "node:url";
import pg from "pg";
import request from "supertest";
import { beforeAll, describe, expect, it } from "vitest";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import app from "../../app.js";
import { db } from "../../lib/db.js";

const ORIGIN = "http://localhost:43123";

const liveCampaign = {
  status: "live",
  title: "Apply flow",
  campaignType: "Sponsored Post",
  description: "A live campaign for applications",
  niches: ["Fitness & Health"],
  platforms: ["Instagram"],
  deliverables: ["Reels / Shorts"],
  compensationType: "Fixed",
  payMin: "100",
  payMax: "200",
  location: "Remote",
};

async function signUp(role: "brand" | "influencer", label: string) {
  const agent = request.agent(app);
  const email = `${label}-${Date.now()}-${Math.random().toString(16).slice(2)}@example.com`;
  const created = await agent
    .post("/api/auth/sign-up/email")
    .set("Origin", ORIGIN)
    .send({ name: label, email, password: "password123", role });
  expect(created.status).toBe(200);
  return agent;
}

describe("applications", () => {
  beforeAll(async () => {
    const client = new pg.Client({ connectionString: process.env.DATABASE_URL });
    await client.connect();
    await client.query("CREATE EXTENSION IF NOT EXISTS vector");
    await client.end();
    const migrationsFolder = path.join(path.dirname(fileURLToPath(import.meta.url)), "../../drizzle");
    await migrate(db, { migrationsFolder });
  });

  it("enforces role, ownership, duplicates, and the accept/withdraw path", async () => {
    const brand = await signUp("brand", "app-brand");
    const otherBrand = await signUp("brand", "app-other-brand");
    const influencer = await signUp("influencer", "app-inf");
    const otherInfluencer = await signUp("influencer", "app-other-inf");

    const anon = await request(app)
      .post("/api/applications")
      .set("Origin", ORIGIN)
      .send({ campaignId: "11111111-1111-4111-8111-111111111111", message: "hi" });
    expect(anon.status).toBe(401);

    const brandApply = await brand
      .post("/api/applications")
      .set("Origin", ORIGIN)
      .send({ campaignId: "11111111-1111-4111-8111-111111111111", message: "hi" });
    expect(brandApply.status).toBe(403);

    const draft = await brand.post("/api/campaigns").set("Origin", ORIGIN).send({
      ...liveCampaign,
      status: "draft",
      title: "Draft hidden",
    });
    expect(draft.status).toBe(201);
    const draftApply = await influencer
      .post("/api/applications")
      .set("Origin", ORIGIN)
      .send({ campaignId: draft.body.id, message: "too early" });
    expect(draftApply.status).toBe(404);

    const created = await brand.post("/api/campaigns").set("Origin", ORIGIN).send(liveCampaign);
    expect(created.status).toBe(201);
    const campaignId = created.body.id as string;

    const applied = await influencer
      .post("/api/applications")
      .set("Origin", ORIGIN)
      .send({ campaignId, message: "I can film this next week" });
    expect(applied.status).toBe(201);
    expect(applied.body.status).toBe("pending");
    expect(applied.body.message).toBe("I can film this next week");

    const duplicate = await influencer
      .post("/api/applications")
      .set("Origin", ORIGIN)
      .send({ campaignId, message: "again" });
    expect(duplicate.status).toBe(409);

    const mine = await influencer.get("/api/applications").set("Origin", ORIGIN);
    expect(mine.status).toBe(200);
    expect(mine.body.some((row: { id: string }) => row.id === applied.body.id)).toBe(true);

    const hidden = await otherInfluencer.get("/api/applications").set("Origin", ORIGIN);
    expect(hidden.status).toBe(200);
    expect(hidden.body.some((row: { id: string }) => row.id === applied.body.id)).toBe(false);

    const brandList = await brand.get("/api/applications").set("Origin", ORIGIN);
    expect(brandList.status).toBe(200);
    expect(brandList.body.some((row: { id: string }) => row.id === applied.body.id)).toBe(true);

    const otherList = await otherBrand.get("/api/applications").set("Origin", ORIGIN);
    expect(otherList.body.some((row: { id: string }) => row.id === applied.body.id)).toBe(false);

    const stolen = await otherBrand
      .post(`/api/applications/${applied.body.id}/accept`)
      .set("Origin", ORIGIN);
    expect(stolen.status).toBe(404);

    const second = await otherInfluencer
      .post("/api/applications")
      .set("Origin", ORIGIN)
      .send({ campaignId, message: "second pitch" });
    expect(second.status).toBe(201);
    const withdrawn = await otherInfluencer
      .post(`/api/applications/${second.body.id}/withdraw`)
      .set("Origin", ORIGIN);
    expect(withdrawn.status).toBe(200);
    expect(withdrawn.body.status).toBe("withdrawn");

    const accepted = await brand
      .post(`/api/applications/${applied.body.id}/accept`)
      .set("Origin", ORIGIN);
    expect(accepted.status).toBe(200);
    expect(accepted.body.status).toBe("accepted");

    const withdrawAccepted = await influencer
      .post(`/api/applications/${applied.body.id}/withdraw`)
      .set("Origin", ORIGIN);
    expect(withdrawAccepted.status).toBe(409);
  });
});