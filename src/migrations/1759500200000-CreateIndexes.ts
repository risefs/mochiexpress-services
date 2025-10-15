import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateIndexes1759500200000 implements MigrationInterface {
  name = 'CreateIndexes1759500200000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // grabs table indexes
    await queryRunner.query(`
      CREATE INDEX "idx_grabs_user_id" ON "web_app"."grabs"("user_id")
    `);
    await queryRunner.query(`
      CREATE INDEX "idx_grabs_country_origin_id" ON "web_app"."grabs"("country_origin_id")
    `);
    await queryRunner.query(`
      CREATE INDEX "idx_grabs_country_destination_id" ON "web_app"."grabs"("country_destination_id")
    `);
    await queryRunner.query(`
      CREATE INDEX "idx_grabs_status" ON "web_app"."grabs"("status")
    `);
    await queryRunner.query(`
      CREATE INDEX "idx_grabs_created_at" ON "web_app"."grabs"("created_at" DESC)
    `);
    await queryRunner.query(`
      CREATE INDEX "idx_grabs_status_countries" ON "web_app"."grabs"("status", "country_origin_id", "country_destination_id")
    `);

    // orders table indexes
    await queryRunner.query(`
      CREATE INDEX "idx_orders_grab_id" ON "web_app"."orders"("grab_id")
    `);
    await queryRunner.query(`
      CREATE INDEX "idx_orders_buyer_id" ON "web_app"."orders"("buyer_id")
    `);
    await queryRunner.query(`
      CREATE INDEX "idx_orders_traveler_id" ON "web_app"."orders"("traveler_id")
    `);
    await queryRunner.query(`
      CREATE INDEX "idx_orders_status_payment" ON "web_app"."orders"("status", "payment_status")
    `);
    await queryRunner.query(`
      CREATE INDEX "idx_orders_created_at" ON "web_app"."orders"("created_at" DESC)
    `);

    // traveler_trips table indexes
    await queryRunner.query(`
      CREATE INDEX "idx_traveler_trips_traveler_id" ON "web_app"."traveler_trips"("traveler_id")
    `);
    await queryRunner.query(`
      CREATE INDEX "idx_traveler_trips_country_origin_id" ON "web_app"."traveler_trips"("country_origin_id")
    `);
    await queryRunner.query(`
      CREATE INDEX "idx_traveler_trips_country_destination_id" ON "web_app"."traveler_trips"("country_destination_id")
    `);
    await queryRunner.query(`
      CREATE INDEX "idx_traveler_trips_status_dates" ON "web_app"."traveler_trips"("status", "departure_date")
    `);

    // tax_configurations table indexes
    await queryRunner.query(`
      CREATE INDEX "idx_tax_configurations_country_id" ON "web_app"."tax_configurations"("country_id")
    `);
    await queryRunner.query(`
      CREATE INDEX "idx_tax_configurations_active_valid" ON "web_app"."tax_configurations"("country_id", "active", "valid_from")
    `);

    // fee_configurations table indexes
    await queryRunner.query(`
      CREATE INDEX "idx_fee_configurations_country_id" ON "web_app"."fee_configurations"("country_id")
    `);
    await queryRunner.query(`
      CREATE INDEX "idx_fee_configurations_type_country" ON "web_app"."fee_configurations"("fee_type", "country_id", "active")
    `);

    // user_roles table indexes
    await queryRunner.query(`
      CREATE INDEX "idx_user_roles_role_id" ON "web_app"."user_roles"("role_id")
    `);

    // users table indexes
    await queryRunner.query(`
      CREATE INDEX "idx_users_email" ON "web_app"."users"("email")
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX IF EXISTS "web_app"."idx_grabs_user_id"`,
    );
    await queryRunner.query(
      `DROP INDEX IF EXISTS "web_app"."idx_grabs_country_origin_id"`,
    );
    await queryRunner.query(
      `DROP INDEX IF EXISTS "web_app"."idx_grabs_country_destination_id"`,
    );
    await queryRunner.query(
      `DROP INDEX IF EXISTS "web_app"."idx_grabs_status"`,
    );
    await queryRunner.query(
      `DROP INDEX IF EXISTS "web_app"."idx_grabs_created_at"`,
    );
    await queryRunner.query(
      `DROP INDEX IF EXISTS "web_app"."idx_grabs_status_countries"`,
    );

    await queryRunner.query(
      `DROP INDEX IF EXISTS "web_app"."idx_orders_grab_id"`,
    );
    await queryRunner.query(
      `DROP INDEX IF EXISTS "web_app"."idx_orders_buyer_id"`,
    );
    await queryRunner.query(
      `DROP INDEX IF EXISTS "web_app"."idx_orders_traveler_id"`,
    );
    await queryRunner.query(
      `DROP INDEX IF EXISTS "web_app"."idx_orders_status_payment"`,
    );
    await queryRunner.query(
      `DROP INDEX IF EXISTS "web_app"."idx_orders_created_at"`,
    );

    await queryRunner.query(
      `DROP INDEX IF EXISTS "web_app"."idx_traveler_trips_traveler_id"`,
    );
    await queryRunner.query(
      `DROP INDEX IF EXISTS "web_app"."idx_traveler_trips_country_origin_id"`,
    );
    await queryRunner.query(
      `DROP INDEX IF EXISTS "web_app"."idx_traveler_trips_country_destination_id"`,
    );
    await queryRunner.query(
      `DROP INDEX IF EXISTS "web_app"."idx_traveler_trips_status_dates"`,
    );

    await queryRunner.query(
      `DROP INDEX IF EXISTS "web_app"."idx_tax_configurations_country_id"`,
    );
    await queryRunner.query(
      `DROP INDEX IF EXISTS "web_app"."idx_tax_configurations_active_valid"`,
    );

    await queryRunner.query(
      `DROP INDEX IF EXISTS "web_app"."idx_fee_configurations_country_id"`,
    );
    await queryRunner.query(
      `DROP INDEX IF EXISTS "web_app"."idx_fee_configurations_type_country"`,
    );

    await queryRunner.query(
      `DROP INDEX IF EXISTS "web_app"."idx_user_roles_role_id"`,
    );

    await queryRunner.query(`DROP INDEX IF EXISTS "web_app"."idx_users_email"`);
  }
}
