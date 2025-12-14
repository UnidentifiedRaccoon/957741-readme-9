import { Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { RabbitRouting } from '@project/core';
import { EmailSubscriberApiService } from './email-subscriber-api.service';
import { CreateSubscriberDto } from '../dto/create-subscriber.dto';
import { MailService } from '@project/mail';
import { EmailSubscriberApiResponseMessage } from './email-subscriber-api.constant';

@ApiTags('notifications')
@Controller('notify')
export class EmailSubscriberApiController {
  constructor(
    private readonly subscriberService: EmailSubscriberApiService,
    private readonly mailService: MailService,
  ) {}

  @RabbitSubscribe({
    exchange: 'readme.notify.income',
    routingKey: RabbitRouting.AddSubscriber,
    queue: 'readme.notify.income',
  })
  public async create(subscriber: CreateSubscriberDto) {
    this.subscriberService.addSubscriber(subscriber);
    this.mailService.sendNotifyNewSubscriber(subscriber);
  }

  @ApiOperation({ summary: 'Send notifications about new posts to all subscribers' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: EmailSubscriberApiResponseMessage.NotificationsSent,
  })
  @Post('send')
  @HttpCode(HttpStatus.OK)
  public async sendNotifications(): Promise<{ message: string; sentCount: number; postsCount: number }> {
    const result = await this.subscriberService.sendNewPostsNotifications();
    return {
      message: result.sentCount > 0
        ? EmailSubscriberApiResponseMessage.NotificationsSent
        : EmailSubscriberApiResponseMessage.NoNewPosts,
      sentCount: result.sentCount,
      postsCount: result.postsCount,
    };
  }
}