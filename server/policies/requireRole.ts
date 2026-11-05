import type { NextFunction, Request, Response } from "express";
import { eq } from "drizzle-orm";
import type { UserRole } from "@lynk/shared";
import { db } from "../lib/db.js";
import { user } from "../db/schema.js";
import { requireSession, type AuthedRequest } from "./requireSession.js";

export function requireRole(...roles: UserRole[]) {
  return (req: Request, res: Response, next: NextFunction): Promise<void> => {
    return requireSession(req, res, (err?: unknown) => {
      if (err) {
        next(err instanceof Error ? err : new Error("Unauthorized"));
        return;
      }
      if (res.headersSent) return;
      void authorize(req as AuthedRequest, res, next, roles);
    }).catch((error: unknown) => {
      next(error instanceof Error ? error : new Error("Forbidden"));
    });
  };
}

async function authorize(
  req: AuthedRequest,
  res: Response,
  next: NextFunction,
  roles: UserRole[]
): Promise<void> {
  try {
    const [account] = await db
      .select({ role: user.role, roleChosenAt: user.roleChosenAt })
      .from(user)
      .where(eq(user.id, req.userId))
      .limit(1);
    if (!account) {
      res.status(403).json({ error: "Forbidden" });
      return;
    }
    if (account.role !== "admin" && !account.roleChosenAt) {
      res.status(403).json({ error: "Choose a role first" });
      return;
    }
    if (!roles.includes(account.role as UserRole)) {
      res.status(403).json({ error: "Forbidden" });
      return;
    }
    next();
  } catch (error) {
    next(error instanceof Error ? error : new Error("Forbidden"));
  }
}
