import {
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { AxiosExceptionFilter } from './filters/axios-exception.filter';
import { CheckAuthGuard } from './guards/check-auth.guard';
import { ApplicationServiceURL } from './app.config';

@ApiTags('notifications')
@Controller('notify')
@UseFilters(AxiosExceptionFilter)
export class NotifyController {
  constructor(private readonly httpService: HttpService) {}

  @ApiOperation({ summary: 'Send notifications about new posts to all subscribers' })
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'Notifications sent',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string' },
        sentCount: { type: 'number' },
        postsCount: { type: 'number' },
      },
    },
  })
  @UseGuards(CheckAuthGuard)
  @Post('send')
  @HttpCode(HttpStatus.OK)
  public async sendNotifications() {
    const { data } = await this.httpService.axiosRef.post(
      `${ApplicationServiceURL.Notify}/notify/send`
    );
    return data;
  }
}


