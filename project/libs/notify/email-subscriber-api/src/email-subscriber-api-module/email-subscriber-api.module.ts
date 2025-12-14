import { Module } from '@nestjs/common';
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { EmailSubscriberModule } from '@project/email-subscriber';
import { EmailSubscriberApiController } from './email-subscriber-api.controller';
import { EmailSubscriberApiService } from './email-subscriber-api.service';
import { getRabbitMQOptions } from '@project/helpers';

@Module({
  imports: [
    EmailSubscriberModule,
    RabbitMQModule.forRootAsync(getRabbitMQOptions('rabbit')),
  ],
  controllers: [EmailSubscriberApiController],
  providers: [EmailSubscriberApiService],
  exports: [EmailSubscriberApiService],
})
export class EmailSubscriberApiModule {}

