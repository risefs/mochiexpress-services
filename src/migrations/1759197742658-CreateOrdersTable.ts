import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateOrdersTable1759197742658 implements MigrationInterface {
  name = 'CreateOrdersTable1759197742658';
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
          CREATE TABLE IF NOT EXISTS "web_app"."orders" (
            "id" uuid DEFAULT gen_random_uuid() NOT NULL,
            "grab_id" uuid,
            "traveler_id" uuid,
            "buyer_id" uuid,
            "agreed_price" numeric(10,2) NOT NULL,
            "status" text DEFAULT 'pending'::text,
            "payment_status" text DEFAULT 'unpaid'::text,
            "delivery_date_estimated" date,
            "tracking_info" text,
            "created_at" timestamp with time zone DEFAULT now(),
            CONSTRAINT "orders_pkey" PRIMARY KEY ("id"),
            CONSTRAINT "orders_buyer_id_fkey" FOREIGN KEY ("buyer_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE,
            CONSTRAINT "orders_traveler_id_fkey" FOREIGN KEY ("traveler_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE
          )
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "web_app"."orders"`);
  }
}
