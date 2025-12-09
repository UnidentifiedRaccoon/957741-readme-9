import { Module } from '@nestjs/common';
import { CommentModule } from '@project/engage-comment';
import { CommentApiController } from './comment-api.controller';
import { CommentApiService } from './comment-api.service';

@Module({
  imports: [CommentModule],
  controllers: [CommentApiController],
  providers: [CommentApiService],
  exports: [CommentApiService],
})
export class CommentApiModule {}

