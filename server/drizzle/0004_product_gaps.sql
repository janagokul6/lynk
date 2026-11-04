ALTER TABLE "campaign" ADD COLUMN "disclosureChecks" jsonb DEFAULT '[]'::jsonb NOT NULL;
--> statement-breakpoint
ALTER TABLE "creator_profile" ADD COLUMN "userId" varchar(255);
--> statement-breakpoint
ALTER TABLE "creator_profile" ADD CONSTRAINT "creator_profile_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;
--> statement-breakpoint
CREATE INDEX "creator_profile_userId_idx" ON "creator_profile" USING btree ("userId");
--> statement-breakpoint
CREATE TABLE "brand_profile" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"userId" varchar(255) NOT NULL,
	"companyName" varchar(255) NOT NULL,
	"logoUrl" varchar(1024),
	"category" varchar(128),
	"website" varchar(1024),
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "influencer_profile" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"userId" varchar(255) NOT NULL,
	"bio" text DEFAULT '' NOT NULL,
	"niches" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"location" varchar(128),
	"rates" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "notification" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"userId" varchar(255) NOT NULL,
	"type" varchar(64) NOT NULL,
	"title" varchar(255) NOT NULL,
	"body" text NOT NULL,
	"href" varchar(1024),
	"readAt" timestamp,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "campaign_invite" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"campaignId" uuid NOT NULL,
	"brandId" varchar(255) NOT NULL,
	"creatorId" uuid NOT NULL,
	"influencerId" varchar(255) NOT NULL,
	"status" varchar(32) DEFAULT 'pending' NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "submission" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"applicationId" uuid NOT NULL,
	"kind" varchar(16) NOT NULL,
	"url" text,
	"storageKey" text,
	"note" text,
	"revisionNote" text,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "rating" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"applicationId" uuid NOT NULL,
	"raterId" varchar(255) NOT NULL,
	"rateeId" varchar(255) NOT NULL,
	"score" integer NOT NULL,
	"comment" text,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "conversation" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"applicationId" uuid NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "message" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"conversationId" uuid NOT NULL,
	"senderId" varchar(255) NOT NULL,
	"body" text NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "brand_profile" ADD CONSTRAINT "brand_profile_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "influencer_profile" ADD CONSTRAINT "influencer_profile_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "notification" ADD CONSTRAINT "notification_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "campaign_invite" ADD CONSTRAINT "campaign_invite_campaignId_campaign_id_fk" FOREIGN KEY ("campaignId") REFERENCES "public"."campaign"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "campaign_invite" ADD CONSTRAINT "campaign_invite_brandId_user_id_fk" FOREIGN KEY ("brandId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "campaign_invite" ADD CONSTRAINT "campaign_invite_creatorId_creator_profile_id_fk" FOREIGN KEY ("creatorId") REFERENCES "public"."creator_profile"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "campaign_invite" ADD CONSTRAINT "campaign_invite_influencerId_user_id_fk" FOREIGN KEY ("influencerId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "submission" ADD CONSTRAINT "submission_applicationId_application_id_fk" FOREIGN KEY ("applicationId") REFERENCES "public"."application"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "rating" ADD CONSTRAINT "rating_applicationId_application_id_fk" FOREIGN KEY ("applicationId") REFERENCES "public"."application"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "rating" ADD CONSTRAINT "rating_raterId_user_id_fk" FOREIGN KEY ("raterId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "rating" ADD CONSTRAINT "rating_rateeId_user_id_fk" FOREIGN KEY ("rateeId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "conversation" ADD CONSTRAINT "conversation_applicationId_application_id_fk" FOREIGN KEY ("applicationId") REFERENCES "public"."application"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "message" ADD CONSTRAINT "message_conversationId_conversation_id_fk" FOREIGN KEY ("conversationId") REFERENCES "public"."conversation"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "message" ADD CONSTRAINT "message_senderId_user_id_fk" FOREIGN KEY ("senderId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
CREATE UNIQUE INDEX "brand_profile_user_unique" ON "brand_profile" USING btree ("userId");
--> statement-breakpoint
CREATE UNIQUE INDEX "influencer_profile_user_unique" ON "influencer_profile" USING btree ("userId");
--> statement-breakpoint
CREATE INDEX "notification_user_created_idx" ON "notification" USING btree ("userId","createdAt");
--> statement-breakpoint
CREATE UNIQUE INDEX "campaign_invite_campaign_influencer_unique" ON "campaign_invite" USING btree ("campaignId","influencerId");
--> statement-breakpoint
CREATE INDEX "campaign_invite_influencer_idx" ON "campaign_invite" USING btree ("influencerId");
--> statement-breakpoint
CREATE INDEX "submission_application_idx" ON "submission" USING btree ("applicationId");
--> statement-breakpoint
CREATE UNIQUE INDEX "rating_application_rater_unique" ON "rating" USING btree ("applicationId","raterId");
--> statement-breakpoint
CREATE UNIQUE INDEX "conversation_application_unique" ON "conversation" USING btree ("applicationId");
--> statement-breakpoint
CREATE INDEX "message_conversation_created_idx" ON "message" USING btree ("conversationId","createdAt");
--> statement-breakpoint
UPDATE "user" SET "roleChosenAt" = "createdAt" WHERE "roleChosenAt" IS NULL;
