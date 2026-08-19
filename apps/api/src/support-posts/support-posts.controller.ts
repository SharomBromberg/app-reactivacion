import { Body, Controller, Get, HttpStatus, Post, Query, Res } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import type { Response } from 'express';
import { SupportPostsService } from './support-posts.service';
import { CreateSupportPostDto } from './dto/create-support-post.dto';
import { QuerySupportPostDto } from './dto/query-support-post.dto';

@Controller('support-posts')
export class SupportPostsController {
  constructor(private readonly supportPostsService: SupportPostsService) {}

  @Post()
  @Throttle({ default: { limit: 5, ttl: 60_000 } })
  async create(@Body() dto: CreateSupportPostDto, @Res({ passthrough: true }) res: Response) {
    const created = await this.supportPostsService.create(dto);

    if (!created) {
      res.status(HttpStatus.OK);
      return { status: 'ok' };
    }

    return created;
  }

  @Get()
  findAll(@Query() query: QuerySupportPostDto) {
    return this.supportPostsService.findAll(query);
  }
}
