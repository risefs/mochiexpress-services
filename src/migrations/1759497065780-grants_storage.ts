import { MigrationInterface, QueryRunner } from 'typeorm';

export class GrantsStorage1759497065780 implements MigrationInterface {
  name = 'GrantsStorage1759497065780';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        CREATE POLICY "Authenticated users can read images"
        ON storage.objects FOR SELECT
        TO authenticated
        USING (bucket_id = 'product-images');
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        DROP POLICY "Authenticated users can read images" ON storage.objects;
        `);
  }
}
