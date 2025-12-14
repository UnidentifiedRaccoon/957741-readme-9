import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { NotifyConfigModule, getMongooseOptions } from '@project/notify-config';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    NotifyConfigModule,
    MongooseModule.forRootAsync(getMongooseOptions()),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
