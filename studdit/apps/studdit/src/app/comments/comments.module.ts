import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CommentSchema } from './schemas/comment.schema';
import { UserSchema } from '../users/schemas/user.schema';
import { ThreadSchema } from '../threads/schemas/threads.schema';
import { CommentsController } from './comments.controller';
import { CommentsService } from './comments.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Comment', schema: CommentSchema }]),
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
    MongooseModule.forFeature([{ name: 'Thread', schema: ThreadSchema }])
  ],
  providers: [CommentsService],
  controllers: [CommentsController]
})
export class CommentsModule {}
