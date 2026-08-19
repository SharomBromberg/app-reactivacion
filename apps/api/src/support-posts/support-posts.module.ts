import { Module } from '@nestjs/common';
import { SupportPostsController } from './support-posts.controller';
import { SupportPostsService } from './support-posts.service';

@Module({
  controllers: [SupportPostsController],
  providers: [SupportPostsService],
})
export class SupportPostsModule {}
