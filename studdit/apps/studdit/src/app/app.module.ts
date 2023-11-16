import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { ThreadsModule } from './threads/threads.module';
import { CommentsModule } from './comments/comments.module';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env'
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: `mongodb+srv://${configService.get('MONGO_USERNAME')}:${configService.get('MONGO_PASSWORD')}@${configService.get('MONGO_PATH')}/?retryWrites=true&w=majority`,
      }),
      inject: [ConfigService]
    }),
    UsersModule, 
    ThreadsModule, 
    CommentsModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
