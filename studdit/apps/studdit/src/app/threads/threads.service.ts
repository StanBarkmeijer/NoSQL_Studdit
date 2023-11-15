import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Thread } from './schemas/threads.schema';
import { User } from '../users/schemas/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
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
}
