import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTravelerTripsTable1759197742016
  implements MigrationInterface
{
  name = 'CreateTravelerTripsTable1759197742016';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
          CREATE TABLE IF NOT EXISTS "web_app"."traveler_trips" (
            "id" uuid DEFAULT gen_random_uuid() NOT NULL,
            "traveler_id" uuid NOT NULL,
            "country_origin_id" uuid NOT NULL,
            "country_destination_id" uuid NOT NULL,
            "departure_date" date NOT NULL,
            "return_date" date,
            "current_capacity" integer DEFAULT 0,
            "max_weight_kg" numeric(5,2),
            "max_items" integer,
            "status" text DEFAULT 'CONFIRMED'::text,
            "created_at" timestamp with time zone DEFAULT now(),
            CONSTRAINT "traveler_trips_pkey" PRIMARY KEY ("id"),
            CONSTRAINT "traveler_trips_traveler_id_fkey" FOREIGN KEY ("traveler_id") REFERENCES "web_app"."users"("id"),
            CONSTRAINT "traveler_trips_country_origin_id_fkey" FOREIGN KEY ("country_origin_id") REFERENCES "web_app"."countries"("id"),
            CONSTRAINT "traveler_trips_country_destination_id_fkey" FOREIGN KEY ("country_destination_id") REFERENCES "web_app"."countries"("id")
          )
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "web_app"."traveler_trips"`);
  }
}
