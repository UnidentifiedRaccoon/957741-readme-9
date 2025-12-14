import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { NotifyConfigModule, getMongooseOptions } from '@project/notify-config';
import { EmailSubscriberApiModule } from '@project/email-subscriber-api';

@Module({
  imports: [
    NotifyConfigModule,
    MongooseModule.forRootAsync(getMongooseOptions()),
    EmailSubscriberApiModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
