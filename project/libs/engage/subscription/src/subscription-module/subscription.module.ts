import { Module } from '@nestjs/common';
import { PrismaClientModule } from '@project/engage-models';
import { SubscriptionRepository } from './subscription.repository';
import { SubscriptionFactory } from './subscription.factory';

@Module({
  imports: [PrismaClientModule],
  providers: [SubscriptionRepository, SubscriptionFactory],
  exports: [SubscriptionRepository],
})
export class SubscriptionModule {}

