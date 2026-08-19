import { Body, Controller, Get, HttpStatus, Param, Post, Query, Res } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import type { Response } from 'express';
import { BusinessesService } from './businesses.service';
import { CreateBusinessDto } from './dto/create-business.dto';
import { QueryBusinessDto } from './dto/query-business.dto';

@Controller('businesses')
export class BusinessesController {
  constructor(private readonly businessesService: BusinessesService) {}

  @Post()
  @Throttle({ default: { limit: 5, ttl: 60_000 } })
  async create(@Body() dto: CreateBusinessDto, @Res({ passthrough: true }) res: Response) {
    const created = await this.businessesService.create(dto);

    if (!created) {
      res.status(HttpStatus.OK);
      return { status: 'ok' };
    }

    return created;
  }

  @Get()
  findAll(@Query() query: QueryBusinessDto) {
    return this.businessesService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.businessesService.findOne(id);
  }
}
