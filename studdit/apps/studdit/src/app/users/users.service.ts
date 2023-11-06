import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
    constructor(@InjectModel(User.name) private userModel: Model<User>) {}

    async create(createUserDto: CreateUserDto): Promise<User> {
        try {
            const createdUser = new this.userModel(createUserDto);
            return createdUser.save();
        } catch (error) {
            throw new Error('Unable to create user');
        }
    }

    async findAll(): Promise<User[]> {
        try {
            return this.userModel.find().exec();
        } catch (error) {
            throw new NotFoundException('Users not found');
        }
    }

    async findOne(id: string): Promise<User> {
        try {
            return this.userModel.findOne({ _id: id }).exec();
        } catch (error) {
            throw new NotFoundException('User not found');
        }
    }

    async delete(id: string): Promise<User> {
        try {
            const deletedUser = await this.userModel.findOneAndDelete({ _id: id }).exec();
            if (!deletedUser) {
                throw new NotFoundException('User not found');
            }
            return deletedUser;
        } catch (error) {
            throw new Error('Unable to delete user');
        }
    }

    async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
        try {
            const user = await this.userModel.findOneAndUpdate({ _id: id }, updateUserDto, { new: true }).exec();
            if (!user) {
                throw new NotFoundException('User not found');
            }
            return user;
        } catch (error) {
            throw new Error('Unable to update user');
        }
    }
}
