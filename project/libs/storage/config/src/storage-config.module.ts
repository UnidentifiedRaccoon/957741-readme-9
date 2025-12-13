import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import applicationConfig from './configurations/app.config';
import storageConfig from './configurations/storage.config';

const ENV_STORAGE_FILE_PATH = 'apps/storage-service/storage-service.env';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      load: [applicationConfig, storageConfig],
      envFilePath: ENV_STORAGE_FILE_PATH,
    }),
  ],
})
export class StorageConfigModule {}
