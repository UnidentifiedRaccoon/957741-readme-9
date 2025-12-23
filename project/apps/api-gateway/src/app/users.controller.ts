import { HttpService } from '@nestjs/axios';
import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { LoginUserDto, CreateUserDto } from '@project/authentication';
import { ApplicationServiceURL } from './app.config';
import { AxiosExceptionFilter } from './filters/axios-exception.filter';
import { CheckAuthGuard } from './guards/check-auth.guard';
import { ChangePasswordDto } from './dto/change-password.dto';

@ApiTags('users')
@Controller('users')
@UseFilters(AxiosExceptionFilter)
export class UsersController {
  constructor(private readonly httpService: HttpService) {}

  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: 201, description: 'User successfully registered' })
  @ApiResponse({ status: 409, description: 'User with this email already exists' })
  @Post('register')
  public async register(@Body() createUserDto: CreateUserDto) {
    const { data } = await this.httpService.axiosRef.post(
      `${ApplicationServiceURL.Users}/register`,
      createUserDto
    );
    return data;
  }

  @ApiOperation({ summary: 'Login user' })
  @ApiResponse({ status: 200, description: 'User successfully logged in' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @Post('login')
  public async login(@Body() loginUserDto: LoginUserDto) {
    const { data } = await this.httpService.axiosRef.post(
      `${ApplicationServiceURL.Users}/login`,
      loginUserDto
    );
    return data;
  }

  @ApiOperation({ summary: 'Refresh access token' })
  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: 'New tokens returned' })
  @Post('refresh')
  public async refreshToken(@Req() req: Request) {
    const { data } = await this.httpService.axiosRef.post(
      `${ApplicationServiceURL.Users}/refresh`,
      null,
      {
        headers: {
          Authorization: req.headers['authorization'],
        },
      }
    );
    return data;
  }

  @ApiOperation({ summary: 'Get user by ID' })
  @ApiBearerAuth()
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiResponse({ status: 200, description: 'User found' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @UseGuards(CheckAuthGuard)
  @Get(':id')
  public async getUser(@Param('id') id: string) {
    const { data: user } = await this.httpService.axiosRef.get(
      `${ApplicationServiceURL.Users}/user/${id}`
    );

    // Get additional user stats from other services
    const [postsCount, followersCount] = await Promise.all([
      this.httpService.axiosRef
        .get(`${ApplicationServiceURL.Content}/count/${id}`)
        .then((res) => res.data.count)
        .catch(() => 0),
      this.httpService.axiosRef
        .get(`${ApplicationServiceURL.Engage}/subscriptions/${id}/followers/count`)
        .then((res) => res.data.count)
        .catch(() => 0),
    ]);

    return {
      ...user,
      postsCount,
      followersCount,
    };
  }

  @ApiOperation({ summary: 'Change user password' })
  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: 'Password changed successfully' })
  @ApiResponse({ status: 400, description: 'Invalid current password' })
  @UseGuards(CheckAuthGuard)
  @Patch('password')
  public async changePassword(
    @Body() dto: ChangePasswordDto,
    @Req() req: Request & { user: { sub: string } }
  ) {
    const { data } = await this.httpService.axiosRef.patch(
      `${ApplicationServiceURL.Users}/password`,
      { ...dto, userId: req['user'].sub },
      {
        headers: {
          Authorization: req.headers['authorization'],
        },
      }
    );
    return data;
  }
}