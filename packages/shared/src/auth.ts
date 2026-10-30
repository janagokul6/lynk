import { z } from "zod";
import { userRoleSchema } from "./roles.js";

export const updateRoleSchema = z.object({
  role: userRoleSchema,
});
export type UpdateRoleInput = z.infer<typeof updateRoleSchema>;
