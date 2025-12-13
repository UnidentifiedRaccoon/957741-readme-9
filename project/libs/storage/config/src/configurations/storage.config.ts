import { registerAs } from '@nestjs/config';
import * as Joi from 'joi';

export interface StorageConfig {
  uploadDirectory: string;
}

const validationSchema = Joi.object({
  uploadDirectory: Joi.string().required(),
});

function validateConfig(config: StorageConfig): void {
  const { error } = validationSchema.validate(config, { abortEarly: true });
  if (error) {
    throw new Error(`[Storage Config Validation Error]: ${error.message}`);
  }
}

function getConfig(): StorageConfig {
  const config: StorageConfig = {
    uploadDirectory: process.env.UPLOAD_DIRECTORY_PATH,
  };

  validateConfig(config);
  return config;
}

export default registerAs('storage', getConfig);
