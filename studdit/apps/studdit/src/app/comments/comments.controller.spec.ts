import { Test, TestingModule } from '@nestjs/testing';
import { CommentsController } from './comments.controller';
import { CommentsService } from './comments.service';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Thread } from '../threads/schemas/threads.schema';
import { User } from '../users/schemas/user.schema';
import { Comment } from './schemas/comment.schema';

describe('CommentsController', () => {
  let controller: CommentsController;
  let commentsService: CommentsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CommentsController],
      providers: [
        {
          provide: CommentsService,
          useValue: {
            create: jest.fn(),
            createNestedComment: jest.fn(),
            delete: jest.fn(),
            upvoteComment: jest.fn(),
            downvoteComment: jest.fn(),
            getCommentsByThreadId: jest.fn(),
            getCommentById: jest.fn(),
            getNestedComments: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<CommentsController>(CommentsController);
    commentsService = module.get<CommentsService>(CommentsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
