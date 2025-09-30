import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateAuthTriggers1759237232701 implements MigrationInterface {
  name = 'CreateAuthTriggers1759237232701';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION "web_app"."handle_new_user"() RETURNS "trigger"
      LANGUAGE "plpgsql" SECURITY DEFINER
      AS $$
      declare
        v_first_name text;
        v_last_name text;
        v_words text[];
        v_word_count int;
      begin
        v_first_name := coalesce(
          new.raw_user_meta_data ->> 'first_name',
          new.raw_user_meta_data ->> 'name'
        );
        v_last_name := new.raw_user_meta_data ->> 'last_name';

        -- Si v_first_name es NULL, evitar error al hacer split
        if v_first_name is not null then
          v_words := regexp_split_to_array(v_first_name, '\\s+');
          v_word_count := array_length(v_words, 1);

          if v_word_count = 2 then
            v_first_name := v_words[1];
            v_last_name := v_words[2];
          end if;
        end if;

        insert into web_app.users (
          id, 
          first_name,
          last_name,
          email
        )
        values (
          new.id,
          v_first_name,
          v_last_name,
          new.email
        );
        return new;
      end;
      $$
    `);

    // 2. Función para asignar roles iniciales
    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION "web_app"."assign_init_roles"() RETURNS "trigger"
      LANGUAGE "plpgsql" SECURITY DEFINER
      AS $$
      declare
        v_buyer_role_id uuid;
        v_traveler_role_id uuid;
      begin
        select *
        into v_buyer_role_id, v_traveler_role_id
        from (
          select
            (select id from web_app.roles where name = 'buyer') as buyer_id,
            (select id from web_app.roles where name = 'traveler') as traveler_id
        ) as role_ids;

        if v_buyer_role_id is null or v_traveler_role_id is null then
          raise exception 'Uno de los roles no fue encontrado';
        end if;

        insert into web_app.user_roles (user_id, role_id)
        values
          (new.id, v_buyer_role_id),
          (new.id, v_traveler_role_id);

        return new;
      end;
      $$
    `);

    // 3. Trigger principal: Cuando se registra usuario en Supabase Auth
    await queryRunner.query(`
      CREATE OR REPLACE TRIGGER "on_auth_user_created" 
      AFTER INSERT ON "auth"."users" 
      FOR EACH ROW EXECUTE FUNCTION "web_app"."handle_new_user"()
    `);

    // 4. Trigger secundario: Cuando se crea usuario en web_app.users
    await queryRunner.query(`
      CREATE OR REPLACE TRIGGER "on_assign_init_roles" 
      AFTER INSERT ON "web_app"."users" 
      FOR EACH ROW EXECUTE FUNCTION "web_app"."assign_init_roles"()
    `);

    // 5. Otorgar permisos necesarios
    await queryRunner.query(`
      GRANT ALL ON FUNCTION "web_app"."handle_new_user"() TO "anon";
      GRANT ALL ON FUNCTION "web_app"."handle_new_user"() TO "authenticated"
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Eliminar en orden inverso
    await queryRunner.query(
      `DROP TRIGGER IF EXISTS "on_assign_init_roles" ON "web_app"."users"`,
    );
    await queryRunner.query(
      `DROP TRIGGER IF EXISTS "on_auth_user_created" ON "auth"."users"`,
    );
    await queryRunner.query(
      `DROP FUNCTION IF EXISTS "web_app"."assign_init_roles"()`,
    );
    await queryRunner.query(
      `DROP FUNCTION IF EXISTS "web_app"."handle_new_user"()`,
    );
  }
}
