import { eq } from "drizzle-orm";
import { env } from "../config/env.js";
import { db } from "./db.js";
import { notification, user } from "../db/schema.js";
import { sendMail } from "./mailer.js";

export function safeAppPath(href: string | undefined): string | null {
  if (!href) return null;
  if (!href.startsWith("/") || href.startsWith("//") || href.includes("\\") || href.includes("://")) return null;
  return href.slice(0, 1024);
}

export async function notifyUser(input: {
  userId: string;
  type: string;
  title: string;
  body: string;
  href?: string;
  email?: boolean;
}): Promise<void> {
  const href = safeAppPath(input.href);
  await db.insert(notification).values({
    userId: input.userId,
    type: input.type,
    title: input.title,
    body: input.body,
    href,
  });
  if (!input.email) return;
  const [account] = await db
    .select({ email: user.email })
    .from(user)
    .where(eq(user.id, input.userId))
    .limit(1);
  if (!account?.email) return;
  const link = href ? new URL(href, env.CLIENT_ORIGIN).toString() : "";
  await sendMail({
    to: account.email,
    subject: input.title,
    text: `${input.body}${link ? `\n\nOpen: ${link}` : ""}`,
  });
}
