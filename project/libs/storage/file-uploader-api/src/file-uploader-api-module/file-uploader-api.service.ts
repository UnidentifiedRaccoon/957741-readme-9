import 'multer';
import { Express } from 'express';
import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { ensureDir } from 'fs-extra';
import { extension } from 'mime-types';
import dayjs from 'dayjs';
import { writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { randomUUID } from 'node:crypto';

import { storageConfig } from '@project/storage-config';
import { FileUploaderRepository, FileUploaderFactory, FileUploaderEntity } from '@project/file-uploader';
import { StoredFile } from '@project/core';

@Injectable()
export class FileUploaderApiService {
  private readonly logger = new Logger(FileUploaderApiService.name);
  private readonly DATE_FORMAT = 'YYYY MM';

  constructor(
    @Inject(storageConfig.KEY)
    private readonly config: ConfigType<typeof storageConfig>,
    private readonly fileRepository: FileUploaderRepository,
    private readonly fileFactory: FileUploaderFactory,
  ) {}

  private getUploadDirectoryPath(): string {
    return this.config.uploadDirectory;
  }

  private getSubUploadDirectoryPath(): string {
    const [year, month] = dayjs().format(this.DATE_FORMAT).split(' ');
    return join(year, month);
  }

  private getDestinationFilePath(filename: string): string {
    return join(this.getUploadDirectoryPath(), this.getSubUploadDirectoryPath(), filename);
  }

  private async writeFile(file: Express.Multer.File): Promise<StoredFile> {
    try {
      const uploadDirectoryPath = this.getUploadDirectoryPath();
      const fileExtension = extension(file.mimetype);
      const subDirectory = this.getSubUploadDirectoryPath();
      const filename = `${randomUUID()}.${fileExtension}`;

      const destinationFile = this.getDestinationFilePath(filename);

      await ensureDir(join(uploadDirectoryPath, subDirectory));
      await writeFile(destinationFile, new Uint8Array(file.buffer));

      return {
        fileExtension,
        filename,
        path: destinationFile,
        subDirectory,
      };
    } catch (error) {
      this.logger.error(`Error while saving file: ${error.message}`);
      throw new Error(`Can't save file`);
    }
  }

  public async upload(file: Express.Multer.File): Promise<FileUploaderEntity> {
    const storedFile = await this.writeFile(file);
    const fileEntity = this.fileFactory.create({
      hashName: storedFile.filename,
      mimetype: file.mimetype,
      originalName: file.originalname,
      path: storedFile.path,
      size: file.size,
      subDirectory: storedFile.subDirectory,
      createdAt: undefined,
      updatedAt: undefined,
    });

    await this.fileRepository.save(fileEntity);
    return fileEntity;
  }

  public async getById(fileId: string): Promise<FileUploaderEntity> {
    const existFile = await this.fileRepository.findById(fileId);

    if (!existFile) {
      throw new NotFoundException(`File with ${fileId} not found.`);
    }

    return existFile;
  }
}
