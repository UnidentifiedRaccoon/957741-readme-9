import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { FileUploaderRepository } from './file-uploader.repository';
import { FileUploaderFactory } from './file-uploader.factory';
import { FileModel, FileSchema } from './file.model';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: FileModel.name, schema: FileSchema },
    ]),
  ],
  providers: [
    FileUploaderRepository,
    FileUploaderFactory,
  ],
  controllers: [],
  exports: [
    FileUploaderRepository,
    FileUploaderFactory,
  ],
})
export class FileUploaderModule {}
