import { Module, RequestMethod } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './schemas/user.schema';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { MiddlewareModule } from '../middleware/middleware.module';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
        MiddlewareModule.forRoot({
            exclude: [{
                path: 'users/:id',
                method: RequestMethod.PUT
            }]
        })
    ],
    controllers: [UsersController],
    providers: [UsersService],
})
export class UsersModule {}
