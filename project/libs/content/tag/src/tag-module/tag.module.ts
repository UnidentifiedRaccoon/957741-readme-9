import { Module } from '@nestjs/common';
import { PrismaClientModule } from '@project/content-models';
import { TagRepository } from './tag.repository';
import { TagFactory } from './tag.factory';

@Module({
  imports: [PrismaClientModule],
  providers: [TagRepository, TagFactory],
  exports: [TagRepository],
})
export class TagModule {}

