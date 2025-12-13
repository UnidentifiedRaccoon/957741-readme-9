import { Injectable } from '@nestjs/common';
import { BasePostgresRepository } from '@project/data-access';
import { CommentEntity } from './comment.entity';
import { CommentFactory } from './comment.factory';
import { PrismaClientService } from '@project/engage-models';
import { Comment } from '@project/core';
import { CommentQuery, normalizeCommentQuery } from './comment.query';

@Injectable()
export class CommentRepository extends BasePostgresRepository<CommentEntity, Comment> {
  constructor(
    entityFactory: CommentFactory,
    readonly client: PrismaClientService,
  ) {
    super(entityFactory, client);
  }

  public override async save(entity: CommentEntity): Promise<CommentEntity> {
    const data = entity.toPOJO();
    const record = await this.client.comment.create({
      data: {
        postId: data.postId,
        userId: data.userId,
        text: data.text,
      },
    });

    const result = this.createEntityFromDocument(record as Comment);
    if (!result) {
      throw new Error('Failed to create entity from record');
    }
    return result;
  }

  public override async findById(id: string): Promise<CommentEntity | null> {
    const record = await this.client.comment.findUnique({ where: { id } });
    return this.createEntityFromDocument(record);
  }

  public override async deleteById(id: string): Promise<void> {
    await this.client.comment.delete({ where: { id } });
  }

  public async findByPostId(postId: string, query?: CommentQuery): Promise<CommentEntity[]> {
    const { limit, offset } = normalizeCommentQuery(query);

    const records = await this.client.comment.findMany({
      where: { postId },
      take: limit,
      skip: offset,
      orderBy: { createdAt: 'desc' },
    });

    return records.map((record) => this.createEntityFromDocument(record)).filter((entity): entity is CommentEntity => entity !== null);
  }

  public async countByPostId(postId: string): Promise<number> {
    return this.client.comment.count({ where: { postId } });
  }

  public async deleteByPostId(postId: string): Promise<number> {
    const result = await this.client.comment.deleteMany({ where: { postId } });
    return result.count;
  }
}
