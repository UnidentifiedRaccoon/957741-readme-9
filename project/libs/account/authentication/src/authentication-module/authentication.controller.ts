import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, Req, UseGuards } from '@nestjs/common';
import { ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthenticationService } from './authentication.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { LoginUserDto } from '../dto/login-user.dto';
import { UserRdo } from '../rdo/user.rdo';
import { LoggedUserRdo } from '../rdo/logged-user.rdo';
import { AuthenticationResponseMessage } from './authentication.constant';
import { userToRdo, loggedUserToRdo } from './authentication.mapper';
import { MongoIdValidationPipe } from '@project/pipes';
import { NotifyService } from '@project/account-notify';
import { RequestWithUser } from './request-with-user.interface';
import { LocalAuthGuard } from '../guards/local-auth.guard';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { JwtRefreshGuard } from '../guards/jwt-refresh.guard';

@ApiTags('authentication')
@Controller('auth')
export class AuthenticationController {
    constructor(
      private readonly authService: AuthenticationService,
      private readonly notifyService: NotifyService,
    ) {}

    @ApiResponse({
      status: HttpStatus.CREATED,
      description: AuthenticationResponseMessage.UserCreated,
      type: UserRdo,
    })
    @ApiResponse({
      status: HttpStatus.CONFLICT,
      description: AuthenticationResponseMessage.UserExists,
    })
    @Post('register')
    public async create(@Body() dto: CreateUserDto): Promise<UserRdo> {
      const newUser = await this.authService.register(dto);
      const { email, firstname, lastname } = newUser;
      await this.notifyService.registerSubscriber({ email, firstname, lastname });
      return userToRdo(newUser);
    }

    @ApiResponse({
      status: HttpStatus.OK,
      description: AuthenticationResponseMessage.UserLogged,
      type: LoggedUserRdo,
    })
    @ApiResponse({
      status: HttpStatus.UNAUTHORIZED,
      description: AuthenticationResponseMessage.UserPasswordWrong,
    })
    @ApiResponse({
      status: HttpStatus.NOT_FOUND,
      description: AuthenticationResponseMessage.UserNotFound,
    })
    @UseGuards(LocalAuthGuard)
    @Post('login')
    public async login(
      @Body() _dto: LoginUserDto, // Для Swagger документации и валидации
      @Req() { user }: RequestWithUser,
    ) {
      const userToken = await this.authService.createUserToken(user);
      return loggedUserToRdo(user, userToken.accessToken);
    }   

    @ApiResponse({
      type: UserRdo,
      status: HttpStatus.OK,
      description: AuthenticationResponseMessage.UserFound,
    })
    @ApiResponse({
      status: HttpStatus.NOT_FOUND,
      description: AuthenticationResponseMessage.UserNotFound,
    })
    @ApiParam({ name: 'id', description: 'User ID' })
    @UseGuards(JwtAuthGuard)
    @Get('user/:id')
    public async getUser(@Param('id', MongoIdValidationPipe) id: string): Promise<UserRdo> {
      const user = await this.authService.getUser(id);
      return userToRdo(user);
    }

    @HttpCode(HttpStatus.OK)
    @ApiResponse({
      status: HttpStatus.OK,
      description: 'Get a new access/refresh tokens'
    })
    @UseGuards(JwtRefreshGuard)
    @Post('refresh')
    public async refreshToken(@Req() { user }: RequestWithUser) {
      return this.authService.createUserToken(user);
    }
  }
