import type { NextFunction, Request, Response } from "express";
import { rateLimit } from "express-rate-limit";
import { env } from "../config/env.js";

const CREDENTIAL_AUTH_PREFIXES = [
  "/api/auth/sign-in",
  "/api/auth/sign-up",
  "/api/auth/forget-password",
  "/api/auth/reset-password",
  "/api/auth/request-password-reset",
  "/api/auth/change-password",
  "/api/auth/change-email",
  "/api/auth/send-verification-email",
  "/api/auth/verify-email",
];

export function isCredentialAuthPath(path: string): boolean {
  return CREDENTIAL_AUTH_PREFIXES.some((prefix) => path === prefix || path.startsWith(`${prefix}/`));
}

export const generalLimiter = rateLimit({
  windowMs: env.RATE_LIMIT_WINDOW_MS,
  limit: env.RATE_LIMIT_MAX,
  standardHeaders: true,
  legacyHeaders: false,
});

export const authLimiter = rateLimit({
  windowMs: env.RATE_LIMIT_WINDOW_MS,
  limit: env.RATE_LIMIT_AUTH_MAX,
  standardHeaders: true,
  legacyHeaders: false,
});

export function rateLimitByRoute(req: Request, res: Response, next: NextFunction): void {
  if (isCredentialAuthPath(req.path)) {
    void authLimiter(req, res, next);
    return;
  }
  void generalLimiter(req, res, next);
}
