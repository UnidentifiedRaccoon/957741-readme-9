import { Module } from '@nestjs/common';
import { AuthenticationModule } from '@project/authentication';
import { BlogUserModule } from '@project/blog-user';
import { AccountConfigModule, getMongooseOptions } from '@project/account-config';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [AuthenticationModule, BlogUserModule, AccountConfigModule, MongooseModule.forRootAsync(getMongooseOptions())],
  controllers: [],
  providers: [],
})
export class AppModule {}
