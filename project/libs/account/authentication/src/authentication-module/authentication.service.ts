import dayjs from 'dayjs';
import { StringValue } from 'ms';
import { JwtService } from '@nestjs/jwt';
import {
  ConflictException,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { BlogUserEntity, BlogUserRepository, BlogUserFactory } from '@project/blog-user';
import { Token, User } from '@project/core';
import { CreateUserDto } from '../dto/create-user.dto';
import { AUTH_USER_EXISTS, AUTH_USER_NOT_FOUND, AUTH_USER_PASSWORD_WRONG } from './authentication.constant';
import { LoginUserDto } from '../dto/login-user.dto';
import { jwtConfig } from '@project/account-config';
import { ConfigType } from '@nestjs/config';
import { RefreshTokenService } from '../refresh-token-module/refresh-token.service';
import { createJWTPayload } from '@project/helpers';

@Injectable()
export class AuthenticationService {
  private readonly logger = new Logger(AuthenticationService.name);

  constructor(
    private readonly blogUserRepository: BlogUserRepository,
    private readonly blogUserFactory: BlogUserFactory,
    private readonly jwtService: JwtService,
    @Inject(jwtConfig.KEY) private readonly jwtOptions: ConfigType<typeof jwtConfig>,
    private readonly refreshTokenService: RefreshTokenService,
  ) {}

  public async register(dto: CreateUserDto): Promise<BlogUserEntity> {
    const {email, firstname, lastname, password, dateBirth} = dto;

    const blogUser = {
      email, firstname, lastname,
      avatar: '', dateOfBirth: dayjs(dateBirth).toDate(),
      passwordHash: ''
    };

    const existUser = await this.blogUserRepository.findByEmail(email);
    if (existUser) {
      throw new ConflictException(AUTH_USER_EXISTS);
    }

    const userEntity = await this.blogUserFactory.create(blogUser).setPassword(password);

    return this.blogUserRepository.save(userEntity);
  }

  public async login(dto: LoginUserDto): Promise<BlogUserEntity> {
    const {email, password} = dto;

    const user = await this.blogUserRepository.findByEmail(email);
    if (!user) {
      throw new NotFoundException(AUTH_USER_NOT_FOUND);
    }

    if (!(await user.comparePassword(password))) {
      throw new UnauthorizedException(AUTH_USER_PASSWORD_WRONG);
    }

    return user;
  }

  public async getUser(id: string): Promise<BlogUserEntity> {
    const user = await this.blogUserRepository.findById(id);
    if (!user) {
      throw new NotFoundException(AUTH_USER_NOT_FOUND);
    }
    return user;
  }

  public async createUserToken(user: User): Promise<Token> {
    const accessTokenPayload = createJWTPayload(user);
    const refreshTokenPayload = { ...accessTokenPayload, tokenId: crypto.randomUUID() };
    await this.refreshTokenService.createRefreshSession(refreshTokenPayload);

    try {
      const accessToken = await this.jwtService.signAsync(accessTokenPayload);

      const refreshToken = await this.jwtService.signAsync(refreshTokenPayload, {
        secret: this.jwtOptions.refreshTokenSecret,
        expiresIn: this.jwtOptions.refreshTokenExpiresIn as StringValue,
      });

      return { accessToken, refreshToken };
    } catch (error) {
      this.logger.error('[Token generation error]: ' + (error as Error).message);
      throw new HttpException('Ошибка при создании токена.', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  public async getUserByEmail(email: string): Promise<BlogUserEntity> {
    const existUser = await this.blogUserRepository.findByEmail(email);

    if (! existUser) {
      throw new NotFoundException(`User with email ${email} not found`);
    }

    return existUser;
  }

  public async changePassword(userId: string, currentPassword: string, newPassword: string): Promise<BlogUserEntity> {
    const user = await this.blogUserRepository.findById(userId);

    if (!user) {
      throw new NotFoundException(AUTH_USER_NOT_FOUND);
    }

    if (!(await user.comparePassword(currentPassword))) {
      throw new UnauthorizedException(AUTH_USER_PASSWORD_WRONG);
    }

    await user.setPassword(newPassword);
    const updatedUser = await this.blogUserRepository.updatePasswordHash(userId, user.passwordHash);

    if (!updatedUser) {
      throw new NotFoundException(AUTH_USER_NOT_FOUND);
    }

    return updatedUser;
  }
}
