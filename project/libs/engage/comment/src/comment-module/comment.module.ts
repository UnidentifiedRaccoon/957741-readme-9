import { Module } from '@nestjs/common';
import { PrismaClientModule } from '@project/engage-models';
import { CommentRepository } from './comment.repository';
import { CommentFactory } from './comment.factory';

@Module({
  imports: [PrismaClientModule],
  providers: [CommentRepository, CommentFactory],
  exports: [CommentRepository],
})
export class CommentModule {}

