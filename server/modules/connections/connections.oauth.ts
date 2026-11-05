import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";
import type { Request, Response } from "express";
import { fromNodeHeaders } from "better-auth/node";
import { and, eq, gt } from "drizzle-orm";
import { env } from "../../config/env.js";
import { auth } from "../../lib/auth.js";
import { db } from "../../lib/db.js";
import { cache, user } from "../../db/schema.js";
import { upsertCreator } from "../creators/creators.service.js";
import { upsertConnection } from "./connections.service.js";

type OAuthState = { userId: string; platform: string; nonce: string };

function verifyState(state: string): OAuthState | null {
  const [body, sig] = state.split(".");
  if (!body || !sig) return null;
  const expected = createHmac("sha256", env.BETTER_AUTH_SECRET).update(body).digest("base64url");
  const left = Buffer.from(sig);
  const right = Buffer.from(expected);
  if (left.length !== right.length || !timingSafeEqual(left, right)) return null;
  try {
    const parsed = JSON.parse(Buffer.from(body, "base64url").toString()) as {
      userId?: string;
      platform?: string;
      exp?: number;
      nonce?: string;
    };
    if (!parsed.userId || !parsed.platform || !parsed.nonce || !parsed.exp || parsed.exp < Date.now()) return null;
    return { userId: parsed.userId, platform: parsed.platform, nonce: parsed.nonce };
  } catch {
    return null;
  }
}

export async function issueOAuthState(userId: string, platform: string): Promise<string> {
  const nonce = randomBytes(16).toString("base64url");
  const exp = Date.now() + 10 * 60 * 1000;
  const body = Buffer.from(JSON.stringify({ userId, platform, exp, nonce })).toString("base64url");
  const sig = createHmac("sha256", env.BETTER_AUTH_SECRET).update(body).digest("base64url");
  await db.insert(cache).values({
    key: `oauth:${nonce}`,
    value: `${userId}:${platform}`,
    expiresAt: new Date(exp),
  });
  return `${body}.${sig}`;
}

export async function consumeOAuthState(state: string): Promise<{ userId: string; platform: string } | null> {
  const parsed = verifyState(state);
  if (!parsed) return null;
  const [row] = await db
    .delete(cache)
    .where(and(eq(cache.key, `oauth:${parsed.nonce}`), gt(cache.expiresAt, new Date())))
    .returning();
  if (!row || row.value !== `${parsed.userId}:${parsed.platform}`) return null;
  return { userId: parsed.userId, platform: parsed.platform };
}

function finish(res: Response, platform: string, error?: string) {
  const url = new URL("/influencer/profile", env.CLIENT_ORIGIN);
  if (error) url.searchParams.set("connectError", error);
  else url.searchParams.set("connected", platform);
  res.redirect(url.toString());
}

async function sessionUserId(req: Request): Promise<string | null> {
  const session = await auth.api.getSession({ headers: fromNodeHeaders(req.headers) });
  return session?.user?.id ?? null;
}

async function influencerId(req: Request): Promise<string | null> {
  const userId = await sessionUserId(req);
  if (!userId) return null;
  const [account] = await db
    .select({ role: user.role, roleChosenAt: user.roleChosenAt })
    .from(user)
    .where(eq(user.id, userId))
    .limit(1);
  if (!account || account.role !== "influencer" || !account.roleChosenAt) return null;
  return userId;
}

export function youtubeConfigured(): boolean {
  return Boolean(env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET);
}

export function instagramConfigured(): boolean {
  return Boolean(env.META_APP_ID && env.META_APP_SECRET);
}

export async function startYoutube(req: Request, res: Response): Promise<void> {
  if (!(await sessionUserId(req))) {
    res.redirect(`${env.CLIENT_ORIGIN}/login`);
    return;
  }
  const userId = await influencerId(req);
  if (!userId) {
    finish(res, "youtube", "forbidden");
    return;
  }
  if (!youtubeConfigured()) {
    finish(res, "youtube", "not_configured");
    return;
  }
  const redirectUri = `${env.BETTER_AUTH_URL}/api/connections/youtube/callback`;
  const url = new URL("https://accounts.google.com/o/oauth2/v2/auth");
  url.searchParams.set("client_id", env.GOOGLE_CLIENT_ID!);
  url.searchParams.set("redirect_uri", redirectUri);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("scope", "https://www.googleapis.com/auth/youtube.readonly");
  url.searchParams.set("access_type", "offline");
  url.searchParams.set("include_granted_scopes", "true");
  url.searchParams.set("prompt", "consent");
  url.searchParams.set("state", await issueOAuthState(userId, "youtube"));
  res.redirect(url.toString());
}

export async function youtubeCallback(req: Request, res: Response): Promise<void> {
  const userId = await influencerId(req);
  const state = await consumeOAuthState(String(req.query.state ?? ""));
  if (!userId || !state || state.userId !== userId || state.platform !== "youtube") {
    finish(res, "youtube", "session");
    return;
  }
  if (!youtubeConfigured()) {
    finish(res, "youtube", "not_configured");
    return;
  }
  const code = String(req.query.code ?? "");
  if (!code) {
    finish(res, "youtube", "denied");
    return;
  }
  try {
    const redirectUri = `${env.BETTER_AUTH_URL}/api/connections/youtube/callback`;
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: env.GOOGLE_CLIENT_ID!,
        client_secret: env.GOOGLE_CLIENT_SECRET!,
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
      }),
    });
    if (!tokenResponse.ok) {
      finish(res, "youtube", "exchange_failed");
      return;
    }
    const token = (await tokenResponse.json()) as {
      access_token?: string;
      refresh_token?: string;
      scope?: string;
    };
    if (!token.access_token) {
      finish(res, "youtube", "exchange_failed");
      return;
    }
    const channelResponse = await fetch(
      "https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&mine=true",
      { headers: { Authorization: `Bearer ${token.access_token}` } }
    );
    const channelJson = (await channelResponse.json()) as {
      items?: { id: string; snippet?: { title?: string; customUrl?: string }; statistics?: { subscriberCount?: string } }[];
    };
    const channel = channelJson.items?.[0];
    if (!channel) {
      finish(res, "youtube", "no_channel");
      return;
    }
    const handle = channel.snippet?.customUrl?.replace(/^@/, "") || channel.snippet?.title || channel.id;
    await upsertConnection(userId, {
      platform: "youtube",
      externalAccountId: channel.id,
      handle,
      accessToken: token.access_token,
      refreshToken: token.refresh_token,
      scopes: token.scope,
    });
    await upsertCreator({
      platform: "youtube",
      externalId: channel.id,
      handle,
      displayName: channel.snippet?.title || handle,
      followerCount: Number(channel.statistics?.subscriberCount ?? 0) || null,
      niches: ["youtube"],
      userId,
    });
    finish(res, "youtube");
  } catch {
    finish(res, "youtube", "exchange_failed");
  }
}

export async function startInstagram(req: Request, res: Response): Promise<void> {
  if (!(await sessionUserId(req))) {
    res.redirect(`${env.CLIENT_ORIGIN}/login`);
    return;
  }
  const userId = await influencerId(req);
  if (!userId) {
    finish(res, "instagram", "forbidden");
    return;
  }
  if (!instagramConfigured()) {
    finish(res, "instagram", "not_configured");
    return;
  }
  const redirectUri = `${env.BETTER_AUTH_URL}/api/connections/instagram/callback`;
  const url = new URL("https://www.instagram.com/oauth/authorize");
  url.searchParams.set("client_id", env.META_APP_ID!);
  url.searchParams.set("redirect_uri", redirectUri);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("scope", "instagram_business_basic");
  url.searchParams.set("state", await issueOAuthState(userId, "instagram"));
  res.redirect(url.toString());
}

export async function instagramCallback(req: Request, res: Response): Promise<void> {
  const userId = await influencerId(req);
  const state = await consumeOAuthState(String(req.query.state ?? ""));
  if (!userId || !state || state.userId !== userId || state.platform !== "instagram") {
    finish(res, "instagram", "session");
    return;
  }
  if (!instagramConfigured()) {
    finish(res, "instagram", "not_configured");
    return;
  }
  const code = String(req.query.code ?? "");
  if (!code) {
    finish(res, "instagram", "denied");
    return;
  }
  try {
    const redirectUri = `${env.BETTER_AUTH_URL}/api/connections/instagram/callback`;
    const tokenResponse = await fetch("https://api.instagram.com/oauth/access_token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: env.META_APP_ID!,
        client_secret: env.META_APP_SECRET!,
        grant_type: "authorization_code",
        redirect_uri: redirectUri,
        code,
      }),
    });
    if (!tokenResponse.ok) {
      finish(res, "instagram", "exchange_failed");
      return;
    }
    const token = (await tokenResponse.json()) as { access_token?: string; user_id?: string | number };
    if (!token.access_token) {
      finish(res, "instagram", "exchange_failed");
      return;
    }
    const meResponse = await fetch(
      `https://graph.instagram.com/me?fields=user_id,username,name,followers_count&access_token=${encodeURIComponent(token.access_token)}`
    );
    const me = (await meResponse.json()) as {
      user_id?: string;
      id?: string;
      username?: string;
      name?: string;
      followers_count?: number;
    };
    const externalId = String(me.user_id || me.id || token.user_id || "");
    const handle = me.username || externalId;
    if (!externalId) {
      finish(res, "instagram", "no_account");
      return;
    }
    await upsertConnection(userId, {
      platform: "instagram",
      externalAccountId: externalId,
      handle,
      accessToken: token.access_token,
      scopes: "instagram_business_basic",
    });
    await upsertCreator({
      platform: "instagram",
      externalId,
      handle,
      displayName: me.name || handle,
      followerCount: me.followers_count ?? null,
      niches: ["instagram"],
      userId,
    });
    finish(res, "instagram");
  } catch {
    finish(res, "instagram", "exchange_failed");
  }
}
