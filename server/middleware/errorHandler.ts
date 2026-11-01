import type { Request, Response, NextFunction } from "express";
import { env } from "../config/env.js";
import { logger } from "../utils/logger.js";

type HttpError = Error & { statusCode?: number; status?: number };

export function errorHandler(
  err: HttpError,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  const rawStatus = err.statusCode ?? err.status;
  const statusCode = typeof rawStatus === "number" && rawStatus >= 400 && rawStatus < 600 ? rawStatus : 500;
  const isServerError = statusCode >= 500;

  logger.error("Request error", {
    error: err.message,
    statusCode,
    ...(env.NODE_ENV === "development" ? { stack: err.stack } : {}),
  });

  res.status(statusCode).json({
    error: isServerError ? "Internal Server Error" : err.message || "Request failed",
  });
}
