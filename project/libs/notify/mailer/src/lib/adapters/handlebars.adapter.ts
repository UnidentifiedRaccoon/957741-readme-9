import * as Handlebars from 'handlebars';
import { TemplateAdapter } from '../mailer.interface';

export class HandlebarsAdapter implements TemplateAdapter {
  public compile(template: string, context: Record<string, unknown>): string {
    const compiledTemplate = Handlebars.compile(template);
    return compiledTemplate(context);
  }
}

