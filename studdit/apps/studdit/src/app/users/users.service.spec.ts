import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { Model } from 'mongoose';
import { UserDocument } from './schemas/user.schema';
import { AppModule } from '../app.module';
import { getModelToken } from '@nestjs/mongoose';

describe('UsersService', () => {
  let service: UsersService;
  let userModel: Model<UserDocument>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule]
    }).compile();

    service = module.get<UsersService>(UsersService);
    userModel = module.get<Model<UserDocument>>(getModelToken('User'));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
