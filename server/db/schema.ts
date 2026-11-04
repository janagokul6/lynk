import {
  pgTable,
  varchar,
  text,
  boolean,
  timestamp,
  uniqueIndex,
  uuid,
  jsonb,
  numeric,
  integer,
  date,
  index,
  customType,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import type { UserPlan, UserRole } from "@lynk/shared";

const vector1536 = customType<{ data: number[]; driverData: string }>({
  dataType() {
    return "vector(1536)";
  },
  toDriver(value: number[]): string {
    return `[${value.join(",")}]`;
  },
  fromDriver(value: string): number[] {
    return value
      .replace(/^\[/, "")
      .replace(/\]$/, "")
      .split(",")
      .filter(Boolean)
      .map(Number);
  },
});

export const user = pgTable(
  "user",
  {
    id: varchar("id", { length: 255 }).primaryKey(),
    name: varchar("name", { length: 255 }).notNull(),
    email: varchar("email", { length: 255 }).notNull(),
    emailVerified: boolean("emailVerified").notNull(),
    image: varchar("image", { length: 255 }),
    role: varchar("role", { length: 32 }).$type<UserRole>().notNull().default("brand"),
    plan: varchar("plan", { length: 16 }).$type<UserPlan>().notNull().default("free"),
    roleChosenAt: timestamp("roleChosenAt"),
    createdAt: timestamp("createdAt").notNull(),
    updatedAt: timestamp("updatedAt").notNull(),
  },
  (table) => [uniqueIndex("user_email_unique").on(table.email)]
);

export const session = pgTable(
  "session",
  {
    id: varchar("id", { length: 255 }).primaryKey(),
    expiresAt: timestamp("expiresAt").notNull(),
    token: varchar("token", { length: 255 }).notNull(),
    createdAt: timestamp("createdAt").notNull(),
    updatedAt: timestamp("updatedAt").notNull(),
    ipAddress: varchar("ipAddress", { length: 255 }),
    userAgent: varchar("userAgent", { length: 255 }),
    userId: varchar("userId", { length: 255 })
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
  },
  (table) => [uniqueIndex("session_token_unique").on(table.token)]
);

export const account = pgTable("account", {
  id: varchar("id", { length: 255 }).primaryKey(),
  accountId: varchar("accountId", { length: 255 }).notNull(),
  providerId: varchar("providerId", { length: 255 }).notNull(),
  userId: varchar("userId", { length: 255 })
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("accessToken"),
  refreshToken: text("refreshToken"),
  idToken: text("idToken"),
  accessTokenExpiresAt: timestamp("accessTokenExpiresAt"),
  refreshTokenExpiresAt: timestamp("refreshTokenExpiresAt"),
  scope: text("scope"),
  password: varchar("password", { length: 255 }),
  createdAt: timestamp("createdAt").notNull(),
  updatedAt: timestamp("updatedAt").notNull(),
});

export const verification = pgTable("verification", {
  id: varchar("id", { length: 255 }).primaryKey(),
  identifier: varchar("identifier", { length: 255 }).notNull(),
  value: varchar("value", { length: 255 }).notNull(),
  expiresAt: timestamp("expiresAt").notNull(),
  createdAt: timestamp("createdAt"),
  updatedAt: timestamp("updatedAt"),
});

export const cache = pgTable("cache", {
  key: varchar("key", { length: 255 }).primaryKey(),
  value: text("value").notNull(),
  expiresAt: timestamp("expiresAt").notNull(),
});

export const campaign = pgTable(
  "campaign",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: varchar("userId", { length: 255 })
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    status: varchar("status", { length: 32 }).notNull().default("draft"),
    listedAt: timestamp("listedAt"),
    title: varchar("title", { length: 512 }).notNull(),
    campaignType: varchar("campaignType", { length: 128 }).notNull(),
    description: text("description").notNull(),
    guidelines: text("guidelines"),
    niches: jsonb("niches").$type<string[]>().notNull().default([]),
    platforms: jsonb("platforms").$type<string[]>().notNull().default([]),
    deliverables: jsonb("deliverables").$type<string[]>().notNull().default([]),
    perks: jsonb("perks").$type<string[]>().notNull().default([]),
    followerRange: varchar("followerRange", { length: 64 }),
    minEngagement: numeric("minEngagement", { precision: 5, scale: 2 }),
    location: varchar("location", { length: 128 }),
    minAge: integer("minAge"),
    maxAge: integer("maxAge"),
    compensationType: varchar("compensationType", { length: 64 }).notNull(),
    payMin: numeric("payMin", { precision: 12, scale: 2 }).notNull(),
    payMax: numeric("payMax", { precision: 12, scale: 2 }).notNull(),
    totalBudget: numeric("totalBudget", { precision: 14, scale: 2 }),
    creatorsNeeded: integer("creatorsNeeded"),
    applicationDeadline: date("applicationDeadline"),
    startDate: date("startDate"),
    endDate: date("endDate"),
    brandName: varchar("brandName", { length: 255 }),
    brandImage: varchar("brandImage", { length: 1024 }),
    campaignImage: varchar("campaignImage", { length: 1024 }),
    disclosureChecks: jsonb("disclosureChecks").$type<string[]>().notNull().default([]),
    createdAt: timestamp("createdAt").notNull().defaultNow(),
    updatedAt: timestamp("updatedAt").notNull().defaultNow(),
  },
  (table) => [
    index("campaign_userId_idx").on(table.userId),
    index("campaign_status_idx").on(table.status),
    index("campaign_listedAt_idx").on(table.listedAt),
    index("campaign_compensationType_idx").on(table.compensationType),
    index("campaign_location_idx").on(table.location),
  ]
);

export const socialConnection = pgTable(
  "social_connection",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: varchar("userId", { length: 255 })
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    platform: varchar("platform", { length: 32 }).notNull(),
    externalAccountId: varchar("externalAccountId", { length: 255 }).notNull(),
    handle: varchar("handle", { length: 255 }),
    accessToken: text("accessToken"),
    refreshToken: text("refreshToken"),
    scopes: text("scopes"),
    tokenExpiresAt: timestamp("tokenExpiresAt"),
    meta: jsonb("meta").$type<Record<string, unknown>>().default({}),
    createdAt: timestamp("createdAt").notNull().defaultNow(),
    updatedAt: timestamp("updatedAt").notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex("social_connection_user_platform_unique").on(table.userId, table.platform),
    index("social_connection_platform_idx").on(table.platform),
  ]
);

export const creatorProfile = pgTable(
  "creator_profile",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    platform: varchar("platform", { length: 32 }).notNull(),
    externalId: varchar("externalId", { length: 255 }).notNull(),
    userId: varchar("userId", { length: 255 }).references(() => user.id, { onDelete: "set null" }),
    handle: varchar("handle", { length: 255 }).notNull(),
    displayName: varchar("displayName", { length: 255 }).notNull(),
    imageUrl: text("imageUrl"),
    followerCount: integer("followerCount"),
    engagementRate: numeric("engagementRate", { precision: 8, scale: 4 }),
    niches: jsonb("niches").$type<string[]>().notNull().default([]),
    country: varchar("country", { length: 128 }),
    raw: jsonb("raw").$type<Record<string, unknown>>().default({}),
    embedding: vector1536("embedding"),
    syncedAt: timestamp("syncedAt").notNull().defaultNow(),
    createdAt: timestamp("createdAt").notNull().defaultNow(),
    updatedAt: timestamp("updatedAt").notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex("creator_profile_platform_external_unique").on(table.platform, table.externalId),
    index("creator_profile_handle_idx").on(table.handle),
    index("creator_profile_platform_idx").on(table.platform),
    index("creator_profile_userId_idx").on(table.userId),
  ]
);

export const payoutAccount = pgTable(
  "payout_account",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: varchar("userId", { length: 255 })
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    provider: varchar("provider", { length: 64 }).notNull(),
    providerAccountId: varchar("providerAccountId", { length: 255 }),
    status: varchar("status", { length: 32 }).notNull().default("pending"),
    currency: varchar("currency", { length: 8 }).notNull().default("INR"),
    meta: jsonb("meta").$type<Record<string, unknown>>().default({}),
    createdAt: timestamp("createdAt").notNull().defaultNow(),
    updatedAt: timestamp("updatedAt").notNull().defaultNow(),
  },
  (table) => [uniqueIndex("payout_account_user_provider_unique").on(table.userId, table.provider)]
);

export const paymentIntent = pgTable(
  "payment_intent",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    campaignId: uuid("campaignId").references(() => campaign.id, { onDelete: "set null" }),
    payerUserId: varchar("payerUserId", { length: 255 }).references(() => user.id, {
      onDelete: "set null",
    }),
    payeeUserId: varchar("payeeUserId", { length: 255 }).references(() => user.id, {
      onDelete: "set null",
    }),
    amount: numeric("amount", { precision: 14, scale: 2 }).notNull(),
    currency: varchar("currency", { length: 8 }).notNull().default("INR"),
    status: varchar("status", { length: 32 }).notNull().default("draft"),
    provider: varchar("provider", { length: 64 }),
    providerRef: varchar("providerRef", { length: 255 }),
    meta: jsonb("meta").$type<Record<string, unknown>>().default({}),
    createdAt: timestamp("createdAt").notNull().defaultNow(),
    updatedAt: timestamp("updatedAt").notNull().defaultNow(),
  },
  (table) => [
    index("payment_intent_campaign_idx").on(table.campaignId),
    index("payment_intent_status_idx").on(table.status),
  ]
);

export const application = pgTable(
  "application",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    campaignId: uuid("campaignId")
      .notNull()
      .references(() => campaign.id, { onDelete: "cascade" }),
    influencerId: varchar("influencerId", { length: 255 })
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    status: varchar("status", { length: 32 }).notNull().default("pending"),
    message: text("message"),
    createdAt: timestamp("createdAt").notNull().defaultNow(),
    updatedAt: timestamp("updatedAt").notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex("application_campaign_influencer_unique").on(table.campaignId, table.influencerId),
    index("application_campaign_idx").on(table.campaignId),
    index("application_influencer_idx").on(table.influencerId),
    index("application_status_idx").on(table.status),
  ]
);

export const shortlistGroup = pgTable(
  "shortlist_group",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: varchar("userId", { length: 255 })
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    name: varchar("name", { length: 80 }).notNull(),
    createdAt: timestamp("createdAt").notNull().defaultNow(),
    updatedAt: timestamp("updatedAt").notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex("shortlist_group_user_name_unique").on(table.userId, table.name),
    index("shortlist_group_user_idx").on(table.userId),
  ]
);

export const shortlistItem = pgTable(
  "shortlist_item",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: varchar("userId", { length: 255 })
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    creatorId: uuid("creatorId")
      .notNull()
      .references(() => creatorProfile.id, { onDelete: "cascade" }),
    groupId: uuid("groupId").references(() => shortlistGroup.id, { onDelete: "set null" }),
    createdAt: timestamp("createdAt").notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex("shortlist_item_user_creator_unique").on(table.userId, table.creatorId),
    index("shortlist_item_user_idx").on(table.userId),
    index("shortlist_item_group_idx").on(table.groupId),
  ]
);

export const brandProfile = pgTable("brand_profile", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: varchar("userId", { length: 255 })
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  companyName: varchar("companyName", { length: 255 }).notNull(),
  logoUrl: varchar("logoUrl", { length: 1024 }),
  category: varchar("category", { length: 128 }),
  website: varchar("website", { length: 1024 }),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
}, (table) => [uniqueIndex("brand_profile_user_unique").on(table.userId)]);

export const influencerProfile = pgTable("influencer_profile", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: varchar("userId", { length: 255 })
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  bio: text("bio").notNull().default(""),
  niches: jsonb("niches").$type<string[]>().notNull().default([]),
  location: varchar("location", { length: 128 }),
  rates: jsonb("rates").$type<{ story?: string; reel?: string; post?: string }>().notNull().default({}),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
}, (table) => [uniqueIndex("influencer_profile_user_unique").on(table.userId)]);

export const notification = pgTable(
  "notification",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: varchar("userId", { length: 255 })
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    type: varchar("type", { length: 64 }).notNull(),
    title: varchar("title", { length: 255 }).notNull(),
    body: text("body").notNull(),
    href: varchar("href", { length: 1024 }),
    readAt: timestamp("readAt"),
    createdAt: timestamp("createdAt").notNull().defaultNow(),
  },
  (table) => [index("notification_user_created_idx").on(table.userId, table.createdAt)]
);

export const campaignInvite = pgTable(
  "campaign_invite",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    campaignId: uuid("campaignId")
      .notNull()
      .references(() => campaign.id, { onDelete: "cascade" }),
    brandId: varchar("brandId", { length: 255 })
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    creatorId: uuid("creatorId")
      .notNull()
      .references(() => creatorProfile.id, { onDelete: "cascade" }),
    influencerId: varchar("influencerId", { length: 255 })
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    status: varchar("status", { length: 32 }).notNull().default("pending"),
    createdAt: timestamp("createdAt").notNull().defaultNow(),
    updatedAt: timestamp("updatedAt").notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex("campaign_invite_campaign_influencer_unique").on(table.campaignId, table.influencerId),
    index("campaign_invite_influencer_idx").on(table.influencerId),
  ]
);

export const submission = pgTable(
  "submission",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    applicationId: uuid("applicationId")
      .notNull()
      .references(() => application.id, { onDelete: "cascade" }),
    kind: varchar("kind", { length: 16 }).notNull(),
    url: text("url"),
    storageKey: text("storageKey"),
    note: text("note"),
    revisionNote: text("revisionNote"),
    createdAt: timestamp("createdAt").notNull().defaultNow(),
  },
  (table) => [index("submission_application_idx").on(table.applicationId)]
);

export const rating = pgTable(
  "rating",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    applicationId: uuid("applicationId")
      .notNull()
      .references(() => application.id, { onDelete: "cascade" }),
    raterId: varchar("raterId", { length: 255 })
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    rateeId: varchar("rateeId", { length: 255 })
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    score: integer("score").notNull(),
    comment: text("comment"),
    createdAt: timestamp("createdAt").notNull().defaultNow(),
  },
  (table) => [uniqueIndex("rating_application_rater_unique").on(table.applicationId, table.raterId)]
);

export const conversation = pgTable(
  "conversation",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    applicationId: uuid("applicationId")
      .notNull()
      .references(() => application.id, { onDelete: "cascade" }),
    createdAt: timestamp("createdAt").notNull().defaultNow(),
  },
  (table) => [uniqueIndex("conversation_application_unique").on(table.applicationId)]
);

export const message = pgTable(
  "message",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    conversationId: uuid("conversationId")
      .notNull()
      .references(() => conversation.id, { onDelete: "cascade" }),
    senderId: varchar("senderId", { length: 255 })
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    body: text("body").notNull(),
    createdAt: timestamp("createdAt").notNull().defaultNow(),
  },
  (table) => [index("message_conversation_created_idx").on(table.conversationId, table.createdAt)]
);

export const userRelations = relations(user, ({ many }) => ({
  sessions: many(session),
  accounts: many(account),
  campaigns: many(campaign),
  socialConnections: many(socialConnection),
  payoutAccounts: many(payoutAccount),
  applications: many(application),
  shortlistGroups: many(shortlistGroup),
  shortlistItems: many(shortlistItem),
}));

export const shortlistGroupRelations = relations(shortlistGroup, ({ one, many }) => ({
  user: one(user, { fields: [shortlistGroup.userId], references: [user.id] }),
  items: many(shortlistItem),
}));

export const shortlistItemRelations = relations(shortlistItem, ({ one }) => ({
  user: one(user, { fields: [shortlistItem.userId], references: [user.id] }),
  creator: one(creatorProfile, {
    fields: [shortlistItem.creatorId],
    references: [creatorProfile.id],
  }),
  group: one(shortlistGroup, { fields: [shortlistItem.groupId], references: [shortlistGroup.id] }),
}));

export const campaignRelations = relations(campaign, ({ one, many }) => ({
  user: one(user, { fields: [campaign.userId], references: [user.id] }),
  applications: many(application),
}));

export const applicationRelations = relations(application, ({ one }) => ({
  campaign: one(campaign, { fields: [application.campaignId], references: [campaign.id] }),
  influencer: one(user, { fields: [application.influencerId], references: [user.id] }),
}));

export const sessionRelations = relations(session, ({ one }) => ({
  user: one(user, { fields: [session.userId], references: [user.id] }),
}));

export const accountRelations = relations(account, ({ one }) => ({
  user: one(user, { fields: [account.userId], references: [user.id] }),
}));

export const socialConnectionRelations = relations(socialConnection, ({ one }) => ({
  user: one(user, { fields: [socialConnection.userId], references: [user.id] }),
}));
