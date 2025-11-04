import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { LoginUserDto } from '../dto/login-user.dto';

@Controller('auth')
export class AuthenticationController {
    constructor(
      private readonly authService: AuthenticationService
    ) {}

    @Post('register')
    public async create(@Body() dto: CreateUserDto) {
      const newUser = await this.authService.register(dto);
      return newUser.toPOJO();
    }

    @Post('login')
    public async login(@Body() dto: LoginUserDto) {
      const user = await this.authService.login(dto);
      return user.toPOJO();
    }   

    @Get('user/:id')
    public async getUser(@Param('id') id: string) {
      const user = await this.authService.getUser(id);
      return user.toPOJO();
    }
  }