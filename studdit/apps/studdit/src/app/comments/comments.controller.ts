import { BadRequestException, Body, Controller, Delete, Get, HttpException, HttpStatus, NotFoundException, Param, Patch, Post, ValidationPipe } from '@nestjs/common';
import { ApiCreatedResponse, ApiNotFoundResponse, ApiOkResponse, ApiParam, ApiTags, ApiUnprocessableEntityResponse } from '@nestjs/swagger';
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
    create(@Body(new ValidationPipe()) createCommentDto: CreateCommentDto): Promise<Comment> {
        return this.commentsService
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
    @ApiParam({ name: 'id', type: String, description: 'The id of the parent comment.' })
    @ApiCreatedResponse({ description: 'The nested comment has been successfully created.'})
    @ApiUnprocessableEntityResponse({ description: 'Unable to create nested comment.'})
    @ApiNotFoundResponse({ description: 'User or Parent comment not found'})
    createNestedComment(@Body(new ValidationPipe()) createNestedCommentDto: CreateNestedCommentDto, @Param('id') id: string): Promise<Comment> {
        return this.commentsService
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
    @ApiParam({ name: 'id', type: String, description: 'The id of the comment to delete.' })
    @ApiOkResponse({ description: 'The comment has been successfully deleted.'})
    @ApiNotFoundResponse({ description: 'Comment not found'})
    @ApiUnprocessableEntityResponse({ description: 'Unable to delete comment'})
    delete(@Param('id') id: string): Promise<Comment> {
        return this.commentsService
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
    @ApiParam({ name: 'id', type: String, description: 'The id of the comment to upvote.' })
    @ApiOkResponse({ description: 'The comment has been successfully upvoted.'})
    @ApiNotFoundResponse({ description: 'Comment or User not found'})
    @ApiUnprocessableEntityResponse({ description: 'Unable to upvote comment'})
    upvote(@Param('id') id: string, @Body('username') username: string): Promise<Comment> {
        return this.commentsService
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
    @ApiParam({ name: 'id', type: String, description: 'The id of the comment to downvote.' })
    @ApiOkResponse({ description: 'The comment has been successfully downvoted.'})
    @ApiNotFoundResponse({ description: 'Comment or User not found'})
    @ApiUnprocessableEntityResponse({ description: 'Unable to downvote comment'})
    downvote(@Param('id') id: string, @Body('username') username: string): Promise<Comment> {
        return this.commentsService
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

    @Get(':id/thread')
    @ApiParam({ name: 'id', type: String, description: 'The id of the comment to get the thread from.' })
    @ApiOkResponse({ description: 'The thread has been successfully retrieved.'})
    @ApiNotFoundResponse({ description: 'Thread not found'})
    @ApiUnprocessableEntityResponse({ description: 'Unable to get comments'})
    getCommentsByThreadId(@Param('id') id: string): Promise<Comment[]> {
        return this.commentsService
            .getCommentsByThreadId(id)
            .then(comments => comments)
            .catch(error => {
                if (error instanceof NotFoundException) {
                    throw new HttpException('Thread not found', HttpStatus.NOT_FOUND);
                }

                throw new HttpException('Unable to get comments', HttpStatus.UNPROCESSABLE_ENTITY);
            });
    }

    @Get(':id')
    @ApiParam({ name: 'id', type: String, description: 'The id of the comment to get.' })
    @ApiOkResponse({ description: 'The comment has been successfully retrieved.'})
    @ApiNotFoundResponse({ description: 'Comment not found'})
    @ApiUnprocessableEntityResponse({ description: 'Unable to get comment'})
    getCommentById(@Param('id') id: string): Promise<Comment> {
        return this.commentsService
            .getCommentById(id)
            .then(comment => comment)
            .catch(error => {
                if (error instanceof NotFoundException) {
                    throw new HttpException('Comment not found', HttpStatus.NOT_FOUND);
                }

                throw new HttpException('Unable to get comment', HttpStatus.UNPROCESSABLE_ENTITY);
            });
    }

    @Get(':id/nested')
    @ApiParam({ name: 'id', type: String, description: 'The id of the comment to get nested comments from.' })
    @ApiOkResponse({ description: 'The nested comments have been successfully retrieved.'})
    @ApiNotFoundResponse({ description: 'Comment not found'})
    @ApiUnprocessableEntityResponse({ description: 'Unable to get nested comments'})
    getNestedComments(@Param('id') id: string): Promise<Comment[]> {
        return this.commentsService
            .getNestedComments(id)
            .then(comments => comments)
            .catch(error => {
                if (error instanceof NotFoundException) {
                    throw new HttpException('Comment not found', HttpStatus.NOT_FOUND);
                }

                throw new HttpException('Unable to get nested comments', HttpStatus.UNPROCESSABLE_ENTITY);
            });
    }
}
