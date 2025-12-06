import { Module } from '@nestjs/common';
import { AuthenticationModule } from '@project/authentication';
import { BlogUserModule } from '@project/blog-user';
import { AccountConfigModule } from '@project/account-config';

@Module({
  imports: [AuthenticationModule, BlogUserModule, AccountConfigModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
