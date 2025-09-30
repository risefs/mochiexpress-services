import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUsersTable1759197409508 implements MigrationInterface {
  name = 'CreateUsersTable1759197409508';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "web_app"."users" (
        "id" uuid NOT NULL,
        "first_name" text,
        "last_name" text,
        "email" text,
        "created_at" timestamp with time zone DEFAULT timezone('utc'::text, now()),
        "updated_at" timestamp with time zone DEFAULT timezone('utc'::text, now()),
        CONSTRAINT "users_pkey" PRIMARY KEY ("id"),
        CONSTRAINT "users_id_fkey" FOREIGN KEY ("id") REFERENCES "auth"."users"("id") ON DELETE CASCADE
      )
    `);

    await queryRunner.query(`
      ALTER TABLE "web_app"."users" ENABLE ROW LEVEL SECURITY
    `);

    await queryRunner.query(`
      GRANT ALL ON "web_app"."users" TO "authenticated";
      GRANT SELECT ON "web_app"."users" TO "anon"
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "web_app"."users"`);
  }
}
