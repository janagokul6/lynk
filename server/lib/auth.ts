import { betterAuth } from "better-auth";
import { APIError } from "better-auth/api";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "./db.js";
import * as schema from "../db/schema.js";
import { env } from "../config/env.js";

const googleEnabled = Boolean(env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET);
const SELF_SERVE_ROLES = new Set(["brand", "influencer"]);

function readRequestedRole(context: { body?: unknown } | null): string | undefined {
  const body = context?.body;
  if (!body || typeof body !== "object") return undefined;
  const role = (body as { role?: unknown }).role;
  return typeof role === "string" && role.length > 0 ? role : undefined;
}

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      user: schema.user,
      session: schema.session,
      account: schema.account,
      verification: schema.verification,
    },
  }),
  emailAndPassword: {
    enabled: true,
  },
  trustedOrigins: [env.CLIENT_ORIGIN],
  socialProviders: googleEnabled
    ? {
        google: {
          clientId: env.GOOGLE_CLIENT_ID!,
          clientSecret: env.GOOGLE_CLIENT_SECRET!,
        },
      }
    : {},
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: true,
        defaultValue: "brand",
        input: false,
      },
      plan: {
        type: "string",
        required: true,
        defaultValue: "free",
        input: false,
      },
    },
  },
  databaseHooks: {
    user: {
      create: {
        before: async (user, context) => {
          const requested = readRequestedRole(context);
          if (!requested) {
            return { data: { ...user, role: "brand", plan: "free" } };
          }
          if (!SELF_SERVE_ROLES.has(requested)) {
            throw APIError.from("BAD_REQUEST", {
              code: "INVALID_ROLE",
              message: "Role must be brand or influencer",
            });
          }
          return { data: { ...user, role: requested, plan: "free" } };
        },
      },
    },
  },
  basePath: "/api/auth",
});
