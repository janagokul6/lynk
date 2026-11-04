import { z } from "zod";

export const selfServeRoleSchema = z.enum(["brand", "influencer"]);
export type SelfServeRole = z.infer<typeof selfServeRoleSchema>;

export const updateRoleSchema = z.object({
  role: selfServeRoleSchema,
});
export type UpdateRoleInput = z.infer<typeof updateRoleSchema>;

export function homePathForRole(role: string | null | undefined): string {
  if (role === "brand") return "/brand/dashboard";
  if (role === "influencer") return "/influencer/dashboard";
  if (role === "admin") return "/admin/dashboard";
  return "/role";
}
