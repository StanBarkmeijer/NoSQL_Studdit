import { Test, TestingModule } from '@nestjs/testing';
import { ThreadsController } from './threads.controller';
import { ThreadsService } from './threads.service';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { User } from '../users/schemas/user.schema';
import { Thread } from './schemas/threads.schema';
import { Comment } from '../comments/schemas/comment.schema';

describe('ThreadsController', () => {
  let controller: ThreadsController;
  let threadsService: ThreadsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ThreadsController],
      providers: [
        {
          provide: ThreadsService,
          useValue: {
            create: jest.fn(),
            update: jest.fn(),
            upvote: jest.fn(),
            downvote: jest.fn(),
            delete: jest.fn(),
            findAllSortedByUpvotes: jest.fn(),
            findAllSortedByScore: jest.fn(),
            findAllSortedByComments: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<ThreadsController>(ThreadsController);
    threadsService = module.get<ThreadsService>(ThreadsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
