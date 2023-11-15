import { BadRequestException, Body, Controller, Delete, HttpException, HttpStatus, NotFoundException, Param, Patch, Post, ValidationPipe } from '@nestjs/common';
import { ApiCreatedResponse, ApiNotFoundResponse, ApiOkResponse, ApiTags, ApiUnprocessableEntityResponse } from '@nestjs/swagger';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { Comment } from './schemas/comment.schema';
import { CreateNestedCommentDto } from './dto/create-nested-comment.dto';

@ApiTags('comments')
@Controller('comments')
export class CommentsController {
    constructor(private readonly commentsService: CommentsService) {}

    @Post()
    @ApiCreatedResponse({ description: 'The comment has been successfully created.'})
    @ApiUnprocessableEntityResponse({ description: 'Unable to create comment.'})
    @ApiNotFoundResponse({ description: 'User or Thread not found'})
    async create(@Body(new ValidationPipe()) createCommentDto: CreateCommentDto): Promise<Comment> {
        return await this.commentsService
            .create(createCommentDto)
            .then(comment => comment)
            .catch(error => {
                if (error instanceof NotFoundException) {
                    throw new HttpException('User or Thread not found', HttpStatus.NOT_FOUND);
                }

                throw new HttpException('Unable to create comment', HttpStatus.UNPROCESSABLE_ENTITY);
            });
    }

    @Post(':id')
    @ApiCreatedResponse({ description: 'The nested comment has been successfully created.'})
    @ApiUnprocessableEntityResponse({ description: 'Unable to create nested comment.'})
    @ApiNotFoundResponse({ description: 'User or Parent comment not found'})
    async createNestedComment(@Body(new ValidationPipe()) createNestedCommentDto: CreateNestedCommentDto, @Param('id') id: string): Promise<Comment> {
        return await this.commentsService
            .createNestedComment(id, createNestedCommentDto)
            .then(comment => comment)
            .catch(error => {
                if (error instanceof NotFoundException) {
                    throw new HttpException('User or Parent comment not found', HttpStatus.NOT_FOUND);
                }

                throw new HttpException('Unable to create nested comment', HttpStatus.UNPROCESSABLE_ENTITY);
            });
    }

    @Delete(':id')
    @ApiOkResponse({ description: 'The comment has been successfully deleted.'})
    @ApiNotFoundResponse({ description: 'Comment not found'})
    @ApiUnprocessableEntityResponse({ description: 'Unable to delete comment'})
    async delete(@Param('id') id: string): Promise<Comment> {
        return await this.commentsService
            .delete(id)
            .then(comment => comment)
            .catch(error => {
                if (error instanceof NotFoundException) {
                    throw new HttpException('Comment not found', HttpStatus.NOT_FOUND);
                }

                throw new HttpException('Unable to delete comment', HttpStatus.UNPROCESSABLE_ENTITY);
            });
    }

    @Patch(':id/upvote')
    @ApiOkResponse({ description: 'The comment has been successfully upvoted.'})
    @ApiNotFoundResponse({ description: 'Comment or User not found'})
    @ApiUnprocessableEntityResponse({ description: 'Unable to upvote comment'})
    async upvote(@Param('id') id: string, @Body('username') username: string): Promise<Comment> {
        return await this.commentsService
            .upvoteComment(id, username)
            .then(comment => comment)
            .catch(error => {
                if (error instanceof NotFoundException) {
                    throw new HttpException('Comment or User not found', HttpStatus.NOT_FOUND);
                }

                if (error instanceof BadRequestException) {
                    throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
                }

                throw new HttpException('Unable to upvote comment', HttpStatus.UNPROCESSABLE_ENTITY);
            });
    }

    @Patch(':id/downvote')
    @ApiOkResponse({ description: 'The comment has been successfully downvoted.'})
    @ApiNotFoundResponse({ description: 'Comment or User not found'})
    @ApiUnprocessableEntityResponse({ description: 'Unable to downvote comment'})
    async downvote(@Param('id') id: string, @Body('username') username: string): Promise<Comment> {
        return await this.commentsService
            .downvoteComment(id, username)
            .then(comment => comment)
            .catch(error => {
                if (error instanceof NotFoundException) {
                    throw new HttpException('Comment or User not found', HttpStatus.NOT_FOUND);
                }

                if (error instanceof BadRequestException) {
                    throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
                }

                throw new HttpException('Unable to downvote comment', HttpStatus.UNPROCESSABLE_ENTITY);
            });
    }
}
