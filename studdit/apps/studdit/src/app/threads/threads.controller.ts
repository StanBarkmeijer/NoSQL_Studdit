import { Body, Controller, HttpException, HttpStatus, NotFoundException, Post, ValidationPipe } from '@nestjs/common';
import { ApiCreatedResponse, ApiNotFoundResponse, ApiTags, ApiUnprocessableEntityResponse } from '@nestjs/swagger';
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
}
