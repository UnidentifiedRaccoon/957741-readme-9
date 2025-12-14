import { Inject, Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

import { MAILER_OPTIONS } from './mailer.constant';
import { MailerModuleOptions, SendMailOptions } from './mailer.interface';

@Injectable()
export class MailerService {
  private transporter: nodemailer.Transporter;

  constructor(
    @Inject(MAILER_OPTIONS)
    private readonly options: MailerModuleOptions
  ) {
    this.transporter = nodemailer.createTransport(this.options.transport);
  }

  public async sendMail(mailOptions: SendMailOptions): Promise<nodemailer.SentMessageInfo> {
    const { template, context, ...restOptions } = mailOptions;

    let html = restOptions.html;

    if (template && this.options.template) {
      const templatePath = resolve(this.options.template.dir, `${template}.hbs`);
      const templateContent = await readFile(templatePath, 'utf-8');
      html = await this.compileTemplate(templateContent, context || {});
    }

    const from = restOptions.from || this.options.defaults?.from;

    return this.transporter.sendMail({
      ...restOptions,
      from,
      html,
    });
  }

  private async compileTemplate(
    template: string,
    context: Record<string, unknown>
  ): Promise<string> {
    if (this.options.template?.adapter) {
      return this.options.template.adapter.compile(template, context);
    }

    // Simple handlebars-like replacement for basic {{variable}} syntax
    return template.replace(/\{\{(\w+)\}\}/g, (_, key) => {
      return String(context[key] ?? '');
    });
  }
}

