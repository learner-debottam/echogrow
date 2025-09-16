import { describe, it, expect } from 'vitest';
import type { NextApiRequest, NextApiResponse } from 'next';
import { describe, it, expect } from 'vitest';
import signupHandler from '../../packages/backend/api/auth/signup';
import loginHandler from '../../packages/backend/api/auth/login';

function createMockRes() {
  const res: Partial<NextApiResponse> & { statusCode?: number; body?: any } = {};
  res.status = ((code: number) => {
    res.statusCode = code;
    return res as NextApiResponse;
  }) as NextApiResponse['status'];
  res.json = ((data: any) => {
    res.body = data;
    return res as NextApiResponse;
  }) as NextApiResponse['json'];
  return res as NextApiResponse & { statusCode?: number; body?: any };
}

describe('Auth API', () => {
  it('should return 400 for missing signup fields', async () => {
    const req = { method: 'POST', body: {} } as unknown as NextApiRequest;
    const res = createMockRes();
    await signupHandler(req, res);
    expect(res.statusCode).toBe(400);
  });

  it('should return 400 for missing login fields', async () => {
    const req = { method: 'POST', body: {} } as unknown as NextApiRequest;
    const res = createMockRes();
    await loginHandler(req, res);
    expect(res.statusCode).toBe(400);
  });
});
