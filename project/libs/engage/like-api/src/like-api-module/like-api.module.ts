import { Module } from '@nestjs/common';
import { LikeModule } from '@project/engage-like';
import { LikeApiController } from './like-api.controller';
import { LikeApiService } from './like-api.service';

@Module({
  imports: [LikeModule],
  controllers: [LikeApiController],
  providers: [LikeApiService],
  exports: [LikeApiService],
})
export class LikeApiModule {}

