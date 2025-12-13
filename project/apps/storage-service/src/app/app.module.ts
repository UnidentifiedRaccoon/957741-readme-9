import { Module } from '@nestjs/common';

import { FileUploaderModule } from '@project/file-uploader';
import { StorageConfigModule } from '@project/storage-config';

@Module({
  imports: [
    FileUploaderModule,
    StorageConfigModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
