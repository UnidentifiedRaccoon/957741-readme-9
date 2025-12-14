import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';

import { Subscriber } from '@project/core';
import { mailConfig } from '@project/notify-config';
import { MailerService } from '@project/mailer';

import { EMAIL_ADD_SUBSCRIBER_SUBJECT } from './mail.constant';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  @Inject(mailConfig.KEY)
  private readonly mailConfiguration: ConfigType<typeof mailConfig>;

  public async sendNotifyNewSubscriber(subscriber: Subscriber) {
    await this.mailerService.sendMail({
      from: this.mailConfiguration.from,
      to: subscriber.email,
      subject: EMAIL_ADD_SUBSCRIBER_SUBJECT,
      template: './add-subscriber',
      context: {
        user: `${subscriber.firstname} ${subscriber.lastname}`,
        email: `${subscriber.email}`,
      },
    });
  }
}
