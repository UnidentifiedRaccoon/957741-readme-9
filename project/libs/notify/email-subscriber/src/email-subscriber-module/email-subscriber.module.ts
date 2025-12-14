import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EmailSubscriberRepository } from './email-subscriber.repository';
import { EmailSubscriberFactory } from './email-subscriber.factory';
import { EmailSubscriberModel, EmailSubscriberSchema } from './email-subscriber.model';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: EmailSubscriberModel.name, schema: EmailSubscriberSchema },
    ]),
  ],
  providers: [EmailSubscriberRepository, EmailSubscriberFactory],
  exports: [EmailSubscriberRepository, EmailSubscriberFactory],
})
export class EmailSubscriberModule {}

