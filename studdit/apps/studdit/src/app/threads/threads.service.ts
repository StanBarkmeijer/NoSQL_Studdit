import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Thread } from './schemas/threads.schema';
import { User } from '../users/schemas/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateThreadDto } from './dto/create-thread.dto';
import { NotFoundError } from 'rxjs';

@Injectable()
export class ThreadsService {
    constructor (
        @InjectModel(Thread.name) private threadModel: Model<Thread>,
        @InjectModel(User.name) private userModel: Model<User>,
    ) {}

    async create(createThreadDto: CreateThreadDto): Promise<Thread> {
        try {
            const user = await this.userModel.findOne({ username: createThreadDto.username });

            if (!user) {
                throw new NotFoundException('User not found');
            }

            const createdThread = await this.threadModel.create(createThreadDto);
            return createdThread;
        } catch (error) {
            throw new Error('Unable to create thread');
        }
    }

    async update(id: string, updateThreadDto: CreateThreadDto): Promise<Thread> {
        try {
            const thread = await this.threadModel.findOne({ _id: id });

            if (!thread) {
                throw new NotFoundException('Thread not found');
            }

            const updatedThread = await this.threadModel.findOneAndUpdate({ _id: id }, updateThreadDto, { new: true });
            return updatedThread;
        } catch (error) {
            throw new Error('Unable to update thread');
        }
    }

    async upvote(id: string, username: string): Promise<Thread> {
        try {
            const thread = await this.threadModel.findOne({ _id: id });

            if (!thread) {
                throw new NotFoundException('Thread not found');
            }

            const user: User = await this.userModel.findOne({ username: username });

            if (!user) {
                throw new NotFoundException('User not found');
            }

            const hasUpvoted = thread.upvotes.includes(user._id);
            const hasDownvoted = thread.downvotes.includes(user._id);

            if (hasUpvoted) {
                throw new BadRequestException('User has already upvoted this thread');
            }

            if (hasDownvoted) {
                const idx = thread.downvotes.indexOf(user._id);
                thread.downvotes.splice(idx, 1);
            }

            thread.upvotes.push(user._id);
            await thread.save();

            return thread;
        } catch (error) {
            throw new Error('Unable to upvote thread');
        }
    }

    async downvote(id: string, username: string): Promise<Thread> {
        try {
            const thread = await this.threadModel.findOne({ _id: id });

            if (!thread) {
                throw new NotFoundException('Thread not found');
            }

            const user: User = await this.userModel.findOne({ username: username });

            if (!user) {
                throw new NotFoundException('User not found');
            }

            const hasUpvoted = thread.upvotes.includes(user._id);
            const hasDownvoted = thread.downvotes.includes(user._id);

            if (hasDownvoted) {
                throw new BadRequestException('User has already downvoted this thread');
            }

            if (hasUpvoted) {
                const idx = thread.upvotes.indexOf(user._id);
                thread.upvotes.splice(idx, 1);
            }

            thread.downvotes.push(user._id);
            await thread.save();

            return thread;
        } catch (error) {
            throw new Error('Unable to downvote thread');
        }
    }

    async delete(id: string): Promise<Thread> {
        try {
            const thread = await this.threadModel.findOne({ _id: id });

            if (!thread) {
                throw new NotFoundException('Thread not found');
            }

            const deletedThread = await this.threadModel.findOneAndDelete({ _id: id });
            return deletedThread;
        } catch (error) {
            throw new Error('Unable to delete thread');
        }
    }

    async findAll(): Promise<Thread[]> {
        try {
            return this.threadModel
                .find()
                .select('-comments');
        } catch (error) {
            throw new NotFoundException('Threads not found');
        }
    }

    async findAllSortedByUpvotes(): Promise<Thread[]> {
        try {
            return this.threadModel
                .find()
                .sort({ upvotes: -1 })
                .select('-comments');
        } catch (error) {
            throw new NotFoundException('Threads not found');
        }
    }

    async findAllSortedByScore(): Promise<Thread[]> {
        try {
            return this.threadModel.aggregate([
                { $addFields: { voteDifference: { $subtract: [ { $size: "$upvotes" }, { $size: "$downvotes" } ] } } },
                { $sort: { voteDifference: -1 } },
                { $project: { comments: 0 } }
            ]);
        } catch (error) {
            throw new NotFoundException('Threads not found');
        }
    }

    async findAllSortedByComments(): Promise<Thread[]> {
        try {
            return this.threadModel.aggregate([
                { $addFields: { commentCount: { $size: "$comments" } } },
                { $sort: { commentCount: -1 } },
                { $project: { comments: 0 } }
            ]);
        } catch (error) {
            throw new NotFoundException('Threads not found');
        }
    }

    async findOne(id: string): Promise<Thread> {
        try {
            const thread = await this.threadModel.aggregate([
                { $match: { _id: new Types.ObjectId(id) } },
                {
                    $lookup: {
                        from: 'comments',
                        localField: '_id',
                        foreignField: 'thread',
                        as: 'comments'
                    }
                },
                {
                    $addFields: {
                        upvotesCount: { $size: "$upvotes" },
                        downvotesCount: { $size: "$downvotes" },
                        comments: {
                            $map: {
                                input: "$comments",
                                as: "comment",
                                in: {
                                    _id: "$$comment._id",
                                    content: "$$comment.content",
                                    upvotesCount: { $size: "$$comment.upvotes" },
                                    downvotesCount: { $size: "$$comment.downvotes" },
                                }
                            }
                        }
                    }
                },
                { $unset: ["upvotes", "downvotes"] }
            ]);

            if (!thread.length) {
                throw new NotFoundException('Thread not found');
            }

            return thread[0];
        } catch (error) {
            throw new Error('Unable to find thread');
        }
    }
}
