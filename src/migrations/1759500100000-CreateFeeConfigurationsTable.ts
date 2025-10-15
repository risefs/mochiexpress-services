import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateFeeConfigurationsTable1759500100000
  implements MigrationInterface
{
  name = 'CreateFeeConfigurationsTable1759500100000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "web_app"."fee_configurations" (
        "id" uuid DEFAULT gen_random_uuid() NOT NULL,
        "fee_type" varchar(50) NOT NULL,
        "country_id" uuid,
        "fee_rate" decimal(5,4),
        "fixed_amount" decimal(10,2),
        "min_amount" decimal(10,2),
        "max_amount" decimal(10,2),
        "calculation_method" varchar(20) DEFAULT 'percentage' NOT NULL,
        "description" text,
        "active" boolean DEFAULT true NOT NULL,
        "valid_from" timestamp DEFAULT now() NOT NULL,
        "valid_until" timestamp,
        "created_at" timestamp DEFAULT now() NOT NULL,
        "updated_at" timestamp DEFAULT now() NOT NULL,
        CONSTRAINT "fee_configurations_pkey" PRIMARY KEY ("id"),
        CONSTRAINT "fee_configurations_country_id_fkey" FOREIGN KEY ("country_id") REFERENCES "web_app"."countries"("id") ON DELETE CASCADE
      )
    `);

    await queryRunner.query(`
      GRANT SELECT ON "web_app"."fee_configurations" TO "anon";
      GRANT SELECT ON "web_app"."fee_configurations" TO "authenticated"
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP TABLE IF EXISTS "web_app"."fee_configurations"`,
    );
  }
}
