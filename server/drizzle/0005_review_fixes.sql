CREATE INDEX IF NOT EXISTS "campaign_invite_campaign_idx" ON "campaign_invite" USING btree ("campaignId");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "campaign_invite_brand_idx" ON "campaign_invite" USING btree ("brandId");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "campaign_invite_creator_idx" ON "campaign_invite" USING btree ("creatorId");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "submission_storage_key_idx" ON "submission" USING btree ("storageKey");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "rating_ratee_idx" ON "rating" USING btree ("rateeId");
--> statement-breakpoint
ALTER TABLE "rating" DROP CONSTRAINT IF EXISTS "rating_score_range";
--> statement-breakpoint
ALTER TABLE "rating" ADD CONSTRAINT "rating_score_range" CHECK ("score" >= 1 AND "score" <= 5);
--> statement-breakpoint
UPDATE "user" SET "roleChosenAt" = "createdAt" WHERE "roleChosenAt" IS NULL AND "createdAt" IS NOT NULL;
