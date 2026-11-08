CREATE TABLE "polities" (
	"id" text PRIMARY KEY NOT NULL,
	"canonical_name" text NOT NULL,
	"entity_type" text NOT NULL,
	"start_year" integer NOT NULL,
	"end_year" integer,
	"precision" text DEFAULT 'approximate' NOT NULL,
	"overview" text NOT NULL,
	"capital_city" text,
	"review_status" text DEFAULT 'draft' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "name_variants" (
	"id" text PRIMARY KEY NOT NULL,
	"polity_id" text NOT NULL,
	"name" text NOT NULL,
	"language" text NOT NULL,
	"variant_type" text DEFAULT 'transliteration' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "rulers" (
	"id" text PRIMARY KEY NOT NULL,
	"preferred_name" text NOT NULL,
	"birth_year" integer,
	"death_year" integer,
	"biography" text,
	"review_status" text DEFAULT 'draft' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "reigns" (
	"id" text PRIMARY KEY NOT NULL,
	"ruler_id" text NOT NULL,
	"polity_id" text NOT NULL,
	"start_year" integer NOT NULL,
	"end_year" integer,
	"title" text,
	"is_co_ruler" boolean DEFAULT false NOT NULL,
	"review_status" text DEFAULT 'draft' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "territory_periods" (
	"id" text PRIMARY KEY NOT NULL,
	"polity_id" text NOT NULL,
	"region_name" text NOT NULL,
	"valid_from_year" integer NOT NULL,
	"valid_to_year" integer NOT NULL,
	"control_type" text NOT NULL,
	"confidence" text DEFAULT 'approximate' NOT NULL,
	"geometry_geojson" jsonb NOT NULL,
	"explanatory_note" text,
	"review_status" text DEFAULT 'draft' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "historical_events" (
	"id" text PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"event_year" integer NOT NULL,
	"summary" text NOT NULL,
	"event_type" text NOT NULL,
	"location_name" text,
	"location_geojson" jsonb,
	"review_status" text DEFAULT 'draft' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "event_participants" (
	"id" text PRIMARY KEY NOT NULL,
	"event_id" text NOT NULL,
	"polity_id" text,
	"ruler_id" text,
	"role" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sources" (
	"id" text PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"author_or_organization" text NOT NULL,
	"publication" text,
	"publication_date" text,
	"url" text,
	"accessed_at" timestamp with time zone,
	"citation_text" text NOT NULL,
	"license_or_rights_note" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "claim_sources" (
	"id" text PRIMARY KEY NOT NULL,
	"claim_type" text NOT NULL,
	"claim_id" text NOT NULL,
	"source_id" text NOT NULL,
	"specific_page_or_passage" text,
	"notes" text
);
--> statement-breakpoint
ALTER TABLE "name_variants" ADD CONSTRAINT "name_variants_polity_id_polities_id_fk" FOREIGN KEY ("polity_id") REFERENCES "public"."polities"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reigns" ADD CONSTRAINT "reigns_ruler_id_rulers_id_fk" FOREIGN KEY ("ruler_id") REFERENCES "public"."rulers"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reigns" ADD CONSTRAINT "reigns_polity_id_polities_id_fk" FOREIGN KEY ("polity_id") REFERENCES "public"."polities"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "territory_periods" ADD CONSTRAINT "territory_periods_polity_id_polities_id_fk" FOREIGN KEY ("polity_id") REFERENCES "public"."polities"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "event_participants" ADD CONSTRAINT "event_participants_event_id_historical_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."historical_events"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "event_participants" ADD CONSTRAINT "event_participants_polity_id_polities_id_fk" FOREIGN KEY ("polity_id") REFERENCES "public"."polities"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "event_participants" ADD CONSTRAINT "event_participants_ruler_id_rulers_id_fk" FOREIGN KEY ("ruler_id") REFERENCES "public"."rulers"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "claim_sources" ADD CONSTRAINT "claim_sources_source_id_sources_id_fk" FOREIGN KEY ("source_id") REFERENCES "public"."sources"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "territory_periods_year_range_idx" ON "territory_periods" USING btree ("valid_from_year","valid_to_year");--> statement-breakpoint
CREATE INDEX "territory_periods_polity_idx" ON "territory_periods" USING btree ("polity_id");--> statement-breakpoint
CREATE INDEX "historical_events_year_idx" ON "historical_events" USING btree ("event_year");--> statement-breakpoint
CREATE INDEX "claim_sources_claim_idx" ON "claim_sources" USING btree ("claim_type","claim_id");--> statement-breakpoint
CREATE INDEX "claim_sources_source_idx" ON "claim_sources" USING btree ("source_id");