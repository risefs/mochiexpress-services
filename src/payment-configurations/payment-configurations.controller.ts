import { Controller, Get, Param } from '@nestjs/common';
import { PaymentConfigurationsService } from './payment-configurations.service';

@Controller('payment-configurations')
export class PaymentConfigurationsController {
  constructor(
    private readonly paymentConfigurationsService: PaymentConfigurationsService,
  ) {}

  @Get()
  findAll() {
    return this.paymentConfigurationsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.paymentConfigurationsService.findOne(+id);
  }
}