import type { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';
import { generateCaption } from '../../packages/ai-flows/captionGeneration';

const schema = z.object({
  content: z.string().min(1),
  language: z.string().min(2).max(5),
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const traceId = (req.headers['x-trace-id'] as string) || Math.random().toString(36).slice(2);
  try {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
    const parsed = schema.parse(req.body);
    const result = await generateCaption({ ...parsed, traceId });
    return res.status(200).json(result);
  } catch (err: any) {
    return res.status(400).json({ error: err.message, traceId });
  }
}
