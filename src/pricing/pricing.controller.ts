import { Controller, Post, Body } from '@nestjs/common';
import { PricingService } from './pricing.service';

import { CalculatePricingDto } from './dto/calculate-pricing.dto';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('pricing')
export class PricingController {
  constructor(private readonly pricingService: PricingService) {}

  @Post()
  @ApiOperation({ summary: 'Calculate price breakdown' })
  @ApiResponse({
    status: 200,
    description: 'Price breakdown calculated successfully',
  })
  @ApiBody({ type: CalculatePricingDto })
  calculatePriceBreakdown(@Body() calculatePricingDto: CalculatePricingDto) {
    return this.pricingService.calculatePriceBreakdown(calculatePricingDto);
  }
}
