import { Injectable, NestMiddleware } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../users/schemas/user.schema';

@Injectable()
export class IsActiveMiddleware implements NestMiddleware {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>
  ) {}

  async use(req: any, res: any, next: () => void) {
    try {
      const username = req.headers['authorization'];

      if (!username) {
        return res
          .status(401)
          .send({ message: 'No authorization header provided' });
      }

      const user = await this.userModel.findOne({ username: username });

      if (!user) {
        return res
          .status(404)
          .send({ message: 'Authenticated user not found' });
      }

      if (!user.isActive) {
        return res
          .status(401)
          .send({ message: 'Authenticated user is not active' });
      }

      next();
    } catch (error) {
      return res
        .status(500)
        .send({ message: 'Internal server error' });
    }
  }
}
