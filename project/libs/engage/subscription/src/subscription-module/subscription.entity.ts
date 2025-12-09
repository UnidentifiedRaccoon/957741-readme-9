import { Entity, StorableEntity, Subscription } from '@project/core';

export class SubscriptionEntity extends Entity implements StorableEntity<Subscription> {
  public followerId: string;
  public followingId: string;
  public createdAt?: Date;

  constructor(subscription?: Subscription) {
    super();
    this.populate(subscription);
  }

  public populate(subscription?: Subscription): void {
    if (!subscription) {
      return;
    }

    this.id = subscription.id ?? '';
    this.followerId = subscription.followerId;
    this.followingId = subscription.followingId;
    this.createdAt = subscription.createdAt;
  }

  public toPOJO(): Subscription {
    return {
      id: this.id,
      followerId: this.followerId,
      followingId: this.followingId,
      createdAt: this.createdAt,
    };
  }
}

