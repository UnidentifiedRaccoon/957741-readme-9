import { Module } from '@nestjs/common';
import { PrismaClientModule } from '@project/engage-models';
import { LikeRepository } from './like.repository';
import { LikeFactory } from './like.factory';

@Module({
  imports: [PrismaClientModule],
  providers: [LikeRepository, LikeFactory],
  exports: [LikeRepository],
})
export class LikeModule {}

