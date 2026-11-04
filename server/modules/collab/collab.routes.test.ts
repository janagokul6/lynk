import path from "node:path";
import { fileURLToPath } from "node:url";
import pg from "pg";
import request from "supertest";
import { beforeAll, describe, expect, it } from "vitest";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import app from "../../app.js";
import { db } from "../../lib/db.js";

const ORIGIN = "http://localhost:43123";

async function signUp(role: "brand" | "influencer", label: string) {
  const agent = request.agent(app);
  const email = `${label}-${Date.now()}-${Math.random().toString(16).slice(2)}@example.com`;
  const created = await agent
    .post("/api/auth/sign-up/email")
    .set("Origin", ORIGIN)
    .send({ name: label, email, password: "password123", role });
  expect(created.status).toBe(200);
  return { agent, email };
}

describe("collaboration flow", () => {
  beforeAll(async () => {
    const client = new pg.Client({ connectionString: process.env.DATABASE_URL });
    await client.connect();
    await client.query("CREATE EXTENSION IF NOT EXISTS vector");
    await client.end();
    const migrationsFolder = path.join(path.dirname(fileURLToPath(import.meta.url)), "../../drizzle");
    await migrate(db, { migrationsFolder });
  });

  it("saves profiles, applies, accepts, submits, approves, completes, rates, messages, and notifies", async () => {
    const brand = await signUp("brand", "flow-brand");
    const influencer = await signUp("influencer", "flow-creator");

    const profile = await influencer.agent.put("/api/profiles/influencer").set("Origin", ORIGIN).send({
      bio: "Skincare notes",
      niches: ["beauty"],
      location: "IN",
      rates: { reel: "1500" },
    });
    expect(profile.status).toBe(200);

    const company = await brand.agent.put("/api/profiles/brand").set("Origin", ORIGIN).send({
      companyName: "North Studio",
      website: "",
      logoUrl: "",
    });
    expect(company.status).toBe(200);
    expect(company.body.companyName).toBe("North Studio");

    const campaign = await brand.agent.post("/api/campaigns").set("Origin", ORIGIN).send({
      status: "live",
      title: "Flow campaign",
      campaignType: "Sponsored Post",
      description: "A real brief",
      niches: ["Beauty & Wellness"],
      platforms: ["Instagram"],
      deliverables: ["Reels / Shorts"],
      compensationType: "Fixed",
      payMin: "1500",
      payMax: "2000",
      disclosureChecks: ["paid-partnership"],
    });
    expect(campaign.status).toBe(201);
    expect(campaign.body.brandName).toBe("North Studio");

    const applied = await influencer.agent.post("/api/applications").set("Origin", ORIGIN).send({
      campaignId: campaign.body.id,
      message: "I can film this",
    });
    expect(applied.status).toBe(201);
    const applicationId = applied.body.id as string;

    const brandNotes = await brand.agent.get("/api/notifications").set("Origin", ORIGIN);
    expect(brandNotes.status).toBe(200);
    expect(brandNotes.body.unread).toBeGreaterThan(0);

    const accepted = await brand.agent.post(`/api/applications/${applicationId}/accept`).set("Origin", ORIGIN);
    expect(accepted.status).toBe(200);

    const submitted = await influencer.agent.post(`/api/collab/${applicationId}/submissions`).set("Origin", ORIGIN).send({
      url: "https://example.com/draft",
      note: "First cut",
    });
    expect(submitted.status).toBe(201);
    expect(submitted.body.application.status).toBe("submitted");

    const revision = await brand.agent.post(`/api/collab/${applicationId}/revision`).set("Origin", ORIGIN).send({
      note: "Open on the product",
    });
    expect(revision.status).toBe(200);
    expect(revision.body.application.status).toBe("revision");

    const resubmitted = await influencer.agent.post(`/api/collab/${applicationId}/submissions`).set("Origin", ORIGIN).send({
      url: "https://example.com/draft-2",
    });
    expect(resubmitted.body.application.status).toBe("submitted");

    const approved = await brand.agent.post(`/api/collab/${applicationId}/approve`).set("Origin", ORIGIN);
    expect(approved.body.application.status).toBe("approved");

    const proof = await influencer.agent.post(`/api/collab/${applicationId}/proof`).set("Origin", ORIGIN).send({
      url: "https://example.com/live",
    });
    expect(proof.status).toBe(201);
    expect(proof.body.application.status).toBe("completed");

    const brandRate = await brand.agent.post(`/api/collab/${applicationId}/ratings`).set("Origin", ORIGIN).send({
      score: 5,
      comment: "Clear disclosure",
    });
    expect(brandRate.status).toBe(201);
    const creatorRate = await influencer.agent.post(`/api/collab/${applicationId}/ratings`).set("Origin", ORIGIN).send({
      score: 4,
    });
    expect(creatorRate.status).toBe(201);

    const thread = await brand.agent.post("/api/messages").set("Origin", ORIGIN).send({
      applicationId,
      body: "Thanks for posting",
    });
    expect(thread.status).toBe(201);
    const reply = await influencer.agent.post(`/api/messages/${thread.body.id}`).set("Origin", ORIGIN).send({
      body: "Glad it worked",
    });
    expect(reply.status).toBe(201);

    const creatorNotes = await influencer.agent.get("/api/notifications").set("Origin", ORIGIN);
    expect(creatorNotes.body.notifications.length).toBeGreaterThan(0);
    const firstId = creatorNotes.body.notifications[0].id as string;
    const read = await influencer.agent.post(`/api/notifications/${firstId}/read`).set("Origin", ORIGIN);
    expect(read.status).toBe(200);

    const mailbox = await request(app).get("/api/dev/mailbox").query({ email: influencer.email });
    expect(mailbox.status).toBe(200);
    expect(mailbox.body.messages.some((item: { subject: string }) => /accepted/i.test(item.subject))).toBe(true);

    const reset = await request(app).post("/api/auth/request-password-reset").set("Origin", ORIGIN).send({
      email: influencer.email,
      redirectTo: "http://localhost:43123/reset-password",
    });
    expect(reset.status).toBe(200);
    const afterReset = await request(app).get("/api/dev/mailbox").query({ email: influencer.email });
    expect(afterReset.body.messages.some((item: { subject: string }) => /reset/i.test(item.subject))).toBe(true);
  });
});
