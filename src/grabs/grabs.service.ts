import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { CreateGrabDto } from './dto/create-grab.dto';
import { SupabaseService } from '../supabase/supabase.service';
import { ImageUtils } from '../common/utils/image.utils';

@Injectable()
export class GrabsService {
  private readonly logger = new Logger(GrabsService.name);
  constructor(private readonly supabaseService: SupabaseService) {}

  async create(createGrabDto: CreateGrabDto) {
    try {
      this.logger.debug('Creating grab in Supabase');

      // Process the grab data
      const processedGrabDto = await this.processGrabData(createGrabDto);

      console.log('processedGrabDto', processedGrabDto);
      const { data, error } = await this.supabaseService
        .getClient()
        .schema('web_app')
        .from('grabs')
        .insert(processedGrabDto);

      if (error) {
        this.logger.error('Error creating grab', error);
        throw new Error('Error creating grab');
      }

      this.logger.debug('Grab created successfully');

      return data;
    } catch (error) {
      this.logger.error('Error creating grab', error);
      throw new Error('Error creating grab');
    }
  }

  private async processGrabData(
    createGrabDto: CreateGrabDto,
  ): Promise<CreateGrabDto> {
    const processedDto = { ...createGrabDto };

    // Handle product image if provided
    if (createGrabDto.product_image) {
      // Check if it's a base64 image
      if (this.isBase64Image(createGrabDto.product_image)) {
        this.logger.debug('Processing base64 product image');

        // Validate image
        const validation = ImageUtils.validateImageConstraints(
          createGrabDto.product_image,
        );
        if (!validation.isValid) {
          throw new BadRequestException(
            `Invalid product image: ${validation.error}`,
          );
        }

        try {
          // Upload to storage and get public URL
          const imageUrl = await this.supabaseService.uploadImage(
            createGrabDto.product_image,
          );
          processedDto.product_image = imageUrl;

          this.logger.debug(`Product image uploaded successfully: ${imageUrl}`);
        } catch (error) {
          this.logger.error('Error uploading product image', error);
          throw new BadRequestException('Failed to upload product image');
        }
      }
      // If it's already a URL, keep it as is
    }

    return processedDto;
  }

  private isBase64Image(str: string): boolean {
    return str.startsWith('data:image/') && str.includes(';base64,');
  }

  async findAll() {
    this.logger.debug('Querying grabs table from Supabase');

    return this.supabaseService.getClient().from('grabs').select('*');
  }

  async findOne(id: number) {
    this.logger.debug('Querying grabs table from Supabase');

    return this.supabaseService
      .getClient()
      .from('grabs')
      .select('*')
      .eq('id', id);
  }

  async remove(id: number) {
    return this.supabaseService.getClient().from('grabs').delete().eq('id', id);
  }
}
