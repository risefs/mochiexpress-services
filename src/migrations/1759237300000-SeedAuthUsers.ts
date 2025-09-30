import { MigrationInterface, QueryRunner } from 'typeorm';

export class SeedAuthUsers1759237300000 implements MigrationInterface {
  name = 'SeedAuthUsers1759237300000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      INSERT INTO auth.users (
        id, 
        instance_id, 
        aud, 
        role, 
        email, 
        encrypted_password, 
        email_confirmed_at, 
        confirmation_sent_at, 
        raw_app_meta_data, 
        raw_user_meta_data, 
        is_super_admin, 
        created_at, 
        updated_at, 
        last_sign_in_at, 
        phone, 
        phone_confirmed_at, 
        confirmation_token, 
        recovery_token, 
        email_change_token_new, 
        email_change, 
        email_change_confirm_status, 
        banned_until, 
        reauthentication_token, 
        reauthentication_sent_at
      )
      VALUES
        (
          'a1b2c3d4-1111-2222-3333-444455556666', 
          '00000000-0000-0000-0000-000000000000', 
          'authenticated', 
          'authenticated', 
          'riserap92@gmail.com', 
          crypt('test1234', gen_salt('bf')), 
          now(), 
          now(), 
          '{"provider":"email","providers":["email"]}', 
          '{"name":"Ricardo Sequeira"}', 
          false, 
          now(), 
          now(), 
          now(), 
          null, 
          null, 
          null, 
          null, 
          null, 
          null, 
          0, 
          null, 
          null, 
          null
        ),
        (
          'b2c3d4e5-7777-8888-9999-aaaabbbbcccc', 
          '00000000-0000-0000-0000-000000000000', 
          'authenticated', 
          'authenticated', 
          'eduardoasm19@gmail.com', 
          crypt('test1234', gen_salt('bf')), 
          now(), 
          now(), 
          '{"provider":"email","providers":["email"]}', 
          '{"name":"Eduardo Sequeira"}', 
          false, 
          now(), 
          now(), 
          now(), 
          null, 
          null, 
          null, 
          null, 
          null, 
          null, 
          0, 
          null, 
          null, 
          null
        )
      ON CONFLICT (id) DO NOTHING
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DELETE FROM auth.users 
      WHERE id IN (
        'a1b2c3d4-1111-2222-3333-444455556666',
        'b2c3d4e5-7777-8888-9999-aaaabbbbcccc'
      )
    `);
  }
}

