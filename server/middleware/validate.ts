import type { Request, Response, NextFunction } from "express";
import type { z } from "zod";

type SchemaSource = "body" | "query" | "params";

export function validate(
  schema: z.ZodSchema,
  source: SchemaSource = "body"
) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const data = req[source];
    const result = schema.safeParse(data);

    if (!result.success) {
      res.status(400).json({
        error: "Validation failed",
        details: result.error.flatten().fieldErrors,
      });
      return;
    }

    (req as Request & { [key: string]: unknown })[`validated${source.charAt(0).toUpperCase() + source.slice(1)}`] =
      result.data;
    next();
  };
}
