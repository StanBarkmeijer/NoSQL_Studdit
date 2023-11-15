import { Module } from '@nestjs/common';
import { ThreadsService } from './threads.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ThreadSchema } from './schemas/threads.schema';
import { ThreadsController } from './threads.controller';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Thread', schema: ThreadSchema }])],
  controllers: [ThreadsController],
  providers: [ThreadsService]
})
export class ThreadsModule {}
