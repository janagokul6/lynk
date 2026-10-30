import type { Request, Response } from "express";
import { fromNodeHeaders } from "better-auth/node";
import { updateRoleSchema } from "@lynk/shared";
import { eq } from "drizzle-orm";
import { auth } from "../../lib/auth.js";
import { db } from "../../lib/db.js";
import { user } from "../../db/schema.js";
import type { AuthedRequest } from "../../policies/requireSession.js";

export async function getSession(req: Request, res: Response): Promise<void> {
  const session = await auth.api.getSession({
    headers: fromNodeHeaders(req.headers),
  });
  res.json(session);
}

export async function updateRole(req: Request, res: Response): Promise<void> {
  const { userId } = req as AuthedRequest;
  const parsed = updateRoleSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Validation failed", details: parsed.error.flatten() });
    return;
  }

  const [row] = await db
    .update(user)
    .set({ role: parsed.data.role, updatedAt: new Date() })
    .where(eq(user.id, userId))
    .returning();

  res.json({ id: row.id, role: row.role, email: row.email, name: row.name });
}
