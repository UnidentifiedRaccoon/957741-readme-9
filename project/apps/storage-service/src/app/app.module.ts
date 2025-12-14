import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { FileUploaderApiModule } from '@project/file-uploader-api';
import { getMongooseOptions, StorageConfigModule } from '@project/storage-config';

@Module({
  imports: [
    FileUploaderApiModule,
    StorageConfigModule,
    MongooseModule.forRootAsync(getMongooseOptions())
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
