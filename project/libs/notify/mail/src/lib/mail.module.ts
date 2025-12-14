import { Module } from '@nestjs/common';

import { MailerModule } from '@project/mailer';
import { getMailerAsyncOptions } from '@project/helpers';

import { MailService } from './mail.service';

@Module({
  imports: [
    MailerModule.forRootAsync(getMailerAsyncOptions('mail'))
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}

