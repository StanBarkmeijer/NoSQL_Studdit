import { IsActiveMiddleware } from './is-active.middleware';

describe('IsActiveMiddleware', () => {
  it('should be defined', () => {
    expect(new IsActiveMiddleware()).toBeDefined();
  });
});
