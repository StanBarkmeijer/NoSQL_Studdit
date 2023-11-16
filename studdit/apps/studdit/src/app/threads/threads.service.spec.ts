import { Test, TestingModule } from '@nestjs/testing';
import { ThreadsService } from './threads.service'; 
import { AppModule } from '../app.module';

describe('ThreadsService', () => {
  let service: ThreadsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule]
    }).compile();

    service = module.get<ThreadsService>(ThreadsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
