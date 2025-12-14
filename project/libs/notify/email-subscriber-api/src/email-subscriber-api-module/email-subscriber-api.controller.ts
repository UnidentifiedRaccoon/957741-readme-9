import { Controller, Logger } from '@nestjs/common';
import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { RabbitRouting } from '@project/core';
import { EmailSubscriberApiService } from './email-subscriber-api.service';
import { CreateSubscriberDto } from '../dto/create-subscriber.dto';

@Controller()
export class EmailSubscriberApiController {
  private readonly logger = new Logger(EmailSubscriberApiController.name);

  constructor(private readonly emailSubscriberApiService: EmailSubscriberApiService) {}

  @RabbitSubscribe({
    exchange: 'typoteka.notify',
    routingKey: RabbitRouting.AddSubscriber,
    queue: 'typoteka.notify.income',
  })
  public async create(subscriber: CreateSubscriberDto): Promise<void> {
    this.logger.log(`Received subscriber: ${JSON.stringify(subscriber)}`);
    await this.emailSubscriberApiService.addSubscriber(subscriber);
    this.logger.log(`Subscriber ${subscriber.email} added successfully`);
  }
}

