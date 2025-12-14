import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ConfigService } from '@nestjs/config';

import { FileUploaderModule } from '@project/file-uploader';
import { FileUploaderApiService } from './file-uploader-api.service';
import { FileUploaderApiController } from './file-uploader-api.controller';

const SERVE_ROOT = '/static';

@Module({
  imports: [
    FileUploaderModule,
    ServeStaticModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const rootPath = configService.get<string>('storage.uploadDirectory');

        return [{
          rootPath,
          serveRoot: SERVE_ROOT,
          serveStaticOptions: {
            fallthrough: true,
            etag: true,
          }
        }];
      }
    }),
  ],
  controllers: [FileUploaderApiController],
  providers: [FileUploaderApiService],
  exports: [FileUploaderApiService],
})
export class FileUploaderApiModule {}
