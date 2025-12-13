import { Module } from '@nestjs/common';
import { PrismaClientModule } from '@project/content-models';
import { PostRepository } from './post.repository';
import { PostFactory } from './post.factory';

@Module({
  imports: [PrismaClientModule],
  providers: [PostRepository, PostFactory],
  exports: [PostRepository, PostFactory],
})
export class PostModule {}
