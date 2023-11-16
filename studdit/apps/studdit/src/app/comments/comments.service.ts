import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
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

    private async userIsActive(username: string) {
        const user = await this.userModel.findOne({ username });
        return user?.isActive ?? false;
    } 

    async create(createCommentDto: CreateCommentDto): Promise<Comment> {
        try {
            const user = await this.userModel.findOne({ username: createCommentDto.username });

            if (!user) {
                throw new NotFoundException('User not found');
            }

            const isActive = await this.userIsActive(createCommentDto.username);

            if (!isActive) {
                throw new UnauthorizedException('User is not active');
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

            const isActive = await this.userIsActive(createNestedCommentDto.username);

            if (!isActive) {
                throw new UnauthorizedException('User is not active');
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

    async delete (id: string, username: string): Promise<Comment> {
        try {
            const comment = await this.commentModel.findOne({ _id: id });

            if (!comment) {
                throw new NotFoundException('Comment not found');
            }

            const isActive = await this.userIsActive(username);

            if (!isActive) {
                throw new UnauthorizedException('User is not active');
            }

            if (comment.username !== username) {
                throw new UnauthorizedException('User is not author of comment');
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

            const isActive = await this.userIsActive(username);

            if (!isActive) {
                throw new UnauthorizedException('User is not active');
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

            const isActive = await this.userIsActive(username);

            if (!isActive) {
                throw new UnauthorizedException('User is not active');
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

    async getCommentsByThreadId(id: string): Promise<Comment[]> {
        try {
            const thread = await this.threadModel
                .findOne({ _id: id })
                .populate('comments');

            if (!thread) {
                throw new NotFoundException('Thread not found');
            }

            const comments = await this.commentModel.find({ threadId: id });
            return comments;
        } catch (error) {
            throw new Error('Unable to get comments');
        }
    }

    async getCommentById(id: string): Promise<Comment> {
        try {
            const comment = await this.commentModel.findOne({ _id: id });

            if (!comment) {
                throw new NotFoundException('Comment not found');
            }

            return comment;
        } catch (error) {
            throw new Error('Unable to get comment');
        }
    }

    async getNestedComments(id: string): Promise<Comment[]> {
        try {
            const comment = await this.commentModel
                .findOne({ _id: id })
                .populate('comments')

            if (!comment) {
                throw new NotFoundException('Comment not found');
            }

            const nestedComments = await this.commentModel.find({ _id: { $in: comment.comments } });
            return nestedComments;
        } catch (error) {
            throw new Error('Unable to get nested comments');
        }
    }
}
