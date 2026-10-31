import type { NextFunction, Request, Response } from "express";
import type { UserRole } from "@lynk/shared";
import { requireSession, type AuthedRequest } from "./requireSession.js";

function readRole(session: AuthedRequest["session"]): UserRole | undefined {
  const user = session.user as { role?: UserRole };
  return user.role;
}

export function requireRole(...roles: UserRole[]) {
  return (req: Request, res: Response, next: NextFunction): Promise<void> => {
    return requireSession(req, res, (err?: unknown) => {
      if (err) {
        next(err instanceof Error ? err : new Error("Unauthorized"));
        return;
      }
      if (res.headersSent) return;
      try {
        const role = readRole((req as AuthedRequest).session);
        if (!role || !roles.includes(role)) {
          res.status(403).json({ error: "Forbidden" });
          return;
        }
        next();
      } catch (error) {
        next(error instanceof Error ? error : new Error("Forbidden"));
      }
    }).catch((error: unknown) => {
      next(error instanceof Error ? error : new Error("Forbidden"));
    });
  };
}
