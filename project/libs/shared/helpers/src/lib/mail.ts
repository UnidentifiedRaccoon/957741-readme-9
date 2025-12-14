import { ConfigService } from '@nestjs/config';
import { resolve } from 'node:path';

import { MailerAsyncOptions, HandlebarsAdapter } from '@project/mailer';

export function getMailerAsyncOptions(optionSpace: string): MailerAsyncOptions {
  return {
    useFactory: async (configService: ConfigService) => {
      return {
        transport: {
          host: configService.get<string>(`${optionSpace}.host`),
          port: configService.get<number>(`${optionSpace}.port`),
          secure: false,
          auth: {
            user: configService.get<string>(`${optionSpace}.user`),
            pass: configService.get<string>(`${optionSpace}.password`),
          },
        },
        defaults: {
          from: configService.get<string>(`${optionSpace}.from`),
        },
        template: {
          dir: resolve(__dirname, 'assets'),
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
      };
    },
    inject: [ConfigService],
  };
}
