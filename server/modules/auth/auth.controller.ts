import type { Request, Response } from "express";
import { fromNodeHeaders } from "better-auth/node";
import { normalizePlan, updateRoleSchema } from "@lynk/shared";
import { and, eq, isNull, ne } from "drizzle-orm";
import { auth } from "../../lib/auth.js";
import { db } from "../../lib/db.js";
import {
  application,
  brandProfile,
  campaign,
  influencerProfile,
  notification,
  socialConnection,
  user,
} from "../../db/schema.js";
import type { AuthedRequest } from "../../policies/requireSession.js";

export async function getSession(req: Request, res: Response): Promise<void> {
  const session = await auth.api.getSession({
    headers: fromNodeHeaders(req.headers),
  });
  if (!session) {
    res.json(null);
    return;
  }

  const { token: _token, ...sessionFields } = session.session;
  const [account] = await db
    .select({ plan: user.plan, role: user.role, roleChosenAt: user.roleChosenAt })
    .from(user)
    .where(eq(user.id, session.user.id))
    .limit(1);
  res.json({
    user: {
      ...session.user,
      role: account?.role ?? session.user.role,
      plan: normalizePlan(account?.plan),
      roleChosenAt: account?.roleChosenAt?.toISOString() ?? null,
    },
    session: sessionFields,
  });
}

export async function updateRole(req: Request, res: Response): Promise<void> {
  const { userId } = req as AuthedRequest;
  const parsed = updateRoleSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Validation failed", details: parsed.error.flatten() });
    return;
  }

  const [current] = await db
    .select({
      id: user.id,
      role: user.role,
      roleChosenAt: user.roleChosenAt,
      email: user.email,
      name: user.name,
    })
    .from(user)
    .where(eq(user.id, userId));

  if (!current) {
    res.status(404).json({ error: "Not found" });
    return;
  }
  if (current.role === "admin") {
    res.status(403).json({ error: "Forbidden" });
    return;
  }
  if (current.roleChosenAt) {
    res.status(409).json({ error: "Role can only be chosen once" });
    return;
  }

  const [row] = await db
    .update(user)
    .set({ role: parsed.data.role, roleChosenAt: new Date(), updatedAt: new Date() })
    .where(and(eq(user.id, userId), isNull(user.roleChosenAt), ne(user.role, "admin")))
    .returning({
      id: user.id,
      role: user.role,
      email: user.email,
      name: user.name,
    });

  if (!row) {
    res.status(409).json({ error: "Role can only be chosen once" });
    return;
  }

  res.json({ id: row.id, role: row.role, email: row.email, name: row.name });
}

export async function exportAccount(req: Request, res: Response): Promise<void> {
  const { userId } = req as AuthedRequest;
  const [account] = await db.select().from(user).where(eq(user.id, userId)).limit(1);
  if (!account) {
    res.status(404).json({ error: "Not found" });
    return;
  }
  const [brand, influencer, campaigns, applications, connections, notifications] = await Promise.all([
    db.select().from(brandProfile).where(eq(brandProfile.userId, userId)),
    db.select().from(influencerProfile).where(eq(influencerProfile.userId, userId)),
    db.select().from(campaign).where(eq(campaign.userId, userId)),
    db.select().from(application).where(eq(application.influencerId, userId)),
    db
      .select({
        platform: socialConnection.platform,
        handle: socialConnection.handle,
        externalAccountId: socialConnection.externalAccountId,
      })
      .from(socialConnection)
      .where(eq(socialConnection.userId, userId)),
    db.select({
      type: notification.type,
      title: notification.title,
      body: notification.body,
      createdAt: notification.createdAt,
    }).from(notification).where(eq(notification.userId, userId)),
  ]);
  res.json({
    exportedAt: new Date().toISOString(),
    user: {
      id: account.id,
      name: account.name,
      email: account.email,
      role: account.role,
      plan: account.plan,
      emailVerified: account.emailVerified,
      createdAt: account.createdAt,
    },
    brand: brand[0] ?? null,
    influencer: influencer[0] ?? null,
    campaigns,
    applications,
    connections,
    notifications,
  });
}
