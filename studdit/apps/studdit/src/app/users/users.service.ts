import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { DeleteUserDto } from './dto/delete-user.dto';

@Injectable()
export class UsersService {
    constructor(@InjectModel(User.name) private userModel: Model<User>) {}

    async create(createUserDto: CreateUserDto): Promise<User> {
        try {
            const createdUser = await this.userModel.create(createUserDto);
            
            return createdUser;
        } catch (error) {
            throw new Error('Unable to create user');
        }
    }

    async findAll(): Promise<User[]> {
        try {
            return this.userModel.find();
        } catch (error) {
            throw new NotFoundException('Users not found');
        }
    }

    async findOne(id: string): Promise<User> {
        try {
            return this.userModel.findOne({ _id: id });
        } catch (error) {
            throw new NotFoundException('User not found');
        }
    }

    async delete(id: string, deleteUserDTO: DeleteUserDto): Promise<User> {
        try {
            const user = await this.userModel.findOne({ _id: id });

            if (!user) {
                throw new NotFoundException('User not found');
            }

            if (deleteUserDTO.password !== user.password) {
                throw new UnauthorizedException('Password is incorrect');
            }

            const deletedUser = await this.userModel.findOneAndDelete({ _id: id });
            return deletedUser;
        } catch (error) {
            throw new Error('Unable to delete user');
        }
    }

    async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
        try {
            const user = await this.userModel.findOne({ _id: id });
            
            if (!user) {
                throw new NotFoundException('User not found');
            }

            if (updateUserDto.currentPassword !== user.password) {
                throw new UnauthorizedException('Current password is incorrect');
            }

            user.password = updateUserDto.newPassword;
            await user.save();

            return user;
        } catch (error) {
            throw new Error('Unable to update user');
        }
    }
}
