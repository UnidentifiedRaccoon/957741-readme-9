import { DynamicModule, Module, Provider } from '@nestjs/common';

import { MAILER_OPTIONS } from './mailer.constant';
import { MailerService } from './mailer.service';
import { MailerAsyncOptions, MailerModuleOptions } from './mailer.interface';

@Module({})
export class MailerModule {
  public static forRoot(options: MailerModuleOptions): DynamicModule {
    return {
      module: MailerModule,
      providers: [
        {
          provide: MAILER_OPTIONS,
          useValue: options,
        },
        MailerService,
      ],
      exports: [MailerService],
    };
  }

  public static forRootAsync(options: MailerAsyncOptions): DynamicModule {
    const asyncProviders = this.createAsyncProviders(options);

    return {
      module: MailerModule,
      imports: options.imports || [],
      providers: [...asyncProviders, MailerService],
      exports: [MailerService],
    };
  }

  private static createAsyncProviders(options: MailerAsyncOptions): Provider[] {
    return [
      {
        provide: MAILER_OPTIONS,
        useFactory: options.useFactory,
        inject: options.inject || [],
      },
    ];
  }
}

