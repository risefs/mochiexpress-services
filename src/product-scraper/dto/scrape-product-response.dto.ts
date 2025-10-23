import { IsUrl, IsNotEmpty, IsString, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ScrapeProductDto {
  @ApiProperty({
    description: 'Product URL to scrape',
    example: 'https://www.amazon.com/dp/B08N5WRWNW',
  })
  @IsUrl()
  @IsNotEmpty()
  url!: string;
}

export class ProductInfoDto {
  @ApiProperty({ description: 'Product name', example: 'iPhone 13 Pro' })
  @IsString()
  name!: string;

  @ApiProperty({ description: 'Product price', example: '999.99' })
  @IsString()
  price!: string;

  @ApiProperty({ description: 'Product description' })
  @IsString()
  description!: string;

  @ApiProperty({ description: 'Scraped URL' })
  @IsString()
  url!: string;

  @ApiProperty({ description: 'Scraping success status' })
  @IsBoolean()
  success!: boolean;
}