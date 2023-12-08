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

    async create(createCommentDto: CreateCommentDto): Promise<Comment> {
        const session = await this.commentModel.db.startSession();
        session.startTransaction();

        try {
            const user = await this.userModel.findOne({ username: createCommentDto.username }).session(session);

            if (!user) {
                throw new NotFoundException('User not found');
            }

            const thread = await this.threadModel.findOne({ _id: createCommentDto.threadId }).session(session);

            if (!thread) {
                throw new NotFoundException('Thread not found');
            }

            const createdComment = await this.commentModel.create([createCommentDto], { session });
            thread.comments.push(createdComment[0]._id);
            await thread.save({ session });

            await session.commitTransaction();

            return createdComment[0];
        } catch (error) {
            await session.abortTransaction();
            throw new Error('Unable to create comment');
        } finally {
            session.endSession();
        }
    }

    async createNestedComment(id: string, createNestedCommentDto: CreateNestedCommentDto): Promise<Comment> {
        const session = await this.commentModel.db.startSession();
        session.startTransaction();

        try {
            const user = await this.userModel.findOne({ username: createNestedCommentDto.username }).session(session);

            if (!user) {
                throw new NotFoundException('User not found');
            }

            const parentComment = await this.commentModel.findOne({ _id: id }).session(session);

            if (!parentComment) {
                throw new NotFoundException('Parent comment not found');
            }

            const createdComment = await this.commentModel.create([createNestedCommentDto], { session });
            parentComment.comments.push(createdComment[0]._id);
            await parentComment.save({ session });

            await session.commitTransaction();

            return createdComment[0];
        } catch (error) {
            await session.abortTransaction();
            throw new Error('Unable to create nested comment');
        } finally {
            session.endSession();
        }
    }

    async delete(id: string, username: string): Promise<Comment> {
        const session = await this.commentModel.db.startSession();
        session.startTransaction();

        try {
            const comment = await this.commentModel.findOne({ _id: id }).session(session);

            if (!comment) {
                throw new NotFoundException('Comment not found');
            }

            if (comment.username !== username) {
                throw new UnauthorizedException('User is not author of comment');
            }

            const deletedComment = await this.commentModel.findByIdAndDelete(id, { session });

            await session.commitTransaction();

            return deletedComment;
        } catch (error) {
            await session.abortTransaction();
            throw new Error('Unable to delete comment');
        } finally {
            session.endSession();
        }
    }

    async upvoteComment(id: string, username: string): Promise<Comment> {
        const session = await this.commentModel.db.startSession();
        session.startTransaction();

        try {
            const comment = await this.commentModel.findOne({ _id: id }).session(session);

            if (!comment) {
                throw new NotFoundException('Comment not found');
            }

            const user: User = await this.userModel.findOne({ username: username }).session(session);

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
            await comment.save({ session });

            await session.commitTransaction();

            return comment;
        } catch (error) {
            await session.abortTransaction();
            throw new Error('Unable to upvote comment');
        } finally {
            session.endSession();
        }
    }

    async downvoteComment(id: string, username: string): Promise<Comment> {
        const session = await this.commentModel.db.startSession();
        session.startTransaction();

        try {
            const comment = await this.commentModel.findOne({ _id: id }).session(session);

            if (!comment) {
                throw new NotFoundException('Comment not found');
            }

            const user: User = await this.userModel.findOne({ username: username }).session(session);

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
            await comment.save({ session });

            await session.commitTransaction();

            return comment;
        } catch (error) {
            await session.abortTransaction();
            throw new Error('Unable to downvote comment');
        } finally {
            session.endSession();
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
