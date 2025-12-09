import { Module } from '@nestjs/common';
import { ContentConfigModule } from '@project/content-config';
import { PrismaClientModule } from '@project/content-models';
import { PostApiModule } from '@project/content-post-api';

@Module({
  imports: [
    ContentConfigModule,
    PrismaClientModule,
    PostApiModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
