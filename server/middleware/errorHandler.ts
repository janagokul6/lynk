import type { Request, Response, NextFunction } from "express";
import { logger } from "../utils/logger.js";

export function errorHandler(
  err: Error & { statusCode?: number },
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  const statusCode = err.statusCode ?? 500;
  const message = err.message ?? "Internal Server Error";

  logger.error("Request error", { error: err.message, stack: err.stack, statusCode });

  res.status(statusCode).json({
    error: message,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
}
