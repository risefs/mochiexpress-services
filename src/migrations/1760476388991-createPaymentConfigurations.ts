import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreatePaymentConfigurations1760476388991
  implements MigrationInterface
{
  name = 'CreatePaymentConfigurations1760476388991';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "web_app"."payment_configurations" (
        "id" uuid DEFAULT gen_random_uuid() NOT NULL,
        "provider" varchar(50) NOT NULL,
        "country_id" uuid NOT NULL,
        "fixed_fee" decimal(10,2) NOT NULL,
        "percentage_fee" decimal(5,4) NOT NULL,
        "min_fee" DECIMAL(10,2),
        "max_fee" DECIMAL(10,2),        
        "supports_refunds" BOOLEAN DEFAULT true,
        "supports_installments" BOOLEAN DEFAULT false,
        "max_installments" INT,
        "api_version" VARCHAR(20),
        "description" TEXT,
        "active" BOOLEAN DEFAULT true,
        "valid_from" TIMESTAMP DEFAULT NOW(),
        "valid_until" TIMESTAMP,
        "created_at" TIMESTAMP DEFAULT NOW(),
        "updated_at" TIMESTAMP DEFAULT NOW()
      )
    `);

    await queryRunner.query(`
      GRANT SELECT ON "web_app"."payment_configurations" TO "anon";
      GRANT SELECT ON "web_app"."payment_configurations" TO "authenticated"
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP TABLE IF EXISTS "web_app"."payment_configurations"`,
    );
  }
}
