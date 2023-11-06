import { Body, Controller, Post, HttpException, HttpStatus, Get, Put } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './schemas/user.schema';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Post()
    async create(@Body() createUserDto: CreateUserDto): Promise<User> {
        return await this.usersService
            .create(createUserDto)
            .then(user => user)
            .catch(error => {
                throw new HttpException('Unable to create user', HttpStatus.INTERNAL_SERVER_ERROR);
            });
    };

    @Get()
    async findAll(): Promise<User[]> {
        return await this.usersService
            .findAll()
            .then(users => users)
            .catch(error => {
                throw new HttpException('Users not found', HttpStatus.NOT_FOUND);
            });
    };

    @Get(':id')
    async findOne(id: string): Promise<User> {
        return await this.usersService
            .findOne(id)
            .then(user => user)
            .catch(error => {
                throw new HttpException('User not found', HttpStatus.NOT_FOUND);
            });
    };

    @Put(':id')
    async update(@Body() updateUserDto: CreateUserDto, id: string): Promise<User> {
        return await this.usersService
            .update(id, updateUserDto)
            .then(user => user)
            .catch(error => {
                throw new HttpException('Unable to update user', HttpStatus.INTERNAL_SERVER_ERROR);
            });
    };
}
