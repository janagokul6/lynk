process.env.RATE_LIMIT_AUTH_MAX = "3";
process.env.RATE_LIMIT_WINDOW_MS = "900000";

import path from "node:path";
import { fileURLToPath } from "node:url";
import pg from "pg";
import request from "supertest";
import { beforeAll, describe, expect, it } from "vitest";
import type { Express } from "express";

const ORIGIN = "http://localhost:43123";

describe("credential rate limit", () => {
  let app: Express;

  beforeAll(async () => {
    process.env.RATE_LIMIT_AUTH_MAX = "3";
    process.env.RATE_LIMIT_WINDOW_MS = "900000";
    const [{ default: loaded }, { migrate }, { db }] = await Promise.all([
      import("../app.js"),
      import("drizzle-orm/node-postgres/migrator"),
      import("../lib/db.js"),
    ]);
    app = loaded;
    const client = new pg.Client({ connectionString: process.env.DATABASE_URL });
    await client.connect();
    await client.query("CREATE EXTENSION IF NOT EXISTS vector");
    await client.end();
    const migrationsFolder = path.join(path.dirname(fileURLToPath(import.meta.url)), "../drizzle");
    await migrate(db, { migrationsFolder });
  });

  it("keeps get-session available after repeated reads while sign-in attempts hit 429", async () => {
    const agent = request.agent(app);
    const email = `rate-${Date.now()}@example.com`;
    const created = await agent
      .post("/api/auth/sign-up/email")
      .set("Origin", ORIGIN)
      .send({ name: "Rate", email, password: "password123", role: "brand" });
    expect(created.status).toBe(200);

    for (let i = 0; i < 6; i += 1) {
      const session = await agent.get("/api/auth/get-session").set("Origin", ORIGIN);
      expect(session.status).not.toBe(429);
      expect(session.body?.user?.email).toBe(email);
    }

    const first = await request(app)
      .post("/api/auth/sign-in/email")
      .set("Origin", ORIGIN)
      .send({ email, password: "wrong-password" });
    const second = await request(app)
      .post("/api/auth/sign-in/email")
      .set("Origin", ORIGIN)
      .send({ email, password: "wrong-password" });
    const third = await request(app)
      .post("/api/auth/sign-in/email")
      .set("Origin", ORIGIN)
      .send({ email, password: "wrong-password" });

    expect(first.status).not.toBe(429);
    expect(second.status).not.toBe(429);
    expect(third.status).toBe(429);

    const still = await agent.get("/api/auth/get-session").set("Origin", ORIGIN);
    expect(still.status).not.toBe(429);
    expect(still.body?.user?.email).toBe(email);
  });
});
