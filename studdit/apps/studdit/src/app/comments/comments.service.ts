import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
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

    async createNestedComment(id: string, createNestedCommentDto: CreateNestedCommentDto): Promise<Comment> {
        try {
            const user = await this.userModel.findOne({ username: createNestedCommentDto.username });

            if (!user) {
                throw new NotFoundException('User not found');
            }

            const parentComment = await this.commentModel.findOne({ _id: id });

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

    async upvoteComment(id: string, username: string): Promise<Comment> {
        try {
            const comment = await this.commentModel.findOne({ _id: id });

            if (!comment) {
                throw new NotFoundException('Comment not found');
            }

            const user: User = await this.userModel.findOne({ username: username });

            if (!user) {
                throw new NotFoundException('User not found');
            }

            const hasUpvoted = comment.upvotes.includes(user._id);
            const hasDownvoted = comment.downvotes.includes(user._id);

            if (hasUpvoted) {
                throw new BadRequestException('User has already upvoted this comment');
            }

            if (hasDownvoted) {
                const idx = comment.downvotes.indexOf(user._id);
                comment.downvotes.splice(idx, 1);
            }

            comment.upvotes.push(user._id);
            await comment.save();

            return comment;
        } catch (error) {
            throw new Error('Unable to upvote comment');
        }
    }

    async downvoteComment(id: string, username: string): Promise<Comment> {
        try {
            const comment = await this.commentModel.findOne({ _id: id });

            if (!comment) {
                throw new NotFoundException('Comment not found');
            }

            const user: User = await this.userModel.findOne({ username: username });

            if (!user) {
                throw new NotFoundException('User not found');
            }

            const hasUpvoted = comment.upvotes.includes(user._id);
            const hasDownvoted = comment.downvotes.includes(user._id);

            if (hasDownvoted) {
                throw new BadRequestException('User has already downvoted this comment');
            }

            if (hasUpvoted) {
                const idx = comment.upvotes.indexOf(user._id);
                comment.upvotes.splice(idx, 1);
            }

            comment.downvotes.push(user._id);
            await comment.save();

            return comment;
        } catch (error) {
            throw new Error('Unable to downvote comment');
        }
    }
}
