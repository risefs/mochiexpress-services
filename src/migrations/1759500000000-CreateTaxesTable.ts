import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTaxesTable1759500000000 implements MigrationInterface {
  name = 'CreateTaxesTable1759500000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "web_app"."taxes" (
        "id" uuid DEFAULT gen_random_uuid() NOT NULL,
        "country_id" uuid NOT NULL,
        "state_code" varchar(10),
        "tax_rate" decimal(5,4) NOT NULL,
        "tax_name" varchar(100),
        "description" text,
        "active" boolean DEFAULT true NOT NULL,
        "valid_from" text NOT NULL,
        "valid_until" text,
        "created_at" timestamp DEFAULT now() NOT NULL,
        "updated_at" timestamp DEFAULT now() NOT NULL,
        CONSTRAINT "taxes_pkey" PRIMARY KEY ("id"),
        CONSTRAINT "taxes_country_id_fkey" FOREIGN KEY ("country_id") REFERENCES "web_app"."countries"("id") ON DELETE CASCADE
      )
    `);

    await queryRunner.query(`
      GRANT SELECT ON "web_app"."taxes" TO "anon";
      GRANT SELECT ON "web_app"."taxes" TO "authenticated"
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "web_app"."taxes"`);
  }
}
