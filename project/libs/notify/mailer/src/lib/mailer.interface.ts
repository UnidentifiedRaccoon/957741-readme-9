import { InjectionToken, ModuleMetadata, OptionalFactoryDependency } from '@nestjs/common';

export interface MailerModuleOptions {
  transport: {
    host: string;
    port: number;
    secure?: boolean;
    auth: {
      user: string;
      pass: string;
    };
  };
  defaults?: {
    from?: string;
  };
  template?: {
    dir: string;
    adapter: TemplateAdapter;
    options?: {
      strict?: boolean;
    };
  };
}

export interface TemplateAdapter {
  compile(template: string, context: Record<string, unknown>): Promise<string> | string;
}

export interface MailerAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
  useFactory: (...args: unknown[]) => Promise<MailerModuleOptions> | MailerModuleOptions;
  inject?: (InjectionToken | OptionalFactoryDependency)[];
}

export interface SendMailOptions {
  from?: string;
  to: string | string[];
  subject: string;
  text?: string;
  html?: string;
  template?: string;
  context?: Record<string, unknown>;
}

