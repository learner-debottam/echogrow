import { describe, it, expect } from 'vitest';
import handler from '../../packages/backend/api/analytics';

describe('Analytics API', () => {
  it('returns placeholder when Supabase env missing (placeholder)', async () => {
    const req = { method: 'GET', headers: {} } as any;
    let statusCode = 0; let body: any = null;
    const res = { status: (c: number) => ({ json: (b: any) => { statusCode = c; body = b; } }) } as any;
    await handler(req, res);
    expect(statusCode).toBe(200);
  });
});
