CREATE TABLE "account" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"accountId" varchar(255) NOT NULL,
	"providerId" varchar(255) NOT NULL,
	"userId" varchar(255) NOT NULL,
	"accessToken" varchar(255),
	"refreshToken" varchar(255),
	"idToken" text,
	"accessTokenExpiresAt" timestamp,
	"refreshTokenExpiresAt" timestamp,
	"scope" varchar(255),
	"password" varchar(255),
	"createdAt" timestamp NOT NULL,
	"updatedAt" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "cache" (
	"key" varchar(255) PRIMARY KEY NOT NULL,
	"value" text NOT NULL,
	"expiresAt" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "campaign" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"userId" varchar(255) NOT NULL,
	"status" varchar(32) DEFAULT 'draft' NOT NULL,
	"listedAt" timestamp,
	"title" varchar(512) NOT NULL,
	"campaignType" varchar(128) NOT NULL,
	"description" text NOT NULL,
	"guidelines" text,
	"niches" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"platforms" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"deliverables" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"perks" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"followerRange" varchar(64),
	"minEngagement" numeric(5, 2),
	"location" varchar(128),
	"minAge" integer,
	"maxAge" integer,
	"compensationType" varchar(64) NOT NULL,
	"payMin" numeric(12, 2) NOT NULL,
	"payMax" numeric(12, 2) NOT NULL,
	"totalBudget" numeric(14, 2),
	"creatorsNeeded" integer,
	"applicationDeadline" date,
	"startDate" date,
	"endDate" date,
	"brandName" varchar(255),
	"brandImage" varchar(1024),
	"campaignImage" varchar(1024),
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "session" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"expiresAt" timestamp NOT NULL,
	"token" varchar(255) NOT NULL,
	"createdAt" timestamp NOT NULL,
	"updatedAt" timestamp NOT NULL,
	"ipAddress" varchar(255),
	"userAgent" varchar(255),
	"userId" varchar(255) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"emailVerified" boolean NOT NULL,
	"image" varchar(255),
	"createdAt" timestamp NOT NULL,
	"updatedAt" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "verification" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"identifier" varchar(255) NOT NULL,
	"value" varchar(255) NOT NULL,
	"expiresAt" timestamp NOT NULL,
	"createdAt" timestamp,
	"updatedAt" timestamp
);
--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "campaign" ADD CONSTRAINT "campaign_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "campaign_userId_idx" ON "campaign" USING btree ("userId");--> statement-breakpoint
CREATE INDEX "campaign_status_idx" ON "campaign" USING btree ("status");--> statement-breakpoint
CREATE INDEX "campaign_listedAt_idx" ON "campaign" USING btree ("listedAt");--> statement-breakpoint
CREATE INDEX "campaign_compensationType_idx" ON "campaign" USING btree ("compensationType");--> statement-breakpoint
CREATE INDEX "campaign_location_idx" ON "campaign" USING btree ("location");--> statement-breakpoint
CREATE UNIQUE INDEX "session_token_unique" ON "session" USING btree ("token");--> statement-breakpoint
CREATE UNIQUE INDEX "user_email_unique" ON "user" USING btree ("email");