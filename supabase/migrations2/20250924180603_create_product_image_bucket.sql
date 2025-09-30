-- Create bucket (insert record in storage.buckets)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'product-images',
    'product-images',
    true,
    52428800,
    ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
) 
ON CONFLICT (id) DO NOTHING; -- If it already exists, do nothing

-- Set bucket to private
UPDATE storage.buckets SET public = false WHERE id = 'product-images';

-- Check if storage.objects_policies table exists before modifying
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
