import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './schemas/user.schema';
import { NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';

describe('UsersController', () => {
  let controller: UsersController;
  let userService: UsersService;
  
  const mockUserModel = {
    create: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    findOneAndDelete: jest.fn(),
    findOneAndUpdate: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        UsersService,
        {
          provide: getModelToken(User.name),
          useValue: mockUserModel,
        }
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    userService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a user', async () => {
      const createUserDto: CreateUserDto = { username: 'john_doe', password: 'password123' };
      const createdUser: User = { _id: '1', ...createUserDto };

      jest.spyOn(userService, 'create').mockResolvedValue(createdUser);

      const result = await controller.create(createUserDto);

      expect(result).toEqual(createdUser);
    });

    it('should handle errors during user creation', async () => {
      const createUserDto: CreateUserDto = { username: 'john_doe', password: 'password123' };
      jest.spyOn(userService, 'create').mockRejectedValue(new InternalServerErrorException('Unable to create user'));

      await expect(controller.create(createUserDto)).rejects.toThrow('Unable to create user');
    });
  });

  describe('findAll', () => {
    it('should find all users', async () => {
      const users: User[] = [{ _id: '1', username: 'john_doe', password: 'password123' }];
      jest.spyOn(userService, 'findAll').mockResolvedValue(users);

      const result = await controller.findAll();

      expect(result).toEqual(users);
    });

    it('should handle errors when finding all users', async () => {
      jest.spyOn(userService, 'findAll').mockRejectedValue(new NotFoundException('Users not found'));

      await expect(controller.findAll()).rejects.toThrow('Users not found');
    });
  });

  describe('findOne', () => {
    it('should find a user by ID', async () => {
      const userId = '1';
      const user: User = { _id: userId, username: 'john_doe', password: 'password123' };
      jest.spyOn(userService, 'findOne').mockResolvedValue(user);

      const result = await controller.findOne(userId);

      expect(result).toEqual(user);
    });

    it('should handle errors when finding a user by ID', async () => {
      const userId = '1';
      jest.spyOn(userService, 'findOne').mockRejectedValue(new NotFoundException('User not found'));

      await expect(controller.findOne(userId)).rejects.toThrow('User not found');
    });
  });

  describe('update', () => {
    it('should update a user by ID', async () => {
      const userId = '1';
      const updateUserDto: UpdateUserDto = { username: 'updated_user', password: 'updated_password' };
      const updatedUser: User = { _id: userId, ...updateUserDto };
      jest.spyOn(userService, 'update').mockResolvedValue(updatedUser);

      const result = await controller.update(updateUserDto, userId);

      expect(result).toEqual(updatedUser);
    });

    it('should handle errors when updating a user by ID', async () => {
      const userId = '1';
      const updateUserDto: UpdateUserDto = { username: 'updated_user', password: 'updated_password' };
      jest.spyOn(userService, 'update').mockRejectedValue(new InternalServerErrorException('Unable to update user'));

      await expect(controller.update(updateUserDto, userId)).rejects.toThrow('Unable to update user');
    });
  });
});
