import { eq } from "drizzle-orm";
import { betterAuth } from "better-auth";
import { APIError } from "better-auth/api";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "./db.js";
import * as schema from "../db/schema.js";
import { env } from "../config/env.js";
import { sendMail } from "./mailer.js";
import { purgeUserOwnedData } from "./account-deletion.js";

const googleEnabled = Boolean(env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET);
const SELF_SERVE_ROLES = new Set(["brand", "influencer"]);
const explicitRoleEmails = new Set<string>();

export function roleForSignup(requested: string | undefined): { role: "brand" | "influencer"; lock: boolean } | null {
  if (!requested) return { role: "brand", lock: false };
  if (!SELF_SERVE_ROLES.has(requested)) return null;
  return { role: requested as "brand" | "influencer", lock: true };
}

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
    sendResetPassword: async ({ user, url }) => {
      await sendMail({
        to: user.email,
        subject: "Reset your Lynk password",
        text: `Reset your Lynk password:\n${url}\n\nIf you did not ask for this, you can ignore this email.`,
      });
    },
  },
  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, url }) => {
      await sendMail({
        to: user.email,
        subject: "Verify your Lynk email",
        text: `Verify your email for Lynk:\n${url}`,
      });
    },
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
      roleChosenAt: {
        type: "date",
        required: false,
        input: false,
      },
    },
    deleteUser: {
      enabled: true,
      beforeDelete: async (account: { id: string; email?: string | null }) => {
        await purgeUserOwnedData(account.id, account.email);
      },
    },
  },
  databaseHooks: {
    user: {
      create: {
        before: async (user, context) => {
          const decision = roleForSignup(readRequestedRole(context));
          if (!decision) {
            throw APIError.from("BAD_REQUEST", {
              code: "INVALID_ROLE",
              message: "Role must be brand or influencer",
            });
          }
          if (decision.lock && user.email) explicitRoleEmails.add(user.email.toLowerCase());
          return {
            data: {
              ...user,
              role: decision.role,
              plan: "free",
              roleChosenAt: decision.lock ? new Date() : null,
            },
          };
        },
        after: async (created) => {
          const email = created?.email?.toLowerCase();
          if (!created?.id || !email || !explicitRoleEmails.delete(email)) return;
          await db
            .update(schema.user)
            .set({ roleChosenAt: new Date() })
            .where(eq(schema.user.id, created.id));
        },
        delete: {
          before: async (account: { id: string; email?: string | null }) => {
            await purgeUserOwnedData(account.id, account.email);
          },
        },
      },
    },
  },
  basePath: "/api/auth",
});
