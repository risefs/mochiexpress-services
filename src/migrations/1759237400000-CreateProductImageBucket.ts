import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateProductImageBucket1759237400000
  implements MigrationInterface
{
  name = 'CreateProductImageBucket1759237400000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
      VALUES (
        'product-images',
        'product-images',
        true,
        52428800,
        ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
      ) 
      ON CONFLICT (id) DO NOTHING
    `);

    await queryRunner.query(`
      UPDATE storage.buckets 
      SET public = false 
      WHERE id = 'product-images'
    `);

    await queryRunner.query(`
      DO $$
      BEGIN
        IF EXISTS (
          SELECT 1 FROM information_schema.tables 
          WHERE table_schema = 'storage' AND table_name = 'objects_policies'
        ) THEN
          DELETE FROM storage.objects_policies WHERE bucket_id = 'product-images';

          INSERT INTO storage.objects_policies (name, bucket_id, action, definition) VALUES
            ('authenticated_read_product_images', 'product-images', 'select', 'auth.role() = ''authenticated'''),
            ('authenticated_write_product_images', 'product-images', 'insert', 'auth.role() = ''authenticated'''),
            ('authenticated_update_product_images', 'product-images', 'update', 'auth.role() = ''authenticated'''),
            ('authenticated_delete_product_images', 'product-images', 'delete', 'auth.role() = ''authenticated''');
        END IF;
      END
      $$;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DO $$
      BEGIN
        IF EXISTS (
          SELECT 1 FROM information_schema.tables 
          WHERE table_schema = 'storage' AND table_name = 'objects_policies'
        ) THEN
          DELETE FROM storage.objects_policies WHERE bucket_id = 'product-images';
        END IF;
      END
      $$;
    `);

    await queryRunner.query(`
      DELETE FROM storage.objects WHERE bucket_id = 'product-images'
    `);

    await queryRunner.query(`
      DELETE FROM storage.buckets WHERE id = 'product-images'
    `);
  }
}
