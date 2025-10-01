import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateGrabsTable1759197741350 implements MigrationInterface {
  name = 'CreateGrabsTable1759197741350';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
          CREATE TABLE IF NOT EXISTS "web_app"."grabs" (
            "id" uuid DEFAULT gen_random_uuid() NOT NULL,
            "user_id" uuid,
            "product_url" text NOT NULL,
            "product_title" text NOT NULL,
            "price_estimated" numeric(10,2),
            "quantity" integer DEFAULT 1,
            "description" text,
            "has_original_packaging" boolean DEFAULT false,
            "country_origin_id" uuid,
            "country_destination_id" uuid,
            "delivery_deadline" date,
            "status" text DEFAULT 'PUBLISHED'::text,
            "product_image" text,
            "created_at" timestamp with time zone DEFAULT now(),
            CONSTRAINT "grabs_pkey" PRIMARY KEY ("id"),
            CONSTRAINT "grabs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE,
            CONSTRAINT "grabs_country_origin_id_fkey" FOREIGN KEY ("country_origin_id") REFERENCES "web_app"."countries"("id"),
            CONSTRAINT "grabs_country_destination_id_fkey" FOREIGN KEY ("country_destination_id") REFERENCES "web_app"."countries"("id")
          )
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "web_app"."grabs"`);
  }
}
