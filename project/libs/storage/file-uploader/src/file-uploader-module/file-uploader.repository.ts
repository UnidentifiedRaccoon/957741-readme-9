import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { BaseMongoRepository } from '@project/data-access';

import { FileUploaderEntity } from './file-uploader.entity';
import { FileUploaderFactory } from './file-uploader.factory';
import { FileModel, FileDocument } from './file.model';

@Injectable()
export class FileUploaderRepository extends BaseMongoRepository<FileUploaderEntity, FileDocument> {
  constructor(
    entityFactory: FileUploaderFactory,
    @InjectModel(FileModel.name) fileModel: Model<FileDocument>,
  ) {
    super(entityFactory, fileModel);
  }
}
