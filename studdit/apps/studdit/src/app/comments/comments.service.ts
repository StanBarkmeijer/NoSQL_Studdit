import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../users/schemas/user.schema';
import { Thread } from '../threads/schemas/threads.schema';
import { Comment } from './schemas/comment.schema';
import { CreateCommentDto } from './dto/create-comment.dto';
import { CreateNestedCommentDto } from './dto/create-nested-comment.dto';

@Injectable()
export class CommentsService {
    constructor (
        @InjectModel(Comment.name) private commentModel: Model<Comment>,
        @InjectModel(User.name) private userModel: Model<User>,
        @InjectModel(Thread.name) private threadModel: Model<Thread>,
    ) {}

    async create(createCommentDto: CreateCommentDto): Promise<Comment> {
        try {
            const user = await this.userModel.findOne({ username: createCommentDto.username });

            if (!user) {
                throw new NotFoundException('User not found');
            }

            const thread = await this.threadModel.findOne({ _id: createCommentDto.threadId });

            if (!thread) {
                throw new NotFoundException('Thread not found');
            }

            const createdComment = await this.commentModel.create(createCommentDto);
            thread.comments.push(createdComment._id);
            await thread.save();

            return createdComment;
        } catch (error) {
            throw new Error('Unable to create comment');
        }
    }

    async createNestedComment(createNestedCommentDto: CreateNestedCommentDto): Promise<Comment> {
        try {
            const user = await this.userModel.findOne({ username: createNestedCommentDto.username });

            if (!user) {
                throw new NotFoundException('User not found');
            }

            const parentComment = await this.commentModel.findOne({ _id: createNestedCommentDto.parentCommentId });

            if (!parentComment) {
                throw new NotFoundException('Parent comment not found');
            }

            const createdComment = await this.commentModel.create(createNestedCommentDto);
            parentComment.comments.push(createdComment._id);
            await parentComment.save();

            return createdComment;
        } catch (error) {
            throw new Error('Unable to create nested comment');
        }
    }

    async delete (id: string): Promise<Comment> {
        try {
            const comment = await this.commentModel.findOne({ _id: id });

            if (!comment) {
                throw new NotFoundException('Comment not found');
            }

            const deletedComment = await this.commentModel.findByIdAndDelete(id);
            return deletedComment;
        } catch (error) {
            throw new Error('Unable to delete comment');
        }
    }
}
