import { registerAs } from '@nestjs/config';
import * as Joi from 'joi';

export interface PostgresConfig {
  databaseUrl: string;
}

const validationSchema = Joi.object({
  databaseUrl: Joi.string().required(),
});

function validateConfig(config: PostgresConfig): void {
  const { error } = validationSchema.validate(config, { abortEarly: true });
  if (error) {
    throw new Error(`[Postgres Config Validation Error]: ${error.message}`);
  }
}

function getConfig(): PostgresConfig {
  const config: PostgresConfig = {
    databaseUrl: process.env.DATABASE_URL,
  };

  validateConfig(config);
  return config;
}

export default registerAs('db', getConfig);

