import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import applicationConfig from './configurations/app.config';
import postgresConfig from './configurations/postgres.config';

const ENV_ENGAGE_FILE_PATH = 'apps/engage-service/engage-service.env';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      load: [applicationConfig, postgresConfig],
      envFilePath: ENV_ENGAGE_FILE_PATH,
    }),
  ],
})
export class EngageConfigModule {}

