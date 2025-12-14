import { Controller } from '@nestjs/common';
import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';

import { RabbitRouting } from '@project/core';
import { EmailSubscriberApiService } from './email-subscriber-api.service';
import { CreateSubscriberDto } from '../dto/create-subscriber.dto';


@Controller()
export class EmailSubscriberApiController {
  constructor(
    private readonly subscriberService: EmailSubscriberApiService,
  ) {}

  @RabbitSubscribe({
    exchange: 'readme.notify.income',
    routingKey: RabbitRouting.AddSubscriber,
    queue: 'readme.notify.income',
  })
  public async create(subscriber: CreateSubscriberDto) {
    this.subscriberService.addSubscriber(subscriber);
  }
}