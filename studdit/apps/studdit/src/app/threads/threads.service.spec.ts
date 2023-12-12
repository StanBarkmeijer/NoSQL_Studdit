import { Test, TestingModule } from '@nestjs/testing';
import { ThreadsService } from './threads.service'; 
import { AppModule } from '../app.module';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../users/schemas/user.schema';
import { Thread, ThreadDocument } from './schemas/threads.schema';

describe('ThreadsService', () => {
  let service: ThreadsService;
  let userModel: Model<UserDocument>;
  let threadModel: Model<ThreadDocument>;
  let user: User;
  let thread: Thread;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule]
    }).compile();

    service = module.get<ThreadsService>(ThreadsService);
    userModel = module.get<Model<UserDocument>>(getModelToken('User'));
    threadModel = module.get<Model<ThreadDocument>>(getModelToken('Thread'));

    await userModel.deleteMany({});

    user = await userModel.create({
      username: 'tester',
      password: 'tester',
      isActive: true
    });

    await threadModel.deleteMany({});

    thread = await threadModel.create({
      username: 'tester',
      title: 'test',
      content: 'test'
    });
  });

  afterAll(async () => {
    await userModel.deleteMany({});
    await threadModel.deleteMany({});
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of threads', async () => {
      const res = await service.findAll();
      expect(res).toBeInstanceOf(Array);
      expect(res.length).toBe(1);
    });
  });

  describe('findOne', () => {
    it('should return a thread', async () => {
      const res = await service.findOne(thread._id + "");
      expect(res).toBeInstanceOf(Object);
      expect(res._id).toEqual(thread._id);
    });
  });

  describe('create', () => {
    it('should return a thread', async () => {
      const res = await service.create({
        username: user.username,
        title: 'test',
        content: 'test'
      });
      expect(res).toBeInstanceOf(Object);
      expect(res._id).toBeDefined();
    });
  });

  describe('update', () => {
    it('should return a thread', async () => {
      const res = await service.update(thread._id + "", {
        username: user.username,
        content: 'test'
      });
      expect(res).toBeInstanceOf(Object);
      expect(res._id).toEqual(thread._id);
    });
  });

  describe('upvote', () => {
    it('should return a thread', async () => {
      const users = await userModel.find({})

      const res = await service.upvote(thread._id + "", users[0].username);
      expect(res).toBeInstanceOf(Object);
      expect(res._id).toEqual(thread._id);
    });
  });

  describe('downvote', () => {
    it('should return a thread', async () => {
      const users = await userModel.find({})

      const res = await service.downvote(thread._id + "", users[0].username);
      expect(res).toBeInstanceOf(Object);
      expect(res._id).toEqual(thread._id);
    });
  });
});
