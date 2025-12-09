import { Module } from '@nestjs/common';
import { EngageConfigModule } from '@project/engage-config';
import { PrismaClientModule } from '@project/engage-models';
import { LikeApiModule } from '@project/engage-like-api';
import { CommentApiModule } from '@project/engage-comment-api';
import { SubscriptionApiModule } from '@project/engage-subscription-api';

@Module({
  imports: [
    EngageConfigModule,
    PrismaClientModule,
    LikeApiModule,
    CommentApiModule,
    SubscriptionApiModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
