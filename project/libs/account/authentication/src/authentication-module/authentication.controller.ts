import { Body, Controller, Get, HttpStatus, Param, Post } from '@nestjs/common';
import { ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthenticationService } from './authentication.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { LoginUserDto } from '../dto/login-user.dto';
import { UserRdo } from '../rdo/user.rdo';
import { LoggedUserRdo } from '../rdo/logged-user.rdo';
import { AuthenticationResponseMessage } from './authentication.constant';
import { fillDto } from '@project/helpers';

@ApiTags('authentication')
@Controller('auth')
export class AuthenticationController {
    constructor(
      private readonly authService: AuthenticationService
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
    public async create(@Body() dto: CreateUserDto) {
      const newUser = await this.authService.register(dto);
      return fillDto(UserRdo, newUser.toPOJO());
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
    @Post('login')
    public async login(@Body() dto: LoginUserDto) {
      const user = await this.authService.login(dto);
      return fillDto(LoggedUserRdo, user.toPOJO());
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
    @Get('user/:id')
    public async getUser(@Param('id') id: string) {
      const user = await this.authService.getUser(id);
      return fillDto(UserRdo, user.toPOJO());
    }
  }