import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import applicationConfig from './configurations/app.config';
import mongoConfig from './configurations/mongodb/mongo.config';
import rabbitConfig from './configurations/rabbit.config';
import mailConfig from './configurations/mail.config';

const ENV_NOTIFY_FILE_PATH = 'apps/notify-service/notify-service.env';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      load: [applicationConfig, mongoConfig, rabbitConfig, mailConfig],
      envFilePath: ENV_NOTIFY_FILE_PATH,
    }),
  ],
})
export class NotifyConfigModule {}
