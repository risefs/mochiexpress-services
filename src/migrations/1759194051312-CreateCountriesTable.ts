import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateCountriesTable1759194051312 implements MigrationInterface {
  name = 'CreateCountriesTable1759194051312';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE SCHEMA IF NOT EXISTS "web_app"
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "web_app"."countries" (
        "id" uuid DEFAULT gen_random_uuid() NOT NULL,
        "iso_code" character(2) NOT NULL,
        "name" text NOT NULL,
        "continent" text,
        "currency_code" character(3),
        "flag_emoji" character(2),
        "phone_code" text,
        "flag_image_url" text DEFAULT 'https://flagcdn.com/w80/{code}.png',
        "created_at" timestamp with time zone DEFAULT now(),
        CONSTRAINT "countries_pkey" PRIMARY KEY ("id"),
        CONSTRAINT "countries_iso_code_key" UNIQUE ("iso_code")
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "web_app"."countries"`);
  }
}
