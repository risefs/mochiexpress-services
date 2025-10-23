import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Get,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ProductScraperService } from './product-scraper.service';
import {
  ScrapeProductDto,
  ProductInfoDto,
} from './dto/scrape-product-response.dto';

@ApiTags('Product Scraper')
@Controller('product-scraper')
export class ProductScraperController {
  constructor(private readonly productScraperService: ProductScraperService) {}

  @Post('scrape')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Scrape product information from URL' })
  @ApiResponse({
    status: 200,
    description: 'Product information extracted successfully',
    type: ProductInfoDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid URL provided',
  })
  async scrapeProduct(
    @Body() scrapeProductDto: ScrapeProductDto,
  ): Promise<ProductInfoDto> {
    return await this.productScraperService.extractProductInfo(
      scrapeProductDto.url,
    );
  }

  @Get('scrape')
  @ApiOperation({ summary: 'Scrape product information from URL (GET)' })
  @ApiResponse({
    status: 200,
    description: 'Product information extracted successfully',
    type: ProductInfoDto,
  })
  async scrapeProductGet(@Query('url') url: string): Promise<ProductInfoDto> {
    return await this.productScraperService.extractProductInfo(url);
  }
}
