import { ApiProperty } from '@nestjs/swagger';

export class Grab {
  @ApiProperty({
    description: 'Unique identifier for the grab',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  id!: string;

  @ApiProperty({
    description: 'Unique identifier for the user',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  user_id!: string;

  @ApiProperty({
    description: 'URL of the product',
    example: 'https://www.example.com/product',
  })
  product_url!: string;

  @ApiProperty({
    description: 'Title of the product',
    example: 'Product Title',
  })
  product_title!: string;

  @ApiProperty({
    description: 'Estimated price of the product',
    example: 100,
  })
  price_estimated!: number;

  @ApiProperty({
    description: 'Quantity of the product',
    example: 1,
  })
  quantity!: number;

  @ApiProperty({
    description: 'Description of the product',
    example: 'Product Description',
  })
  description!: string;

  @ApiProperty({
    description: 'Whether the product has original packaging',
  })
  has_original_packaging!: boolean;

  @ApiProperty({
    description: 'Unique identifier for the country of origin',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  country_origin_id!: string;

  @ApiProperty({
    description: 'Unique identifier for the country of destination',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  country_destination_id!: string;

  @ApiProperty({
    description: 'Delivery deadline',
    example: '2024-01-01',
  })
  delivery_deadline!: string;

  @ApiProperty({
    description: 'Status of the grab',
  })
  status?: string;

  @ApiProperty({
    description: 'Timestamp when the grab was created',
    example: '2024-01-01T00:00:00.000Z',
  })
  created_at?: string;

  @ApiProperty({
    description: 'Timestamp when the grab was last updated',
    example: '2024-01-01T00:00:00.000Z',
  })
  updated_at?: string;

  @ApiProperty({
    description: 'Image of the product',
    example: 'https://www.example.com/product.jpg',
  })
  product_image?: string;
}
