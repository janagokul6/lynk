import path from "node:path";
import { fileURLToPath } from "node:url";
import pg from "pg";
import request from "supertest";
import { beforeAll, describe, expect, it } from "vitest";
import { eq } from "drizzle-orm";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import app from "../../app.js";
import { user } from "../../db/schema.js";
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
  return { agent, email };
}

describe("home plan gating", () => {
  beforeAll(async () => {
    const client = new pg.Client({ connectionString: process.env.DATABASE_URL });
    await client.connect();
    await client.query("CREATE EXTENSION IF NOT EXISTS vector");
    await client.end();
    const migrationsFolder = path.join(path.dirname(fileURLToPath(import.meta.url)), "../../drizzle");
    await migrate(db, { migrationsFolder });
  });

  it("keeps side-by-side off until the stored plan is pro", async () => {
    const anon = await request(app).get("/api/home").set("Origin", ORIGIN);
    expect(anon.status).toBe(401);

    const { agent, email } = await signUp("brand", "home-brand");
    const free = await agent.get("/api/home").set("Origin", ORIGIN);
    expect(free.status).toBe(200);
    expect(free.body.plan).toBe("free");
    expect(free.body.sideBySide).toBe(false);
    expect(free.body.briefing.pendingApplicants).toBe(0);

    await db.update(user).set({ plan: "pro" }).where(eq(user.email, email));
    const pro = await agent.get("/api/home").set("Origin", ORIGIN);
    expect(pro.body.plan).toBe("pro");
    expect(pro.body.sideBySide).toBe(true);

    const influencer = await signUp("influencer", "home-inf");
    const infHome = await influencer.agent.get("/api/home").set("Origin", ORIGIN);
    expect(infHome.status).toBe(200);
    expect(infHome.body.role).toBe("influencer");
    expect(infHome.body.sideBySide).toBe(false);
    expect(infHome.body.briefing.matchedOn).toBe("newest");
  });
});
