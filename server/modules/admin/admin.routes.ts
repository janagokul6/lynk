import { Router } from "express";
import { count, desc, eq } from "drizzle-orm";
import type { Request, Response } from "express";
import { requireRole } from "../../policies/requireRole.js";
import { db } from "../../lib/db.js";
import { application, campaign, user } from "../../db/schema.js";

export const adminRouter = Router();

adminRouter.use(requireRole("admin"));

adminRouter.get("/summary", async (_req: Request, res: Response) => {
  const [users, campaigns, applications, unverified] = await Promise.all([
    db.select({ value: count() }).from(user),
    db.select({ value: count() }).from(campaign),
    db.select({ value: count() }).from(application),
    db.select({ value: count() }).from(user).where(eq(user.emailVerified, false)),
  ]);
  res.json({
    users: Number(users[0]?.value ?? 0),
    campaigns: Number(campaigns[0]?.value ?? 0),
    applications: Number(applications[0]?.value ?? 0),
    unverified: Number(unverified[0]?.value ?? 0),
    fraudSignals: null,
    note: "Lynk does not score follower authenticity yet.",
  });
});

adminRouter.get("/users", async (_req: Request, res: Response) => {
  const rows = await db
    .select({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      plan: user.plan,
      emailVerified: user.emailVerified,
      createdAt: user.createdAt,
    })
    .from(user)
    .orderBy(desc(user.createdAt))
    .limit(100);
  res.json({
    users: rows.map((row) => ({ ...row, createdAt: row.createdAt.toISOString() })),
  });
});
