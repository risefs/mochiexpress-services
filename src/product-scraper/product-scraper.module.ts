import { Module } from '@nestjs/common';
import { ProductScraperController } from './product-scraper.controller';
import { ProductScraperService } from './product-scraper.service';

@Module({
  controllers: [ProductScraperController],
  providers: [ProductScraperService],
  exports: [ProductScraperService],
})
export class ProductScraperModule {}
