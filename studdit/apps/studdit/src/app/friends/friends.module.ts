import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { FriendsController } from './friends.controller';
import { FriendsService } from './friends.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from '../users/schemas/user.schema';
import { IsActiveMiddleware } from '../middleware/is-active.middleware';
import { MiddlewareModule } from '../middleware/middleware.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
    MiddlewareModule.forRoot()
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
