import { Entity, StorableEntity, EntityFactory } from '@project/core';
import { Repository } from './repository.interface';
import { PrismaClientService } from '../prisma-client/prisma-client.service';

export abstract class BasePostgresRepository<
  T extends Entity & StorableEntity<ReturnType<T['toPOJO']>>,
  DocumentType = ReturnType<T['toPOJO']>
> implements Repository<T> {

  constructor(
    protected entityFactory: EntityFactory<T>,
    protected readonly client: PrismaClientService,
  ) {}

  protected createEntityFromDocument(document: DocumentType | null): T | null {
    if (!document) {
      return null;
    }

    return this.entityFactory.create(document as ReturnType<T['toPOJO']>);
  }

  public async findById(_id: T['id']): Promise<T | null> {
    throw new Error('Not implemented');
  }

  public async save(_entity: T): Promise<T> {
    throw new Error('Not implemented');
  }

  public async update(_entity: T): Promise<T> {
    throw new Error('Not implemented');
  }

  public async deleteById(_id: T['id']): Promise<void> {
    throw new Error('Not implemented');
  }
}
