import { eq } from "drizzle-orm";
import { db } from "./db.js";
import { notification, user } from "../db/schema.js";
import { sendMail } from "./mailer.js";

export async function notifyUser(input: {
  userId: string;
  type: string;
  title: string;
  body: string;
  href?: string;
  email?: boolean;
}): Promise<void> {
  await db.insert(notification).values({
    userId: input.userId,
    type: input.type,
    title: input.title,
    body: input.body,
    href: input.href ?? null,
  });
  if (!input.email) return;
  const [account] = await db
    .select({ email: user.email })
    .from(user)
    .where(eq(user.id, input.userId))
    .limit(1);
  if (!account?.email) return;
  await sendMail({
    to: account.email,
    subject: input.title,
    text: `${input.body}${input.href ? `\n\nOpen: ${input.href}` : ""}`,
  });
}
