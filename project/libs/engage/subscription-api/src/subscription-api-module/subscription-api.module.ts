import { Module } from '@nestjs/common';
import { SubscriptionModule } from '@project/engage-subscription';
import { SubscriptionApiController } from './subscription-api.controller';
import { SubscriptionApiService } from './subscription-api.service';

@Module({
  imports: [SubscriptionModule],
  controllers: [SubscriptionApiController],
  providers: [SubscriptionApiService],
  exports: [SubscriptionApiService],
})
export class SubscriptionApiModule {}

