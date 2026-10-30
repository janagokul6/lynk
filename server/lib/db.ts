import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "../db/schema.js";
import { env } from "../config/env.js";

const globalForDb = globalThis as unknown as { db: ReturnType<typeof drizzle> };

const pool = new Pool({
  connectionString: env.DATABASE_URL,
});

export const db =
  globalForDb.db ??
  drizzle(pool, {
    schema,
    logger: process.env.NODE_ENV === "development",
  });

if (process.env.NODE_ENV !== "production") {
  globalForDb.db = db;
}
