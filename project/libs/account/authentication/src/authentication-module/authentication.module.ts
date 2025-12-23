import { Module } from '@nestjs/common';

import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

import { getJwtOptions } from '@project/account-config';

import { BlogUserModule } from '@project/blog-user';
import { AuthenticationController } from './authentication.controller';
import { AuthenticationService } from './authentication.service';

import { JwtAccessStrategy } from '../strategies/jwt-access.strategy';
import { NotifyModule } from '@project/account-notify';
import { LocalStrategy } from '../strategies/local.strategy';
import { JwtRefreshStrategy } from '../strategies/jwt-refresh.strategy';
import { RefreshTokenModule } from '../refresh-token-module/refresh-token.module';

@Module({
  controllers: [AuthenticationController],
  providers: [AuthenticationService, JwtAccessStrategy, LocalStrategy, JwtRefreshStrategy],
  imports: [BlogUserModule, JwtModule.registerAsync({
    inject: [ConfigService],
    useFactory: getJwtOptions,
  }),
  NotifyModule,
  RefreshTokenModule,
],
  exports: [],
})
export class AuthenticationModule {}
