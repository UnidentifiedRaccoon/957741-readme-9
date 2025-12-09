import { Injectable } from '@nestjs/common';
import { BasePostgresRepository } from '@project/data-access';
import { LikeEntity } from './like.entity';
import { LikeFactory } from './like.factory';
import { PrismaClientService } from '@project/engage-models';
import { Like } from '@project/core';

@Injectable()
export class LikeRepository extends BasePostgresRepository<LikeEntity, Like> {
  constructor(
    entityFactory: LikeFactory,
    readonly client: PrismaClientService,
  ) {
    super(entityFactory, client);
  }

  public async findByPostAndUser(postId: string, userId: string): Promise<LikeEntity | null> {
    const record = await this.client.like.findUnique({
      where: { postId_userId: { postId, userId } },
    });

    return this.createEntityFromDocument(record as Like);
  }

  public override async save(entity: LikeEntity): Promise<LikeEntity> {
    const data = entity.toPOJO();
    const record = await this.client.like.create({
      data: {
        postId: data.postId,
        userId: data.userId,
      },
    });

    const result = this.createEntityFromDocument(record as Like);
    if (!result) {
      throw new Error('Failed to create entity from record');
    }
    return result;
  }

  public override async deleteById(id: string): Promise<void> {
    await this.client.like.delete({ where: { id } });
  }

  public async deleteByPostAndUser(postId: string, userId: string): Promise<void> {
    await this.client.like.delete({
      where: { postId_userId: { postId, userId } },
    });
  }

  public async toggleLike(postId: string, userId: string): Promise<{ liked: boolean }> {
    const existingLike = await this.findByPostAndUser(postId, userId);

    if (existingLike) {
      await this.deleteByPostAndUser(postId, userId);
      return { liked: false };
    }

    const likeEntity = new LikeEntity({ postId, userId });
    await this.save(likeEntity);
    return { liked: true };
  }

  public async countByPostId(postId: string): Promise<number> {
    return this.client.like.count({ where: { postId } });
  }

  public async findByPostId(postId: string): Promise<LikeEntity[]> {
    const records = await this.client.like.findMany({
      where: { postId },
      orderBy: { createdAt: 'desc' },
    });

    return records
      .map((record) => this.createEntityFromDocument(record as Like))
      .filter((entity): entity is LikeEntity => entity !== null);
  }

  public async deleteByPostId(postId: string): Promise<number> {
    const result = await this.client.like.deleteMany({ where: { postId } });
    return result.count;
  }

  public async existsByPostAndUser(postId: string, userId: string): Promise<boolean> {
    const count = await this.client.like.count({ where: { postId, userId } });
    return count > 0;
  }
}
