import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { FileUploaderModule } from '@project/file-uploader';
import { getMongooseOptions, StorageConfigModule } from '@project/storage-config';

@Module({
  imports: [
    FileUploaderModule,
    StorageConfigModule,
    MongooseModule.forRootAsync(getMongooseOptions())
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
