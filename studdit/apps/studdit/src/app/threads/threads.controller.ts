import { BadRequestException, Body, Controller, Delete, Get, HttpException, HttpStatus, NotFoundException, Param, Patch, Post, Put, Query, Req, ValidationPipe } from '@nestjs/common';
import { ApiCreatedResponse, ApiNotFoundResponse, ApiOkResponse, ApiParam, ApiQuery, ApiSecurity, ApiTags, ApiUnprocessableEntityResponse } from '@nestjs/swagger';
import { ThreadsService } from './threads.service';
import { CreateThreadDto } from './dto/create-thread.dto';
import { Thread } from './schemas/threads.schema';

@ApiTags('threads')
@Controller('threads')
export class ThreadsController {
    constructor(private readonly threadsService: ThreadsService) {}

    @Post()
    @ApiCreatedResponse({ description: 'The thread has been successfully created.'})
    @ApiUnprocessableEntityResponse({ description: 'Unable to create thread.'})
    @ApiNotFoundResponse({ description: 'User not found'})
    create(@Body(new ValidationPipe()) createThreadDto: CreateThreadDto): Promise<Thread> {
        return this.threadsService
            .create(createThreadDto)
            .then(thread => thread)
            .catch(error => {
                if (error instanceof NotFoundException) {
                    throw new HttpException('User not found', HttpStatus.NOT_FOUND);
                }

                throw new HttpException('Unable to create thread', HttpStatus.UNPROCESSABLE_ENTITY);
            });
    };

    @Put(':id')
    @ApiParam({ name: 'id', type: String, description: 'The id of the thread to update.' })
    @ApiOkResponse({ description: 'The thread has been successfully updated.'})
    @ApiNotFoundResponse({ description: 'Thread not found'})
    @ApiUnprocessableEntityResponse({ description: 'Unable to update thread'})
    update(@Body(new ValidationPipe()) createThreadDto: CreateThreadDto, @Param('id') id: string): Promise<Thread> {
        return this.threadsService
            .update(id, createThreadDto)
            .then(thread => thread)
            .catch(error => {
                if (error instanceof NotFoundException) {
                    throw new HttpException('Thread not found', HttpStatus.NOT_FOUND);
                }

                throw new HttpException('Unable to update thread', HttpStatus.UNPROCESSABLE_ENTITY);
            });
    };

    @Patch(':id/upvote')
    @ApiParam({ name: 'id', type: String, description: 'The id of the thread to upvote.' })
    @ApiOkResponse({ description: 'The thread has been successfully upvoted.'})
    @ApiNotFoundResponse({ description: 'Thread not found'})
    @ApiNotFoundResponse({ description: 'User not found'})
    @ApiUnprocessableEntityResponse({ description: 'Unable to upvote thread'})
    upvote(@Param('id') id: string, @Body('username') username: string): Promise<Thread> {
        return this.threadsService
            .upvote(id, username)
            .then(thread => thread)
            .catch(error => {
                if (error instanceof NotFoundException) {
                    throw new HttpException('Thread or User not found', HttpStatus.NOT_FOUND);
                }

                if (error instanceof BadRequestException) {
                    throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
                }

                throw new HttpException('Unable to upvote thread', HttpStatus.UNPROCESSABLE_ENTITY);
            });
    };

    @Patch(':id/downvote')
    @ApiParam({ name: 'id', type: String, description: 'The id of the thread to downvote.' })
    @ApiOkResponse({ description: 'The thread has been successfully downvoted.'})
    @ApiNotFoundResponse({ description: 'Thread not found'})
    @ApiNotFoundResponse({ description: 'User not found'})
    @ApiUnprocessableEntityResponse({ description: 'Unable to downvote thread'})
    downvote(@Param('id') id: string, @Body('username') username: string): Promise<Thread> {
        return this.threadsService
            .downvote(id, username)
            .then(thread => thread)
            .catch(error => {
                if (error instanceof NotFoundException) {
                    throw new HttpException('Thread or User not found', HttpStatus.NOT_FOUND);
                }

                if (error instanceof BadRequestException) {
                    throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
                }

                throw new HttpException('Unable to downvote thread', HttpStatus.UNPROCESSABLE_ENTITY);
            });
    };

    @Delete(':id')
    @ApiParam({ name: 'id', type: String, description: 'The id of the thread to delete.' })
    @ApiOkResponse({ description: 'The thread has been successfully deleted.'})
    @ApiNotFoundResponse({ description: 'Thread not found'})
    @ApiUnprocessableEntityResponse({ description: 'Unable to delete thread'})
    delete(@Param('id') id: string, @Req() req: any): Promise<Thread> {
        const username = req.headers['authorization'];
        
        return this.threadsService
            .delete(id, username)
            .then(thread => thread)
            .catch(error => {
                if (error instanceof NotFoundException) {
                    throw new HttpException('Thread not found', HttpStatus.NOT_FOUND);
                }

                throw new HttpException('Unable to delete thread', HttpStatus.UNPROCESSABLE_ENTITY);
            });
    };

    @Get()
    @ApiSecurity('username')
    @ApiQuery({ name: 'sort', type: String, description: 'The sorting method: upvotes, score, comments.', required: false })
    @ApiOkResponse({ description: 'The threads have been successfully retrieved.'})
    findAll(@Query('sort') sort: string): Promise<Thread[]> {
        const sortMethods = {
            upvotes: () => this.threadsService.findAllSortedByUpvotes(),
            score: () => this.threadsService.findAllSortedByScore(),
            comments: () => this.threadsService.findAllSortedByComments(),
            undefined: () => this.threadsService.findAll()
        };

        const sortMethod = sortMethods[sort];

        if (!sortMethod) {
            throw new BadRequestException('Invalid sorting method');
        }

        try {
            return sortMethod();
        } catch (error) {
            throw new HttpException('Unable to retrieve threads', HttpStatus.UNPROCESSABLE_ENTITY);
        }
    }

    @Get(':id')
    @ApiParam({ name: 'id', type: String, description: 'The id of the thread to retrieve.' })
    @ApiOkResponse({ description: 'The thread has been successfully retrieved.'})
    @ApiNotFoundResponse({ description: 'Thread not found'})
    findOne(@Param('id') id: string): Promise<Thread> {
        return this.threadsService
            .findOne(id)
            .then(thread => thread)
            .catch(error => {
                if (error instanceof NotFoundException) {
                    throw new HttpException('Thread not found', HttpStatus.NOT_FOUND);
                }

                throw new HttpException('Unable to retrieve thread', HttpStatus.UNPROCESSABLE_ENTITY);
            });
    }
}
