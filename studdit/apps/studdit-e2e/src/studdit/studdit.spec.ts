import axios from 'axios';

// describe('GET /api', () => {
//   it('should return a message', async () => {
//     const res = await axios.get(`/api`);

//     expect(res.status).toBe(200);;
//     expect(res.data).toEqual({ message: 'Hello API' });
//   });
// })

describe('UsersController (e2e)', () => {
  describe('/api/users (GET)', () => {
    it('should return an array of users', async () => {
      const res = await axios.get(`/api/users`);

      expect(res.status).toBe(200);
      expect(res.data).toEqual([]);
    });
  });

  describe('/api/users/:id (GET)', () => {
    it('should return a user', async () => {
      const res = await axios.get(`/api/users/1`);

      expect(res.status).toBe(404);
    });
  });
});