import { Injectable } from '@nestjs/common';
import { TagEntity } from './tag.entity';
import { TagFactory } from './tag.factory';
import { PrismaClientService } from '@project/content-models';

@Injectable()
export class TagRepository {
  constructor(
    private readonly tagFactory: TagFactory,
    private readonly prisma: PrismaClientService,
  ) {}

  public async findByName(name: string): Promise<TagEntity | null> {
    const record = await this.prisma.tag.findUnique({
      where: { name: name.toLowerCase() },
    });

    if (!record) {
      return null;
    }

    return this.tagFactory.create(record);
  }

  public async findOrCreate(name: string): Promise<TagEntity> {
    const normalizedName = name.toLowerCase();
    
    const record = await this.prisma.tag.upsert({
      where: { name: normalizedName },
      update: {},
      create: { name: normalizedName },
    });

    return this.tagFactory.create(record);
  }

  public async findByNames(names: string[]): Promise<TagEntity[]> {
    const normalizedNames = names.map((name) => name.toLowerCase());
    
    const records = await this.prisma.tag.findMany({
      where: {
        name: { in: normalizedNames },
      },
    });

    return records.map((record) => this.tagFactory.create(record));
  }

  public async findOrCreateMany(names: string[]): Promise<TagEntity[]> {
    const uniqueNames = [...new Set(names.map((name) => name.toLowerCase()))];
    
    const entities: TagEntity[] = [];
    for (const name of uniqueNames) {
      const entity = await this.findOrCreate(name);
      entities.push(entity);
    }
    
    return entities;
  }
}

