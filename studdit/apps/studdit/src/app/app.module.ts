import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { MongooseModule } from '@nestjs/mongoose';
import { UsersController } from './users/users.controller';
import { UsersService } from './users/users.service';
import { UsersModule } from './users/users.module';
import { ThreadsController } from './threads/threads.controller';
import { ThreadsModule } from './threads/threads.module';
import { CommentsModule } from './comments/comments.module';

@Module({
  imports: [
    MongooseModule.forRoot("mongodb+srv://administrator:PC8u9kW6@studdit.thvtbws.mongodb.net/?retryWrites=true&w=majority"), 
    UsersModule, ThreadsModule, CommentsModule
  ],
  controllers: [AppController, ThreadsController],
  providers: [AppService],
})
export class AppModule {}
