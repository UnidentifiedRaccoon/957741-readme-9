import { registerAs } from '@nestjs/config';
import * as Joi from 'joi';

export interface ContentServiceConfig {
  url: string;
}

const validationSchema = Joi.object({
  url: Joi.string().uri().required(),
});

function validateConfig(config: ContentServiceConfig): void {
  const { error } = validationSchema.validate(config, { abortEarly: true });
  if (error) {
    throw new Error(`[Content Service Config Validation Error]: ${error.message}`);
  }
}

function getConfig(): ContentServiceConfig {
  const config: ContentServiceConfig = {
    url: process.env.CONTENT_SERVICE_URL,
  };

  validateConfig(config);
  return config;
}

export default registerAs('contentService', getConfig);

