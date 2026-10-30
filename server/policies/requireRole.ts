import type { NextFunction, Request, Response } from "express";
import type { UserRole } from "@lynk/shared";
import { requireSession, type AuthedRequest } from "./requireSession.js";

function readRole(session: AuthedRequest["session"]): UserRole | undefined {
  const user = session.user as { role?: UserRole };
  return user.role;
}

export function requireRole(...roles: UserRole[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    void requireSession(req, res, () => {
      const role = readRole((req as AuthedRequest).session);
      if (!role || !roles.includes(role)) {
        res.status(403).json({ error: "Forbidden" });
        return;
      }
      next();
    });
  };
}
