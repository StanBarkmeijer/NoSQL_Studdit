import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { Model } from 'mongoose';
import { UserDocument } from './schemas/user.schema';
import { AppModule } from '../app.module';
import { getModelToken } from '@nestjs/mongoose';

describe('UsersService', () => {
  let service: UsersService;
  let userModel: Model<UserDocument>;
  let userID: any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule]
    }).compile();

    service = module.get<UsersService>(UsersService);
    userModel = module.get<Model<UserDocument>>(getModelToken('User'));

    await userModel.deleteMany({});

    let u = await userModel.create({
      username: 'test',
      password: 'test',
      isActive: true
    });

    userID = u._id;

    await userModel.create({
      username: 'test2',
      password: 'test2',
      isActive: true
    });

    await userModel.create({
      username: 'test3',
      password: 'test3',
      isActive: true
    });

    await userModel.create({
      username: 'test4',
      password: 'test4',
      isActive: true
    });
  });

  afterAll(async () => {
    await userModel.deleteMany({});
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const res = await service.findAll();
      expect(res).toBeInstanceOf(Array);
      expect(res.length).toEqual(4);
    });
  });

  describe('findOne', () => {
    it('should return a user', async () => {
      const res = await service.findOne(userID);
      expect(res).toBeInstanceOf(Object);
      expect(res.username).toEqual('test');
    });

    it('should throw an error when user is not found', async () => {
      await expect(service.findOne('123')).rejects.toThrow();
    });

    it('should throw an error when user is not active', async () => {
      await userModel.updateOne({ _id: userID }, { isActive: false });
      await expect(service.findOne(userID)).rejects.toThrow();
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      const res = await service.update(userID, { currentPassword: 'test', newPassword: 'test2' });
      expect(res).toBeInstanceOf(Object);
      expect(res.username).toEqual('test');
      expect(res.password).toEqual('test2');
    });

    it('should throw an error when user is not found', async () => {
      await expect(service.update('123', { currentPassword: 'test', newPassword: 'test2' })).rejects.toThrow();
    });
  });

  describe('delete', () => {
    it('should delete a user', async () => {
      const res = await service.delete(userID, { password: 'test' });
      expect(res).toBeInstanceOf(Object);
      expect(res.mongoUser).toBeInstanceOf(Object);
      expect(res.neoUser).toBeInstanceOf(Object);
    });

    it('should throw an error when user is not found', async () => {
      await expect(service.delete('123', { password: 'test' })).rejects.toThrow();
    });

    it('should throw an error when password is incorrect', async () => {
      await expect(service.delete(userID, { password: 'test2' })).rejects.toThrow();
    });
  });
});
