import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CommentSchema } from './schemas/comment.schema';
import { UserSchema } from '../users/schemas/user.schema';
import { ThreadSchema } from '../threads/schemas/threads.schema';
import { CommentsController } from './comments.controller';
import { CommentsService } from './comments.service';
import { IsActiveMiddleware } from '../middleware/is-active.middleware';
import { MiddlewareModule } from '../middleware/middleware.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Comment', schema: CommentSchema },
      { name: 'User', schema: UserSchema },
      { name: 'Thread', schema: ThreadSchema }
    ]),
    MiddlewareModule.forRoot()
  ],
  providers: [CommentsService],
  controllers: [CommentsController]
})
export class CommentsModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
      consumer
        .apply(IsActiveMiddleware)
        .forRoutes(CommentsController)
  }
}
