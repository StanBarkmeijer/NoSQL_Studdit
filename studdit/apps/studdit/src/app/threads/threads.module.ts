import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../users/schemas/user.schema';
import { Comment, CommentSchema } from '../comments/schemas/comment.schema';
import { ThreadsController } from './threads.controller';
import { ThreadsService } from './threads.service';
import { Thread, ThreadSchema } from './schemas/threads.schema';
import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { IsActiveMiddleware } from '../middleware/is-active.middleware';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Thread.name, schema: ThreadSchema },
      { name: User.name, schema: UserSchema },
      { name: Comment.name, schema: CommentSchema }
    ])
  ],
  controllers: [ThreadsController],
  providers: [ThreadsService]
})
export class ThreadsModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(IsActiveMiddleware)
      .forRoutes(ThreadsController)
  }
}