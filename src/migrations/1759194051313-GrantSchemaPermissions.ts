import { MigrationInterface, QueryRunner } from 'typeorm';

export class GrantSchemaPermissions1759194051313 implements MigrationInterface {
  name = 'GrantSchemaPermissions1759194051313';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      GRANT USAGE ON SCHEMA "web_app" TO "authenticated";
      GRANT USAGE ON SCHEMA "web_app" TO "service_role";
      GRANT USAGE ON SCHEMA "web_app" TO "anon"
    `);

    await queryRunner.query(`
      GRANT ALL ON ALL TABLES IN SCHEMA "web_app" TO "service_role";
      GRANT ALL ON ALL SEQUENCES IN SCHEMA "web_app" TO "service_role";
      GRANT ALL ON ALL ROUTINES IN SCHEMA "web_app" TO "service_role"
    `);

    await queryRunner.query(`
      ALTER DEFAULT PRIVILEGES IN SCHEMA "web_app" 
      GRANT ALL ON TABLES TO "service_role";
      
      ALTER DEFAULT PRIVILEGES IN SCHEMA "web_app" 
      GRANT ALL ON SEQUENCES TO "service_role";
      
      ALTER DEFAULT PRIVILEGES IN SCHEMA "web_app" 
      GRANT ALL ON ROUTINES TO "service_role"
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      REVOKE ALL ON ALL ROUTINES IN SCHEMA "web_app" FROM "service_role";
      REVOKE ALL ON ALL SEQUENCES IN SCHEMA "web_app" FROM "service_role";
      REVOKE ALL ON ALL TABLES IN SCHEMA "web_app" FROM "service_role"
    `);

    await queryRunner.query(`
      REVOKE USAGE ON SCHEMA "web_app" FROM "anon";
      REVOKE USAGE ON SCHEMA "web_app" FROM "service_role";
      REVOKE USAGE ON SCHEMA "web_app" FROM "authenticated"
    `);
  }
}
