export * from './lib/data-access.module';
export * from './repository/repository.interface';

export { BaseMemoryRepository } from './repository/base-memory.repository';
export { BaseMongoRepository } from './repository/base-mongo.repository';
export { BasePostgresRepository } from './repository/base-postgres.repository';
export { PrismaClientService } from './prisma-client/prisma-client.service';
