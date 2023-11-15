import { Module } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { CommentSchema } from './schemas/comment.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Comment', schema: CommentSchema }]),
    MongooseModule.forFeature([{ name: 'User', schema: CommentSchema }]),
    MongooseModule.forFeature([{ name: 'Thread', schema: CommentSchema }])
  ],
  providers: [CommentsService],
  controllers: [CommentsController]
})
export class CommentsModule {}
