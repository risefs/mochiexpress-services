import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class SupabaseService {
  private readonly logger = new Logger(SupabaseService.name);
  private readonly supabaseClient: SupabaseClient;

  constructor(private configService: ConfigService) {
    const supabaseUrl = this.configService.get<string>('SUPABASE_URL');
    const supabaseKey = this.configService.get<string>('SUPABASE_SERVICE_ROLE');

    if (!supabaseUrl || !supabaseKey) {
      throw new Error(
        '❌ Missing Supabase configuration. Please check SUPABASE_URL and SUPABASE_SERVICE_ROLE environment variables.',
      );
    }

    this.supabaseClient = createClient(supabaseUrl, supabaseKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
      global: {
        headers: {
          'X-Client-Info': 'mochiexpress-services',
        },
      },
    });

    this.logger.log('✅ Supabase client initialized successfully');
  }

  getClient(): SupabaseClient {
    return this.supabaseClient;
  }

  async uploadImage(
    base64Image: string,
    bucketName: string = 'product-images',
  ): Promise<string> {
    try {
      // Extract file extension from base64 data URI
      const matches = base64Image.match(
        /^data:image\/([a-zA-Z+]+);base64,(.+)$/,
      );
      if (!matches || matches.length !== 3) {
        throw new Error('Invalid base64 image format');
      }

      const fileExtension = matches[1];
      const base64Data = matches[2];
      const fileName = `${uuidv4()}.${fileExtension}`;

      // Convert base64 to buffer
      const buffer = Buffer.from(base64Data, 'base64');

      this.logger.debug(`Uploading image to bucket: ${bucketName}/${fileName}`);

      const { data, error } = await this.supabaseClient.storage
        .from(bucketName)
        .upload(fileName, buffer, {
          contentType: `image/${fileExtension}`,
          cacheControl: '3600',
          upsert: false,
        });

      if (error) {
        this.logger.error('Error uploading image to storage', error);
        throw new Error(`Error uploading image: ${error.message}`);
      }

      // Get public URL
      const { data: publicUrlData } = this.supabaseClient.storage
        .from(bucketName)
        .getPublicUrl(fileName);

      this.logger.debug(
        `Image uploaded successfully: ${publicUrlData.publicUrl}`,
      );

      return publicUrlData.publicUrl;
    } catch (error) {
      this.logger.error('Error in uploadImage', error);
      throw error;
    }
  }

  async deleteImage(
    imageUrl: string,
    bucketName: string = 'product-images',
  ): Promise<void> {
    try {
      // Extract filename from URL
      const fileName = imageUrl.split('/').pop();
      if (!fileName) {
        throw new Error('Invalid image URL format');
      }

      const { error } = await this.supabaseClient.storage
        .from(bucketName)
        .remove([fileName]);

      if (error) {
        this.logger.error('Error deleting image from storage', error);
        throw new Error(`Error deleting image: ${error.message}`);
      }

      this.logger.debug(`Image deleted successfully: ${fileName}`);
    } catch (error) {
      this.logger.error('Error in deleteImage', error);
      throw error;
    }
  }
}
