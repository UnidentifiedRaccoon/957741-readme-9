import { Injectable } from '@nestjs/common';
import { BasePostgresRepository } from '@project/data-access';
import { PostEntity } from './post.entity';
import { PostFactory } from './post.factory';
import { PrismaClientService } from '@project/content-models';
import { PostStatus, PostType, Post, Tag } from '@project/core';
import { DEFAULT_SEARCH_COUNT_LIMIT } from './post.constant';
import { PostQuery, normalizePostQuery } from './post.query';
import { PostFilter, postFilterToPrismaFilter } from './post.filter';

interface PrismaPostRecord {
  id: string;
  type: string;
  status: string;
  userId: string;
  title: string | null;
  extraFields: unknown;
  isRepost: boolean;
  originalPostId: string | null;
  originalUserId: string | null;
  createdAt: Date;
  publishedAt: Date;
  tags: { id: string; name: string }[];
}

@Injectable()
export class PostRepository extends BasePostgresRepository<PostEntity, Post> {
  constructor(
    entityFactory: PostFactory,
    readonly client: PrismaClientService,
  ) {
    super(entityFactory, client);
  }

  private adaptPrismaRecord(record: PrismaPostRecord): Post {
    return {
      id: record.id,
      type: record.type as PostType,
      status: record.status as PostStatus,
      userId: record.userId,
      title: record.title ?? undefined,
      extraFields: record.extraFields as Record<string, unknown> | undefined,
      isRepost: record.isRepost,
      originalPostId: record.originalPostId ?? undefined,
      originalUserId: record.originalUserId ?? undefined,
      createdAt: record.createdAt,
      publishedAt: record.publishedAt,
      tags: record.tags as Tag[],
    };
  }

  private createEntity(record: PrismaPostRecord | null): PostEntity | null {
    if (!record) {
      return null;
    }
    return this.createEntityFromDocument(this.adaptPrismaRecord(record));
  }

  private buildTagsConnectOrCreate(tags?: { name: string }[]) {
    if (!tags?.length) {
      return undefined;
    }

    return {
      connectOrCreate: tags.map((tag) => ({
        where: { name: tag.name },
        create: { name: tag.name },
      })),
    };
  }

  public override async save(entity: PostEntity): Promise<PostEntity> {
    const data = entity.toPOJO();
    const record = await this.client.post.create({
      data: {
        type: data.type,
        status: data.status,
        userId: data.userId,
        title: data.title,
        extraFields: (data.extraFields ?? null) as never,
        isRepost: data.isRepost,
        originalPostId: data.originalPostId,
        originalUserId: data.originalUserId,
        tags: this.buildTagsConnectOrCreate(data.tags),
      },
      include: { tags: true },
    });

    const result = this.createEntity(record as PrismaPostRecord);
    if (!result) {
      throw new Error('Failed to create entity from record');
    }
    return result;
  }

  public override async findById(id: string): Promise<PostEntity | null> {
    const record = await this.client.post.findUnique({
      where: { id },
      include: { tags: true },
    });

    return this.createEntity(record as PrismaPostRecord | null);
  }

  public override async update(entity: PostEntity): Promise<PostEntity> {
    const data = entity.toPOJO();
    const record = await this.client.post.update({
      where: { id: entity.id },
      data: {
        type: data.type,
        status: data.status,
        title: data.title,
        extraFields: (data.extraFields ?? null) as never,
        publishedAt: data.publishedAt,
        tags: data.tags?.length
          ? { set: [], ...this.buildTagsConnectOrCreate(data.tags) }
          : { set: [] },
      },
      include: { tags: true },
    });

    const result = this.createEntity(record as PrismaPostRecord);
    if (!result) {
      throw new Error('Failed to create entity from record');
    }
    return result;
  }

  public override async deleteById(id: string): Promise<void> {
    await this.client.post.delete({ where: { id } });
  }

  public async findPublished(filter?: PostFilter, query?: PostQuery): Promise<PostEntity[]> {
    const { limit, offset, sortBy, sortDirection } = normalizePostQuery(query);
    const where = postFilterToPrismaFilter(filter);

    const records = await this.client.post.findMany({
      where,
      take: limit,
      skip: offset,
      orderBy: { [sortBy]: sortDirection },
      include: { tags: true },
    });

    return records
      .map((record) => this.createEntity(record as PrismaPostRecord))
      .filter((entity): entity is PostEntity => entity !== null);
  }

  public async findByUserId(userId: string, query?: PostQuery): Promise<PostEntity[]> {
    const { limit, offset } = normalizePostQuery(query);

    const records = await this.client.post.findMany({
      where: { userId, status: PostStatus.PUBLISHED },
      take: limit,
      skip: offset,
      orderBy: { publishedAt: 'desc' },
      include: { tags: true },
    });

    return records
      .map((record) => this.createEntity(record as PrismaPostRecord))
      .filter((entity): entity is PostEntity => entity !== null);
  }

  public async findDraftsByUserId(userId: string): Promise<PostEntity[]> {
    const records = await this.client.post.findMany({
      where: { userId, status: PostStatus.DRAFT },
      orderBy: { createdAt: 'desc' },
      include: { tags: true },
    });

    return records
      .map((record) => this.createEntity(record as PrismaPostRecord))
      .filter((entity): entity is PostEntity => entity !== null);
  }

  public async findByUserIds(userIds: string[], query?: PostQuery): Promise<PostEntity[]> {
    const { limit, offset, sortBy, sortDirection } = normalizePostQuery(query);

    const records = await this.client.post.findMany({
      where: {
        userId: { in: userIds },
        status: PostStatus.PUBLISHED,
      },
      take: limit,
      skip: offset,
      orderBy: { [sortBy]: sortDirection },
      include: { tags: true },
    });

    return records
      .map((record) => this.createEntity(record as PrismaPostRecord))
      .filter((entity): entity is PostEntity => entity !== null);
  }

  public async searchByTitle(searchQuery: string, limit: number = DEFAULT_SEARCH_COUNT_LIMIT): Promise<PostEntity[]> {
    const records = await this.client.post.findMany({
      where: {
        status: PostStatus.PUBLISHED,
        title: { contains: searchQuery, mode: 'insensitive' },
      },
      take: limit,
      orderBy: { publishedAt: 'desc' },
      include: { tags: true },
    });

    return records
      .map((record) => this.createEntity(record as PrismaPostRecord))
      .filter((entity): entity is PostEntity => entity !== null);
  }

  public async existsRepost(originalPostId: string, userId: string): Promise<boolean> {
    const count = await this.client.post.count({
      where: { originalPostId, userId, isRepost: true },
    });
    return count > 0;
  }

  public async countByUserId(userId: string): Promise<number> {
    return this.client.post.count({
      where: { userId, status: PostStatus.PUBLISHED },
    });
  }
}
