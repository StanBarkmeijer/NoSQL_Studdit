import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { DeleteUserDto } from './dto/delete-user.dto';
import { Neo4jService } from '../neo4j/neo4j.service';

@Injectable()
export class UsersService {
    constructor(
        @InjectModel(User.name) private userModel: Model<User>,
        private readonly neo4jService: Neo4jService
    ) {}

    private async userExists(username: string) {
        const user = await this.userModel.findOne({ username });
        return !!user;
    }

    async create(createUserDto: CreateUserDto): Promise<{ mongoUser: User, neoUser: any }> {
        const neo = this.neo4jService.beginTransaction();
        
        const session = await this.userModel.db.startSession();
        session.startTransaction();

        try {
            const userExists = await this.userExists(createUserDto.username);

            if (userExists) {
                const user = await this.userModel.findOne({ username: createUserDto.username });
                user.isActive = true;
                await user.save({ session });

                const neoResult = await neo.run(
                    `MATCH (u:User {username: $username}) SET u.isActive = true RETURN u`,
                    { username: createUserDto.username }
                );

                await neo.commit();
                await session.commitTransaction();

                return {
                    mongoUser: user,
                    neoUser: {
                        ...neoResult.records[0].get('u').properties,
                        _id: neoResult.records[0].get('u').identity.low
                    }
                };
            }

            const createdUser = await this.userModel.create([createUserDto], { session });

            const neoResult = await neo.run(
                `CREATE (u:User {username: $username, isActive: $isActive}) RETURN u`,
                { username: createUserDto.username, isActive: true }
            );

            await neo.commit();
            await session.commitTransaction();

            return {
                mongoUser: createdUser[0],
                neoUser: {
                    ...neoResult.records[0].get('u').properties,
                    _id: neoResult.records[0].get('u').identity.low
                }
            }
        } catch (error) {
            await neo.rollback();
            await session.abortTransaction();
            throw error;
        } finally {
            session.endSession();
        }
    }

    async findAll(): Promise<User[]> {
        try {
            return this.userModel.find({ isActive: true });
        } catch (error) {
            throw new NotFoundException('Users not found');
        }
    }

    async findOne(id: string): Promise<User> {
        try {
            const user = await this.userModel.findOne({ _id: id, isActive: true });

            if (!user) {
                throw new NotFoundException('User not found');
            }

            return user;
        } catch (error) {
            throw new NotFoundException('User not found');
        }
    }

    async delete(id: string, deleteUserDTO: DeleteUserDto): Promise<{ mongoUser: User, neoUser: any }> {
        const session = await this.userModel.startSession();
        session.startTransaction();
        const neo = this.neo4jService.beginTransaction();

        try {
            const user = await this.userModel.findOne({ _id: id }).select('+password').session(session);

            if (!user) {
                throw new NotFoundException('User not found');
            }

            if (deleteUserDTO.password !== user.password) {
                throw new UnauthorizedException('Password is incorrect');
            }

            user.isActive = false;

            await user.save({ session });

            const neoResult = await neo.run(
                `MATCH (u:User {username: $username}) SET u.isActive = false`,
                { username: user.username }
            );

            await session.commitTransaction();
            await neo.commit();

            return {
                mongoUser: user,
                neoUser: neoResult
            };
        } catch (error) {
            await session.abortTransaction();
            await neo.rollback();

            throw error;
        } finally {
            session.endSession();
        }
    }

    async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
        const session = await this.userModel.startSession();
        session.startTransaction();

        try {
            const user = await this.userModel.findOne({ _id: id }).select('+password').session(session);
            
            if (!user) {
                throw new NotFoundException('User not found');
            }            

            if (updateUserDto.currentPassword !== user.password) {
                throw new UnauthorizedException('Current password is incorrect');
            }

            user.password = updateUserDto.newPassword;
            await user.save({ session });

            await session.commitTransaction();

            return user;
        } catch (error) {
            await session.abortTransaction();
            throw error;
        } finally {
            session.endSession();
        }
    }
}
