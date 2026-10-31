import { z } from "zod";

export const selfServeRoleSchema = z.enum(["brand", "influencer"]);
export type SelfServeRole = z.infer<typeof selfServeRoleSchema>;

export const updateRoleSchema = z.object({
  role: selfServeRoleSchema,
});
export type UpdateRoleInput = z.infer<typeof updateRoleSchema>;
