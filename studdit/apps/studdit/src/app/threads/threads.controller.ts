import { Body, Controller, HttpException, HttpStatus, NotFoundException, Param, Post, Put, ValidationPipe } from '@nestjs/common';
import { ApiCreatedResponse, ApiNotFoundResponse, ApiOkResponse, ApiParam, ApiTags, ApiUnprocessableEntityResponse } from '@nestjs/swagger';
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
    async create(@Body(new ValidationPipe()) createThreadDto: CreateThreadDto): Promise<Thread> {
        return await this.threadsService
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
    async update(@Body(new ValidationPipe()) createThreadDto: CreateThreadDto, @Param('id') id: string): Promise<Thread> {
        return await this.threadsService
            .update(id, createThreadDto)
            .then(thread => thread)
            .catch(error => {
                if (error instanceof NotFoundException) {
                    throw new HttpException('Thread not found', HttpStatus.NOT_FOUND);
                }

                throw new HttpException('Unable to update thread', HttpStatus.UNPROCESSABLE_ENTITY);
            });
    };
}
