import type { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';
import { predictViralPotential } from '../../packages/ai-flows/viralPredictor';

const schema = z.object({
  content: z.string().min(1),
  history: z.array(z.object({ likes: z.number().min(0), shares: z.number().min(0), comments: z.number().min(0) })),
});

async function authenticate(req: NextApiRequest) {
  // TODO: Implement JWT auth
  const auth = req.headers.authorization;
  if (!auth) return false;
  return true;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const traceId = (req.headers['x-trace-id'] as string) || Math.random().toString(36).slice(2);
  try {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
    const ok = await authenticate(req);
    if (!ok) return res.status(401).json({ error: 'Unauthorized' });
    const parsed = schema.parse(req.body);
    const result = await predictViralPotential({ ...parsed, traceId });
    return res.status(200).json(result);
  } catch (err: any) {
    return res.status(400).json({ error: err.message, traceId });
  }
}
