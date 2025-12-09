import { Injectable } from '@nestjs/common';
import { EntityFactory, Subscription } from '@project/core';
import { SubscriptionEntity } from './subscription.entity';

@Injectable()
export class SubscriptionFactory implements EntityFactory<SubscriptionEntity> {
  public create(entityPlainData: Subscription): SubscriptionEntity {
    return new SubscriptionEntity(entityPlainData);
  }
}

