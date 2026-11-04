CREATE TABLE "shortlist_group" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"userId" varchar(255) NOT NULL,
	"name" varchar(80) NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "shortlist_item" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"userId" varchar(255) NOT NULL,
	"creatorId" uuid NOT NULL,
	"groupId" uuid,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "plan" varchar(16) DEFAULT 'free' NOT NULL;--> statement-breakpoint
ALTER TABLE "shortlist_group" ADD CONSTRAINT "shortlist_group_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "shortlist_item" ADD CONSTRAINT "shortlist_item_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "shortlist_item" ADD CONSTRAINT "shortlist_item_creatorId_creator_profile_id_fk" FOREIGN KEY ("creatorId") REFERENCES "public"."creator_profile"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "shortlist_item" ADD CONSTRAINT "shortlist_item_groupId_shortlist_group_id_fk" FOREIGN KEY ("groupId") REFERENCES "public"."shortlist_group"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "shortlist_group_user_name_unique" ON "shortlist_group" USING btree ("userId","name");--> statement-breakpoint
CREATE INDEX "shortlist_group_user_idx" ON "shortlist_group" USING btree ("userId");--> statement-breakpoint
CREATE UNIQUE INDEX "shortlist_item_user_creator_unique" ON "shortlist_item" USING btree ("userId","creatorId");--> statement-breakpoint
CREATE INDEX "shortlist_item_user_idx" ON "shortlist_item" USING btree ("userId");--> statement-breakpoint
CREATE INDEX "shortlist_item_group_idx" ON "shortlist_item" USING btree ("groupId");