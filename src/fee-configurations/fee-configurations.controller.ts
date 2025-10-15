import { Controller, Get, Param } from '@nestjs/common';
import { FeeConfigurationsService } from './fee-configurations.service';

@Controller('fee-configurations')
export class FeeConfigurationsController {
  constructor(
    private readonly feeConfigurationsService: FeeConfigurationsService,
  ) {}

  @Get()
  findAll() {
    return this.feeConfigurationsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.feeConfigurationsService.findOne(+id);
  }
}
