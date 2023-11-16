import { Body, Controller, Post, HttpException, HttpStatus, Delete, ValidationPipe, NotFoundException } from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse, ApiTags, ApiUnprocessableEntityResponse } from '@nestjs/swagger';

import { FriendsService } from './friends.service';
import { CreateFriendshipDto } from './dto/create-friendship.dto';
import { DeleteFriendshipDto } from './dto/delete-friendship.dto';

@ApiTags('friends')
@Controller('friends')
export class FriendsController {
    constructor(private readonly friendsService: FriendsService) {}

    @Post()
    @ApiCreatedResponse({ description: 'Friendship has been successfully created.'})
    @ApiUnprocessableEntityResponse({ description: 'Unable to create friendship.'})
    create(@Body(new ValidationPipe()) createFriendshipDto: CreateFriendshipDto): Promise<Record<string, any>> {
        return this.friendsService
            .makeFriend(createFriendshipDto.user, createFriendshipDto.friend)
            .then(result => result)
            .catch(error => {
                if (error instanceof NotFoundException) {
                    throw new HttpException(error.message, HttpStatus.NOT_FOUND);
                }

                throw new HttpException('Unable to create friendship', HttpStatus.UNPROCESSABLE_ENTITY);
            });
    };

    @Delete()
    @ApiOkResponse({ description: 'Friendship has been successfully deleted.'})
    @ApiUnprocessableEntityResponse({ description: 'Unable to delete friendship.'})
    remove(@Body(new ValidationPipe()) deleteFriendshipDTO: DeleteFriendshipDto): Promise<Record<string, any>> {
        return this.friendsService
            .removeFriend(deleteFriendshipDTO.user, deleteFriendshipDTO.friend)
            .then(result => result)
            .catch(error => {
                if (error instanceof NotFoundException) {
                    throw new HttpException(error.message, HttpStatus.NOT_FOUND);
                }

                throw new HttpException('Unable to delete friendship', HttpStatus.UNPROCESSABLE_ENTITY);
            });
    };
}
