import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { GrabsService } from './grabs.service';
import { CreateGrabDto } from './dto/create-grab.dto';
import { ApiOperation } from '@nestjs/swagger';

@Controller('grabs')
export class GrabsController {
  constructor(private readonly grabsService: GrabsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new grab' })
  create(@Body() createGrabDto: CreateGrabDto) {
    return this.grabsService.create(createGrabDto);
  }

  @Get()
  findAll() {
    return this.grabsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.grabsService.findOne(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.grabsService.remove(+id);
  }
}
