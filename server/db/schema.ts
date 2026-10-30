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
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// Better Auth: user table
export const user = pgTable(
  "user",
  {
    id: varchar("id", { length: 255 }).primaryKey(),
    name: varchar("name", { length: 255 }).notNull(),
    email: varchar("email", { length: 255 }).notNull(),
    emailVerified: boolean("emailVerified").notNull(),
    image: varchar("image", { length: 255 }),
    createdAt: timestamp("createdAt").notNull(),
    updatedAt: timestamp("updatedAt").notNull(),
  },
  (table) => [uniqueIndex("user_email_unique").on(table.email)]
);

// Better Auth: session table
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

// Better Auth: account table
export const account = pgTable("account", {
  id: varchar("id", { length: 255 }).primaryKey(),
  accountId: varchar("accountId", { length: 255 }).notNull(),
  providerId: varchar("providerId", { length: 255 }).notNull(),
  userId: varchar("userId", { length: 255 })
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: varchar("accessToken", { length: 255 }),
  refreshToken: varchar("refreshToken", { length: 255 }),
  idToken: text("idToken"),
  accessTokenExpiresAt: timestamp("accessTokenExpiresAt"),
  refreshTokenExpiresAt: timestamp("refreshTokenExpiresAt"),
  scope: varchar("scope", { length: 255 }),
  password: varchar("password", { length: 255 }),
  createdAt: timestamp("createdAt").notNull(),
  updatedAt: timestamp("updatedAt").notNull(),
});

// Better Auth: verification table
export const verification = pgTable("verification", {
  id: varchar("id", { length: 255 }).primaryKey(),
  identifier: varchar("identifier", { length: 255 }).notNull(),
  value: varchar("value", { length: 255 }).notNull(),
  expiresAt: timestamp("expiresAt").notNull(),
  createdAt: timestamp("createdAt"),
  updatedAt: timestamp("updatedAt"),
});

// Custom: cache table
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

// Relations for Better Auth joins (optional, improves getSession performance)
export const userRelations = relations(user, ({ many }) => ({
  sessions: many(session),
  accounts: many(account),
  campaigns: many(campaign),
}));

export const campaignRelations = relations(campaign, ({ one }) => ({
  user: one(user),
}));

export const sessionRelations = relations(session, ({ one }) => ({
  user: one(user),
}));

export const accountRelations = relations(account, ({ one }) => ({
  user: one(user),
}));
