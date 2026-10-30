import { eq } from "drizzle-orm";
import { db } from "./db.js";
import { cache } from "../db/schema.js";

export class CacheService {
  async get<T>(key: string): Promise<T | null> {
    const [entry] = await db.select().from(cache).where(eq(cache.key, key));
    if (!entry || entry.expiresAt < new Date()) {
      if (entry) {
        await db.delete(cache).where(eq(cache.key, key)).catch(() => {});
      }
      return null;
    }
    try {
      return JSON.parse(entry.value) as T;
    } catch {
      return entry.value as unknown as T;
    }
  }

  async set(key: string, value: unknown, ttlSeconds: number): Promise<void> {
    const valueStr = typeof value === "string" ? value : JSON.stringify(value);
    const expiresAt = new Date(Date.now() + ttlSeconds * 1000);

    await db
      .insert(cache)
      .values({ key, value: valueStr, expiresAt })
      .onConflictDoUpdate({
        target: cache.key,
        set: { value: valueStr, expiresAt },
      });
  }

  async del(key: string): Promise<void> {
    await db.delete(cache).where(eq(cache.key, key)).catch(() => {});
  }
}

export const cacheService = new CacheService();
