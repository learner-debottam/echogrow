import { describe, it, expect } from 'vitest';
import request from 'supertest';

const baseUrl = 'http://localhost:3000/api/auth';

describe('Auth API', () => {
  it('should return 400 for missing signup fields', async () => {
    const res = await request(baseUrl + '/signup').post('').send({});
    expect(res.status).toBe(400);
  });

  it('should return 400 for missing login fields', async () => {
    const res = await request(baseUrl + '/login').post('').send({});
    expect(res.status).toBe(400);
  });
});
