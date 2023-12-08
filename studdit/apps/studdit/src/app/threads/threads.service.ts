import { BadRequestException, Inject, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { Thread } from './schemas/threads.schema';
import { User } from '../users/schemas/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateThreadDto } from './dto/create-thread.dto';
import { NotFoundError } from 'rxjs';
import { Neo4jService } from '../neo4j/neo4j.service';
import { UpdateThreadDto } from './dto/update-thread.dto';

@Injectable()
export class ThreadsService {
    constructor (
        @InjectModel(Thread.name) private threadModel: Model<Thread>,
        @InjectModel(User.name) private userModel: Model<User>,
        private readonly neo4jService: Neo4jService
    ) {}

    async create(createThreadDto: CreateThreadDto): Promise<Thread> {
        const neo = this.neo4jService.beginTransaction();

        const session = await this.threadModel.db.startSession();
        session.startTransaction();

        try {
            const createdThread = await this.threadModel.create([createThreadDto], { session });

            await neo.run(
                `CREATE (t:Thread { title: $title, content: $content, username: $username }) RETURN t`,
                { title: createThreadDto.title, content: createThreadDto.content, username: createThreadDto.username }
            );

            await neo.commit();
            await session.commitTransaction();

            return createdThread[0];
        } catch (error) {
            await neo.rollback();
            await session.abortTransaction();
            throw error;
        } finally {
            session.endSession();
        }
    }

    async update(id: string, updateThreadDto: UpdateThreadDto): Promise<Thread> {
        const session = await this.threadModel.db.startSession();
        session.startTransaction();

        try {
            const thread = await this.threadModel.findOne({ _id: id }).session(session);

            if (!thread) {
                throw new NotFoundException('Thread not found');
            }

            if (thread.username !== updateThreadDto.username) {
                throw new UnauthorizedException('User is not authorized to update this thread');
            }

            const updatedThread = await this.threadModel.findOneAndUpdate({ _id: id }, updateThreadDto, { new: true, session });

            await session.commitTransaction();

            return updatedThread;
        } catch (error) {
            await session.abortTransaction();
            throw error;
        } finally {
            session.endSession();
        }
    }

    async upvote(id: string, username: string): Promise<Thread> {
        const neo = this.neo4jService.beginTransaction();
        const session = await this.threadModel.db.startSession();
        session.startTransaction();

        try {
            const thread = await this.threadModel.findOne({ _id: id }).session(session);

            if (!thread) {
                throw new NotFoundException('Thread not found');
            }

            const user: User = await this.userModel.findOne({ username: username }).session(session);

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
            await thread.save({ session });

            await neo.run(
                `MATCH (u:User { username: $username }), (t:Thread { id: $id }) MERGE (u)-[:UPVOTED]->(t)`,
                { username: username, id: thread._id }
            );

            await neo.commit();
            await session.commitTransaction();

            return thread;
        } catch (error) {
            await neo.rollback();
            await session.abortTransaction();
            throw error;
        } finally {
            session.endSession();
        }
    }

    async downvote(id: string, username: string): Promise<Thread> {
        const neo = this.neo4jService.beginTransaction();
        const session = await this.threadModel.db.startSession();
        session.startTransaction();

        try {
            const thread = await this.threadModel.findOne({ _id: id }).session(session);

            if (!thread) {
                throw new NotFoundException('Thread not found');
            }

            const user: User = await this.userModel.findOne({ username: username }).session(session);

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
            await thread.save({ session });

            await neo.run(
                `MATCH (u:User { username: $username }), (t:Thread { id: $id }) MERGE (u)-[:DOWNVOTED]->(t)`,
                { username: username, id: thread._id }
            );

            await neo.commit();
            await session.commitTransaction();

            return thread;
        } catch (error) {
            await neo.rollback();
            await session.abortTransaction();
            throw error;
        } finally {
            session.endSession();
        }
    }

    async delete(id: string, username: string): Promise<Thread> {
        const neo = this.neo4jService.beginTransaction();
        const session = await this.threadModel.db.startSession();
        session.startTransaction();

        try {
            const thread = await this.threadModel.findOne({ _id: id }).session(session);

            if (!thread) {
                throw new NotFoundException('Thread not found');
            }

            if (thread.username !== username) {
                throw new UnauthorizedException('User is not authorized to delete this thread');
            }

            const deletedThread = await this.threadModel.findOneAndDelete({ _id: id }, { session });

            await Promise.all([
                neo.run(`MATCH (:User)-[r:UPVOTED]->(t:Thread { id: $id }) DELETE r`, { id: thread._id } ),
                neo.run(`MATCH (:User)-[r:DOWNVOTED]->(t:Thread { id: $id }) DELETE r`, { id: thread._id } ),
                neo.run(`MATCH (t:Thread { id: $id }) DETACH DELETE t`, { id: thread._id } )
            ]);

            await neo.commit();
            await session.commitTransaction();

            return deletedThread;
        } catch (error) {
            await neo.rollback();
            await session.abortTransaction();
            throw error;
        } finally {
            session.endSession();
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
