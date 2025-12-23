import 'multer';
import { Express } from 'express';
import {
  Controller,
  Get,
  Param,
  Post,
  UploadedFile,
  UseFilters,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { HttpService } from '@nestjs/axios';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import FormData from 'form-data';

import { AxiosExceptionFilter } from './filters/axios-exception.filter';
import { CheckAuthGuard } from './guards/check-auth.guard';
import { ApplicationServiceURL } from './app.config';

@ApiTags('files')
@Controller('files')
@UseFilters(AxiosExceptionFilter)
export class FilesController {
  constructor(private readonly httpService: HttpService) {}

  @ApiOperation({ summary: 'Upload a file' })
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'File uploaded successfully' })
  @UseGuards(CheckAuthGuard)
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  public async uploadFile(@UploadedFile() file: Express.Multer.File) {
    const formData = new FormData();
    formData.append('file', file.buffer, {
      filename: file.originalname,
      contentType: file.mimetype,
    });

    const { data } = await this.httpService.axiosRef.post(
      `${ApplicationServiceURL.Storage}/upload`,
      formData,
      {
        headers: formData.getHeaders(),
      }
    );
    return data;
  }

  @ApiOperation({ summary: 'Get file by ID' })
  @ApiParam({ name: 'fileId', description: 'File ID' })
  @ApiResponse({ status: 200, description: 'File info returned' })
  @ApiResponse({ status: 404, description: 'File not found' })
  @Get(':fileId')
  public async getFile(@Param('fileId') fileId: string) {
    const { data } = await this.httpService.axiosRef.get(
      `${ApplicationServiceURL.Storage}/${fileId}`
    );
    return data;
  }
}


