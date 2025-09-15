import { describe, it, expect } from 'vitest';
import handler from '../../packages/backend/api/subscriptions';

describe('Stripe Subscriptions API', () => {
  it('should return 400 if priceId or userId is missing', async () => {
    // Mock req/res
    const req = { method: 'POST', body: {} } as any;
    const res = { status: (code: number) => ({ json: (data: any) => ({ code, data }) }) } as any;
    const result = await handler(req, res);
    expect(result.code).toBe(400);
  });
});
