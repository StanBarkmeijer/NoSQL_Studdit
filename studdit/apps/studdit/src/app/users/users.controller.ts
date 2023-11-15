import { Body, Controller, Post, HttpException, HttpStatus, Get, Put, NotFoundException, Delete, ValidationPipe, UnauthorizedException, Param } from '@nestjs/common';
import { UsersService } from './users.service';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { DeleteUserDto } from './dto/delete-user.dto';

import { User } from './schemas/user.schema';
import { ApiCreatedResponse, ApiNotFoundResponse, ApiOkResponse, ApiParam, ApiTags, ApiUnauthorizedResponse, ApiUnprocessableEntityResponse } from '@nestjs/swagger';

@ApiTags('users')
@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Post()
    @ApiCreatedResponse({ description: 'The user has been successfully created.'})
    @ApiUnprocessableEntityResponse({ description: 'Unable to create user.'})
    async create(@Body(new ValidationPipe()) createUserDto: CreateUserDto): Promise<User> {
        return await this.usersService
            .create(createUserDto)
            .then(user => user)
            .catch(error => {
                throw new HttpException('Unable to create user', HttpStatus.UNPROCESSABLE_ENTITY);
            });
    };

    @Get()
    @ApiOkResponse({ description: 'The users have been successfully retrieved.'})
    @ApiNotFoundResponse({ description: 'Users not found.'})
    async findAll(): Promise<User[]> {
        return await this.usersService
            .findAll()
            .then(users => users)
            .catch(error => {
                throw new HttpException('Users not found', HttpStatus.NOT_FOUND);
            });
    };

    @Get(':id')
    @ApiParam({ name: 'id', type: String, description: 'The id of the user to retrieve.' })
    @ApiOkResponse({ description: 'The user has been successfully retrieved.'})
    @ApiNotFoundResponse({ description: 'User not found'})
    async findOne(@Param('id') id: string): Promise<User> {
        return await this.usersService
            .findOne(id)
            .then(user => user)
            .catch(error => {
                throw new HttpException('User not found', HttpStatus.NOT_FOUND);
            });
    };

    @Put(':id')
    @ApiParam({ name: 'id', type: String, description: 'The id of the user to update.' })
    @ApiOkResponse({ description: 'The user has been successfully updated.'})
    @ApiNotFoundResponse({ description: 'User not found'})
    @ApiUnauthorizedResponse({ description: 'Current password is incorrect'})
    @ApiUnprocessableEntityResponse({ description: 'Unable to update user'})
    async update(@Body(new ValidationPipe()) updateUserDto: UpdateUserDto, @Param('id') id: string): Promise<User> {
        return await this.usersService
            .update(id, updateUserDto)
            .then(user => user)
            .catch(error => {
                if (error instanceof NotFoundException) {
                    throw new HttpException('User not found', HttpStatus.NOT_FOUND);
                }

                if (error instanceof UnauthorizedException) {
                    throw new HttpException('Current password is incorrect', HttpStatus.UNAUTHORIZED);
                }

                throw new HttpException('Unable to update user', HttpStatus.UNPROCESSABLE_ENTITY);
            });
    };

    @Delete(':id')
    @ApiParam({ name: 'id', type: String, description: 'The id of the user to delete.' })
    @ApiOkResponse({ description: 'The user has been successfully deleted.'})
    @ApiNotFoundResponse({ description: 'User not found'})
    @ApiUnprocessableEntityResponse({ description: 'Unable to delete user'})
    async remove(@Body(new ValidationPipe()) deleteUserDTO: DeleteUserDto, @Param('id') id: string): Promise<User> {
        return await this.usersService
            .delete(id, deleteUserDTO)
            .then(user => user)
            .catch(error => {
                if (error instanceof NotFoundException) {
                    throw new HttpException('User not found', HttpStatus.NOT_FOUND);
                }

                if (error instanceof UnauthorizedException) {
                    throw new HttpException('Password is incorrect', HttpStatus.UNAUTHORIZED);
                }

                throw new HttpException('Unable to delete user', HttpStatus.UNPROCESSABLE_ENTITY);
            });
    };
}
