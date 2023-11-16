import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { FriendsController } from './friends.controller';
import { FriendsService } from './friends.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from '../users/schemas/user.schema';
import { IsActiveMiddleware } from '../middleware/is-active.middleware';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
  ],
  controllers: [FriendsController],
  providers: [FriendsService]
})
export class FriendsModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
      consumer
        .apply(IsActiveMiddleware)
        .forRoutes(FriendsController)
  }
}
