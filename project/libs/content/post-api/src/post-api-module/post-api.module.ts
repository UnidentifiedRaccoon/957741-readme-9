import { Module } from '@nestjs/common';
import { PostModule } from '@project/content-post';
import { TagModule } from '@project/content-tag';
import { PostApiController } from './post-api.controller';
import { PostApiService } from './post-api.service';

@Module({
  imports: [PostModule, TagModule],
  controllers: [PostApiController],
  providers: [PostApiService],
  exports: [PostApiService],
})
export class PostApiModule {}

