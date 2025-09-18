import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional, IsUUID } from 'class-validator';

export class Country {
  @ApiProperty({
    description: 'Unique identifier for the country',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsNotEmpty()
  @IsUUID()
  id!: string;

  @ApiProperty({
    description: 'ISO 3166-1 alpha-2 code',
    example: 'US',
  })
  @IsString()
  @IsNotEmpty()
  iso_code!: string;

  @ApiProperty({
    description: 'Official name of the country',
    example: 'United States of America',
  })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({
    description: 'Continent where the country is located',
    example: 'North America',
  })
  @IsString()
  @IsNotEmpty()
  continent!: string;

  @ApiProperty({
    description: 'ISO 4217 currency code',
    example: 'USD',
  })
  @IsString()
  @IsNotEmpty()
  currency_code!: string;

  @ApiProperty({
    description: "Emoji representation of the country's flag",
    example: '🇺🇸',
    required: false,
  })
  @IsString()
  @IsOptional()
  flag_emoji?: string;

  @ApiProperty({
    description: 'Country calling code',
    example: '+1',
    required: false,
  })
  @IsString()
  @IsOptional()
  phone_code?: string;

  @ApiProperty({
    description: "URL of the country's flag image",
    example: 'https://cdn.example.com/flags/us.svg',
    required: false,
  })
  @IsString()
  @IsOptional()
  flag_image_url?: string;

  @ApiProperty({
    description: 'Timestamp when the country record was created',
    example: '2024-01-01T00:00:00.000Z',
    required: false,
  })
  @IsOptional()
  created_at?: string;
}
