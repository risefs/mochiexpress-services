import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateRolesTable1759197341233 implements MigrationInterface {
  name = 'CreateRolesTable1759197341233';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
          CREATE TABLE IF NOT EXISTS "web_app"."roles" (
            "id" uuid DEFAULT gen_random_uuid() NOT NULL,
            "name" text NOT NULL,
            "description" text,
            CONSTRAINT "roles_pkey" PRIMARY KEY ("id"),
            CONSTRAINT "roles_name_key" UNIQUE ("name"),
            CONSTRAINT "roles_name_check" CHECK ("name" = ANY (ARRAY['buyer'::text, 'traveler'::text]))
          )
        `);
    await queryRunner.query(`
          INSERT INTO "web_app"."roles" ("name", "description") VALUES 
            ('buyer', 'Usuario que puede crear pedidos de productos'),
            ('traveler', 'Usuario que puede llevar productos en sus viajes')
          ON CONFLICT ("name") DO NOTHING
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "web_app"."roles"`);
  }
}
