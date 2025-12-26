import { ConfigService } from '@nestjs/config';

import { getRabbitMQConnectionString } from './common';

export function getRabbitMQOptions(optionSpace: string) {
  return {
    useFactory: async (config: ConfigService) => ({
      exchanges: [
        {
          name: config.get<string>(`${optionSpace}.queue`),
          type: 'direct'
        }
      ],
      uri: getRabbitMQConnectionString({
        host: config.get<string>(`${optionSpace}.host`) ?? '',
        password: config.get<string>(`${optionSpace}.password`) ?? '',
        user: config.get<string>(`${optionSpace}.user`) ?? '',
        port: config.get<number>(`${optionSpace}.port`) ?? 5672,
      }),
      connectionInitOptions: { wait: false },
      enableControllerDiscovery: true,
    }),
    inject: [ConfigService]
  }
}