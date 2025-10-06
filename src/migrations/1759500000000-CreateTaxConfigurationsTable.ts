import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTaxConfigurationsTable1759500000000
  implements MigrationInterface
{
  name = 'CreateTaxConfigurationsTable1759500000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "web_app"."tax_configurations" (
        "id" uuid DEFAULT gen_random_uuid() NOT NULL,
        "country_id" uuid NOT NULL,
        "state_code" varchar(10),
        "tax_rate" decimal(5,4) NOT NULL,
        "tax_name" varchar(100),
        "description" text,
        "active" boolean DEFAULT true NOT NULL,
        "valid_from" date NOT NULL,
        "valid_until" date,
        "created_at" timestamp DEFAULT now() NOT NULL,
        "updated_at" timestamp DEFAULT now() NOT NULL,
        CONSTRAINT "tax_configurations_pkey" PRIMARY KEY ("id"),
        CONSTRAINT "tax_configurations_country_id_fkey" FOREIGN KEY ("country_id") REFERENCES "web_app"."countries"("id") ON DELETE CASCADE
      )
    `);

    await queryRunner.query(`
      GRANT SELECT ON "web_app"."tax_configurations" TO "anon";
      GRANT SELECT ON "web_app"."tax_configurations" TO "authenticated"
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP TABLE IF EXISTS "web_app"."tax_configurations"`,
    );
  }
}
