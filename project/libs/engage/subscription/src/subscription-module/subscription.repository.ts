import { Injectable } from '@nestjs/common';
import { BasePostgresRepository } from '@project/data-access';
import { SubscriptionEntity } from './subscription.entity';
import { SubscriptionFactory } from './subscription.factory';
import { PrismaClientService } from '@project/engage-models';
import { Subscription } from '@project/core';

@Injectable()
export class SubscriptionRepository extends BasePostgresRepository<SubscriptionEntity, Subscription> {
  constructor(
    entityFactory: SubscriptionFactory,
    readonly client: PrismaClientService,
  ) {
    super(entityFactory, client);
  }

  public async findByFollowerAndFollowing(
    followerId: string,
    followingId: string,
  ): Promise<SubscriptionEntity | null> {
    const record = await this.client.subscription.findUnique({
      where: { followerId_followingId: { followerId, followingId } },
    });

    return this.createEntityFromDocument(record as Subscription);
  }

  public override async save(entity: SubscriptionEntity): Promise<SubscriptionEntity> {
    const data = entity.toPOJO();
    const record = await this.client.subscription.create({
      data: {
        followerId: data.followerId,
        followingId: data.followingId,
      },
    });

    const result = this.createEntityFromDocument(record as Subscription);
    if (!result) {
      throw new Error('Failed to create entity from record');
    }
    return result;
  }

  public async deleteByFollowerAndFollowing(
    followerId: string,
    followingId: string,
  ): Promise<void> {
    await this.client.subscription.delete({
      where: { followerId_followingId: { followerId, followingId } },
    });
  }

  public async subscribe(
    followerId: string,
    followingId: string,
  ): Promise<{ subscribed: boolean }> {
    const existing = await this.findByFollowerAndFollowing(followerId, followingId);

    if (existing) {
      return { subscribed: true };
    }

    const entity = new SubscriptionEntity({ followerId, followingId });
    await this.save(entity);
    return { subscribed: true };
  }

  public async unsubscribe(
    followerId: string,
    followingId: string,
  ): Promise<{ subscribed: boolean }> {
    const existing = await this.findByFollowerAndFollowing(followerId, followingId);

    if (!existing) {
      return { subscribed: false };
    }

    await this.deleteByFollowerAndFollowing(followerId, followingId);
    return { subscribed: false };
  }

  public async getFollowingIds(followerId: string): Promise<string[]> {
    const records = await this.client.subscription.findMany({
      where: { followerId },
      select: { followingId: true },
    });

    return records.map((record) => record.followingId);
  }

  public async getFollowerIds(followingId: string): Promise<string[]> {
    const records = await this.client.subscription.findMany({
      where: { followingId },
      select: { followerId: true },
    });

    return records.map((record) => record.followerId);
  }

  public async countFollowers(userId: string): Promise<number> {
    return this.client.subscription.count({ where: { followingId: userId } });
  }

  public async countFollowing(userId: string): Promise<number> {
    return this.client.subscription.count({ where: { followerId: userId } });
  }

  public async isSubscribed(followerId: string, followingId: string): Promise<boolean> {
    const count = await this.client.subscription.count({ where: { followerId, followingId } });
    return count > 0;
  }
}
