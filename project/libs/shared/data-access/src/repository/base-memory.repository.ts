import { Repository } from './repository';
import { Entity } from '@project/core';

export abstract class BaseMemoryRepository<T extends Entity> implements Repository<T> {
  protected entities = new Map<string, T>();

  public async findById(id: T['id']): Promise<T | null> {
    return this.entities.get(id) || null;
  }

  public async save(entity: T): Promise<void> {
    this.entities.set(entity.id, entity);
  }

  public async update(entity: T): Promise<void> {
    if (this.entities.has(entity.id)) {
      this.entities.set(entity.id, entity);
    }
  }

  public async deleteById(id: T['id']): Promise<void> {
    this.entities.delete(id);
  }
}
