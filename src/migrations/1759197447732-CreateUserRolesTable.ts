import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUserRolesTable1759197447732 implements MigrationInterface {
  name = 'CreateUserRolesTable1759197447732';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
          CREATE TABLE IF NOT EXISTS "web_app"."user_roles" (
            "user_id" uuid NOT NULL,
            "role_id" uuid NOT NULL,
            CONSTRAINT "user_roles_pkey" PRIMARY KEY ("user_id", "role_id"),
            CONSTRAINT "user_roles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE,
            CONSTRAINT "user_roles_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "web_app"."roles"("id")
          )
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "web_app"."user_roles"`);
  }
}
