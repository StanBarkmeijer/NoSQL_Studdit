import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { UsersService } from './users.service';
import { User } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { NotFoundException } from '@nestjs/common';

describe('UsersService', () => {
  let usersService: UsersService;
  
  const mockUserModel = {
    create: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    findOneAndDelete: jest.fn(),
    findOneAndUpdate: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getModelToken(User.name),
          useValue: mockUserModel,
        },
      ],
    }).compile();

    usersService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(usersService).toBeDefined();
  });

  describe('create', () => {
    it('should create a user', async () => {
      const createUserDto: CreateUserDto = { username: 'John Doe', password: 'password' };
      const createdUser = { _id: '1', ...createUserDto };
      mockUserModel.create.mockReturnValue(createdUser);

      const result = await usersService.create(createUserDto);

      expect(result).toEqual(createdUser);
    });

    it('should handle errors during user creation', async () => {
      const createUserDto: CreateUserDto = { username: 'John Doe', password: 'password' };
      mockUserModel.create.mockRejectedValue(new Error('Unable to create user'));

      await expect(usersService.create(createUserDto)).rejects.toThrow('Unable to create user');
    });
  });

  describe('findAll', () => {
    it('should find all users', async () => {
      const users = [{ _id: '1', name: 'John Doe', email: 'john@example.com' }];
      mockUserModel.find.mockReturnValue(users);

      const result = await usersService.findAll();

      expect(result).toEqual(users);
    });

    it('should handle errors when finding all users', async () => {
      mockUserModel.find.mockRejectedValue(new Error('Users not found'));

      await expect(usersService.findAll()).rejects.toThrow('Users not found');
    });
  });

  describe('findOne', () => {
    it('should find a user by ID', async () => {
      const userId = '1';
      const user = { _id: userId, name: 'John Doe', email: 'john@example.com' };
      mockUserModel.findOne.mockReturnValue(user);

      const result = await usersService.findOne(userId);

      expect(result).toEqual(user);
    });

    it('should handle errors when finding a user by ID', async () => {
      const userId = '1';
      mockUserModel.findOne.mockRejectedValue(new Error('User not found'));

      await expect(usersService.findOne(userId)).rejects.toThrow('User not found');
    });
  });

  describe('delete', () => {
    it('should delete a user by ID', async () => {
      const userId = '1';
      const deletedUser = { _id: userId, name: 'John Doe', email: 'john@example.com' };
      mockUserModel.findOneAndDelete.mockReturnValue(deletedUser);

      const result = await usersService.delete(userId);

      expect(result).toEqual(deletedUser);
    });

    it('should handle errors when deleting a user by ID', async () => {
      const userId = '1';
      mockUserModel.findOneAndDelete.mockResolvedValue(null);

      await expect(usersService.delete(userId)).rejects.toThrow('Unable to delete user');
    });
  });

  describe('update', () => {
    it('should update a user by ID', async () => {
      const userId = '1';
      const updateUserDto: UpdateUserDto = { username: 'Updated John Doe', password: 'password' };
      const updatedUser = { _id: userId, name: 'Updated John Doe', email: 'john@example.com' };
      mockUserModel.findOneAndUpdate.mockReturnValue(updatedUser);

      const result = await usersService.update(userId, updateUserDto);

      expect(result).toEqual(updatedUser);
    });

    it('should handle errors when updating a user by ID', async () => {
      const userId = '-1';
      const updateUserDto: UpdateUserDto = { username: 'Updated John Doe', password: 'password' };
      mockUserModel.findOneAndUpdate.mockResolvedValue(null);

      await expect(usersService.update(userId, updateUserDto)).rejects.toThrow('Unable to update user');
    });
  });
});
