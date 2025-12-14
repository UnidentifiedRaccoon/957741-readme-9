import { Module } from '@nestjs/common';
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { ConfigService } from '@nestjs/config';
import { EmailSubscriberModule } from '@project/email-subscriber';
import { EmailSubscriberApiController } from './email-subscriber-api.controller';
import { EmailSubscriberApiService } from './email-subscriber-api.service';

function getRabbitMQOptions(configService: ConfigService) {
  const user = configService.get<string>('rabbit.user');
  const password = configService.get<string>('rabbit.password');
  const host = configService.get<string>('rabbit.host');
  const port = configService.get<number>('rabbit.port');
  const exchange = configService.get<string>('rabbit.exchange');

  return {
    exchanges: [
      {
        name: exchange,
        type: 'direct',
      },
    ],
    uri: `amqp://${user}:${password}@${host}:${port}`,
    connectionInitOptions: { wait: true },
    enableControllerDiscovery: true,
  };
}

@Module({
  imports: [
    EmailSubscriberModule,
    RabbitMQModule.forRootAsync({
      useFactory: getRabbitMQOptions,
      inject: [ConfigService],
    }),
  ],
  controllers: [EmailSubscriberApiController],
  providers: [EmailSubscriberApiService],
  exports: [EmailSubscriberApiService],
})
export class EmailSubscriberApiModule {}

