import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';

import {
  HTTP_CLIENT_MAX_REDIRECTS,
  HTTP_CLIENT_TIMEOUT,
} from './app.config';
import { UsersController } from './users.controller';
import { ContentController } from './content.controller';
import {
  LikesController,
  CommentsController,
  SubscriptionsController,
} from './engage.controller';
import { FilesController } from './files.controller';
import { NotifyController } from './notify.controller';
import { CheckAuthGuard } from './guards/check-auth.guard';

@Module({
  imports: [
    HttpModule.register({
      timeout: HTTP_CLIENT_TIMEOUT,
      maxRedirects: HTTP_CLIENT_MAX_REDIRECTS,
    }),
  ],
  controllers: [
    UsersController,
    ContentController,
    LikesController,
    CommentsController,
    SubscriptionsController,
    FilesController,
    NotifyController,
  ],
  providers: [CheckAuthGuard],
})
export class AppModule {}
