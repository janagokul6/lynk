import { z } from "zod";

export const userPlanSchema = z.enum(["free", "pro"]);
export type UserPlan = z.infer<typeof userPlanSchema>;

export function normalizePlan(value: unknown): UserPlan {
  return value === "pro" ? "pro" : "free";
}

/** Pro accounts see chat and the dashboard together on wide screens. */
export function sideBySideForPlan(plan: UserPlan): boolean {
  return plan === "pro";
}
