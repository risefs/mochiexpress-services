import { Controller, Get, Param } from '@nestjs/common';
import { TaxesService } from './taxes.service';

@Controller('taxes')
export class TaxesController {
  constructor(private readonly taxesService: TaxesService) {}

  @Get()
  findAll() {
    return this.taxesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.taxesService.findOne(id);
  }
}
