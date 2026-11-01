CREATE EXTENSION IF NOT EXISTS vector;
--> statement-breakpoint
CREATE TABLE "creator_profile" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"platform" varchar(32) NOT NULL,
	"externalId" varchar(255) NOT NULL,
	"handle" varchar(255) NOT NULL,
	"displayName" varchar(255) NOT NULL,
	"imageUrl" text,
	"followerCount" integer,
	"engagementRate" numeric(8, 4),
	"niches" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"country" varchar(128),
	"raw" jsonb DEFAULT '{}'::jsonb,
	"embedding" vector(1536),
	"syncedAt" timestamp DEFAULT now() NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "payment_intent" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"campaignId" uuid,
	"payerUserId" varchar(255),
	"payeeUserId" varchar(255),
	"amount" numeric(14, 2) NOT NULL,
	"currency" varchar(8) DEFAULT 'INR' NOT NULL,
	"status" varchar(32) DEFAULT 'draft' NOT NULL,
	"provider" varchar(64),
	"providerRef" varchar(255),
	"meta" jsonb DEFAULT '{}'::jsonb,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "payout_account" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"userId" varchar(255) NOT NULL,
	"provider" varchar(64) NOT NULL,
	"providerAccountId" varchar(255),
	"status" varchar(32) DEFAULT 'pending' NOT NULL,
	"currency" varchar(8) DEFAULT 'INR' NOT NULL,
	"meta" jsonb DEFAULT '{}'::jsonb,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "social_connection" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"userId" varchar(255) NOT NULL,
	"platform" varchar(32) NOT NULL,
	"externalAccountId" varchar(255) NOT NULL,
	"handle" varchar(255),
	"accessToken" text,
	"refreshToken" text,
	"scopes" text,
	"tokenExpiresAt" timestamp,
	"meta" jsonb DEFAULT '{}'::jsonb,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "account" ALTER COLUMN "accessToken" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "account" ALTER COLUMN "refreshToken" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "account" ALTER COLUMN "scope" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "role" varchar(32) DEFAULT 'brand' NOT NULL;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "roleChosenAt" timestamp;--> statement-breakpoint
ALTER TABLE "payment_intent" ADD CONSTRAINT "payment_intent_campaignId_campaign_id_fk" FOREIGN KEY ("campaignId") REFERENCES "public"."campaign"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payment_intent" ADD CONSTRAINT "payment_intent_payerUserId_user_id_fk" FOREIGN KEY ("payerUserId") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payment_intent" ADD CONSTRAINT "payment_intent_payeeUserId_user_id_fk" FOREIGN KEY ("payeeUserId") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payout_account" ADD CONSTRAINT "payout_account_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "social_connection" ADD CONSTRAINT "social_connection_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "creator_profile_platform_external_unique" ON "creator_profile" USING btree ("platform","externalId");--> statement-breakpoint
CREATE INDEX "creator_profile_handle_idx" ON "creator_profile" USING btree ("handle");--> statement-breakpoint
CREATE INDEX "creator_profile_platform_idx" ON "creator_profile" USING btree ("platform");--> statement-breakpoint
CREATE INDEX "payment_intent_campaign_idx" ON "payment_intent" USING btree ("campaignId");--> statement-breakpoint
CREATE INDEX "payment_intent_status_idx" ON "payment_intent" USING btree ("status");--> statement-breakpoint
CREATE UNIQUE INDEX "payout_account_user_provider_unique" ON "payout_account" USING btree ("userId","provider");--> statement-breakpoint
CREATE UNIQUE INDEX "social_connection_user_platform_unique" ON "social_connection" USING btree ("userId","platform");--> statement-breakpoint
CREATE INDEX "social_connection_platform_idx" ON "social_connection" USING btree ("platform");