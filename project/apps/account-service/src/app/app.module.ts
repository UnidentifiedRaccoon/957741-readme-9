import { Module } from '@nestjs/common';
import { AuthenticationModule } from '@project/authentication';
import { BlogUserModule } from '@project/blog-user';

@Module({
  imports: [AuthenticationModule, BlogUserModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
