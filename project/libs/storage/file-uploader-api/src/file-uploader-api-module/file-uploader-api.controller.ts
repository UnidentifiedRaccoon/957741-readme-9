import 'multer';
import { Express } from 'express';
import { Controller, Get, Param, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { MongoIdValidationPipe } from '@project/pipes';

import { UploadedFileRdo } from '../rdo/uploaded-file.rdo';
import { FileUploaderApiService } from './file-uploader-api.service';
import { fileToRdo } from './file-uploader-api.mapper';

@Controller('files')
export class FileUploaderApiController {
  constructor(
    private readonly fileUploaderApiService: FileUploaderApiService,
  ) {}

  @Post('/upload')
  @UseInterceptors(FileInterceptor('file'))
  public async uploadFile(@UploadedFile() file: Express.Multer.File): Promise<UploadedFileRdo> {
    const fileEntity = await this.fileUploaderApiService.upload(file);
    return fileToRdo(fileEntity);
  }

  @Get(':fileId')
  public async show(@Param('fileId', MongoIdValidationPipe) fileId: string): Promise<UploadedFileRdo> {
    const existFile = await this.fileUploaderApiService.getById(fileId);
    return fileToRdo(existFile);
  }
}
