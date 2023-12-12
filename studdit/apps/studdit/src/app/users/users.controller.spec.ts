import { TestingModule, Test } from "@nestjs/testing";
import { UsersController } from './users.controller';
import { UsersService } from "./users.service";

describe('UsersController', () => {
    let controller: UsersController;
    let usersService: UsersService;
    const users = [];

    beforeEach(async () => {
      const module: TestingModule = await Test.createTestingModule({
        controllers: [UsersController],
        providers: [
          {
            provide: UsersService,
            useValue: {
              create: jest.fn(),
              findAll: jest.fn(),
              findOne: jest.fn(),
              update: jest.fn(),
              remove: jest.fn()
            }
          }
        ]
      }).compile();
  
      controller = module.get<UsersController>(UsersController);
      usersService = module.get<UsersService>(UsersService);
    });
  
    it('should be defined', () => {
      expect(controller).toBeDefined();
    });
});
