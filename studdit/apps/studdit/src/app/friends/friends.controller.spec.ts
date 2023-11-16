import { Test, TestingModule } from '@nestjs/testing';
import { FriendsController } from './friends.controller';
import { FriendsService } from './friends.service';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { User } from '../users/schemas/user.schema';

describe('FriendsController', () => {
  let controller: FriendsController;
  let friendsService: FriendsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FriendsController],
      providers: [
        {
          provide: FriendsService,
          useValue: {
            makeFriend: jest.fn(),
            removeFriend: jest.fn()
          }
        }
      ]
    }).compile();

    controller = module.get<FriendsController>(FriendsController);
    friendsService = module.get<FriendsService>(FriendsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
