import { Injectable, NestMiddleware } from '@nestjs/common';
import { UsersService } from '../users/users.service';

@Injectable()
export class IsActiveMiddleware implements NestMiddleware {
  constructor(private readonly userService: UsersService) {}

  async use(req: any, res: any, next: () => void) {
    try {
      const username = req.headers['authorization'];

      if (!username) {
        return res
          .status(401)
          .send({ message: 'No authorization header provided' });
      }

      const user = await this.userService.findOne(username);

      if (!user) {
        return res
          .status(404)
          .send({ message: 'User not found' });
      }

      if (!user.isActive) {
        return res
          .status(401)
          .send({ message: 'User is not active' });
      }

      next();
    } catch (error) {
      return res
        .status(500)
        .send({ message: 'Internal server error' });
    }
  }
}
