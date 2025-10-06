import { Controller, Get, Param } from '@nestjs/common';
import { TaxConfigurationsService } from './tax-configurations.service';

@Controller('tax-configurations')
export class TaxConfigurationsController {
  constructor(private readonly taxConfigurationsService: TaxConfigurationsService) {}

  @Get()
  findAll() {
    return this.taxConfigurationsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.taxConfigurationsService.findOne(id);
  }
}

