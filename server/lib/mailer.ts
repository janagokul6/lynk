import { env } from "../config/env.js";
import { logger } from "../utils/logger.js";

export type OutboundMail = {
  to: string;
  subject: string;
  text: string;
  html?: string;
  createdAt: string;
};

const mailbox: OutboundMail[] = [];

export function recentMail(email?: string): OutboundMail[] {
  const rows = email ? mailbox.filter((item) => item.to.toLowerCase() === email.toLowerCase()) : mailbox;
  return rows.slice(-20);
}

export function clearMailbox(): void {
  mailbox.length = 0;
}

export function devMailboxEnabled(nodeEnv: string = env.NODE_ENV): boolean {
  return nodeEnv !== "production";
}

export function mailLogFields(
  mail: { to: string; subject: string; text: string },
  nodeEnv: string = env.NODE_ENV
): { to: string; subject: string; text?: string } {
  if (nodeEnv === "production") return { to: mail.to, subject: mail.subject };
  return { to: mail.to, subject: mail.subject, text: mail.text };
}

async function sendResend(mail: OutboundMail): Promise<void> {
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: env.MAIL_FROM,
      to: [mail.to],
      subject: mail.subject,
      text: mail.text,
      html: mail.html,
    }),
  });
  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Resend failed (${response.status}): ${body.slice(0, 200)}`);
  }
}

async function sendSmtp(mail: OutboundMail): Promise<void> {
  const nodemailer = await import("nodemailer");
  const transport = nodemailer.createTransport(env.SMTP_URL);
  await transport.sendMail({
    from: env.MAIL_FROM,
    to: mail.to,
    subject: mail.subject,
    text: mail.text,
    html: mail.html,
  });
}

export async function sendMail(input: { to: string; subject: string; text: string; html?: string }): Promise<void> {
  const mail: OutboundMail = { ...input, createdAt: new Date().toISOString() };
  if (devMailboxEnabled()) {
    mailbox.push(mail);
    if (mailbox.length > 100) mailbox.shift();
  }
  const transport = env.RESEND_API_KEY ? "resend" : env.SMTP_URL ? "smtp" : "console";
  logger.info("mail", { ...mailLogFields(mail), transport });
  if (!env.RESEND_API_KEY && !env.SMTP_URL) {
    return;
  }
  try {
    if (env.RESEND_API_KEY) {
      await sendResend(mail);
      return;
    }
    await sendSmtp(mail);
  } catch (err) {
    logger.error("mail delivery failed", { error: err instanceof Error ? err.message : String(err) });
  }
}
