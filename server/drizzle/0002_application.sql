CREATE TABLE "application" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"campaignId" uuid NOT NULL,
	"influencerId" varchar(255) NOT NULL,
	"status" varchar(32) DEFAULT 'pending' NOT NULL,
	"message" text,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "application" ADD CONSTRAINT "application_campaignId_campaign_id_fk" FOREIGN KEY ("campaignId") REFERENCES "public"."campaign"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "application" ADD CONSTRAINT "application_influencerId_user_id_fk" FOREIGN KEY ("influencerId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "application_campaign_influencer_unique" ON "application" USING btree ("campaignId","influencerId");--> statement-breakpoint
CREATE INDEX "application_campaign_idx" ON "application" USING btree ("campaignId");--> statement-breakpoint
CREATE INDEX "application_influencer_idx" ON "application" USING btree ("influencerId");--> statement-breakpoint
CREATE INDEX "application_status_idx" ON "application" USING btree ("status");