import { Module } from '@nestjs/common';

import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

import { getJwtOptions } from '@project/account-config';

import { BlogUserModule } from '@project/blog-user';
import { AuthenticationController } from './authentication.controller';
import { AuthenticationService } from './authentication.service';

import { JwtAccessStrategy } from '../strategies/jwt-access.strategy';

@Module({
  controllers: [AuthenticationController],
  providers: [AuthenticationService, JwtAccessStrategy],
  imports: [BlogUserModule, JwtModule.registerAsync({
    inject: [ConfigService],
    useFactory: getJwtOptions,
  })],
  exports: [],
})
export class AuthenticationModule {}
