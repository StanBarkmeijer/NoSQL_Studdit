import { Model } from 'mongoose';
import { User } from '../users/schemas/user.schema';
import { IsActiveMiddleware } from './is-active.middleware';

describe('IsActiveMiddleware', () => {
  let middleware: IsActiveMiddleware;
  let userModel: Model<User>;

  beforeEach(() => {
    userModel = {} as Model<User>;
    middleware = new IsActiveMiddleware(userModel);
  });

  it('should be defined', () => {
    expect(middleware).toBeDefined();
  });

  describe('Happy Flow', () => {
    it('should call next when user is active', async () => {
      const req = { headers: { authorization: 'testUser' } };
      const res = { status: jest.fn().mockReturnThis(), send: jest.fn() };
      const next = jest.fn();

      userModel.findOne = jest.fn().mockResolvedValue({ isActive: true });

      await middleware.use(req, res, next);

      expect(next).toHaveBeenCalled();
    });
  });

  describe('Bad Flow', () => {
    it('should return 401 when no authorization header is provided', async () => {
      const req = { headers: {} };
      const res = { status: jest.fn().mockReturnThis(), send: jest.fn() };
      const next = jest.fn();

      await middleware.use(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.send).toHaveBeenCalledWith({ message: 'No authorization header provided' });
    });

    it('should return 404 when user is not found', async () => {
      const req = { headers: { authorization: 'testUser' } };
      const res = { status: jest.fn().mockReturnThis(), send: jest.fn() };
      const next = jest.fn();

      userModel.findOne = jest.fn().mockResolvedValue(null);

      await middleware.use(req, res, next);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.send).toHaveBeenCalledWith({ message: 'Authenticated user not found' });
    });

    it('should return 401 when user is not active', async () => {
      const req = { headers: { authorization: 'testUser' } };
      const res = { status: jest.fn().mockReturnThis(), send: jest.fn() };
      const next = jest.fn();

      userModel.findOne = jest.fn().mockResolvedValue({ isActive: false });

      await middleware.use(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.send).toHaveBeenCalledWith({ message: 'Authenticated user is not active' });
    });

    it('should return 500 when an error occurs', async () => {
      const req = { headers: { authorization: 'testUser' } };
      const res = { status: jest.fn().mockReturnThis(), send: jest.fn() };
      const next = jest.fn();

      userModel.findOne = jest.fn().mockRejectedValue(new Error('Test error'));

      await middleware.use(req, res, next);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith({ message: 'Internal server error' });
    });
  });
});