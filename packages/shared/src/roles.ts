import { z } from "zod";

export const userRoleSchema = z.enum(["brand", "influencer", "admin"]);
export type UserRole = z.infer<typeof userRoleSchema>;

export const USER_ROLES = userRoleSchema.options;
