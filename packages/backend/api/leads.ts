import type { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';
// import { supabase } from '../lib/supabaseClient';

const schema = z.object({ email: z.string().email(), name: z.string().min(1).optional() });

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
    const parsed = schema.parse(req.body);
    // const { error } = await supabase.from('leads').insert([parsed]);
    // if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json({ received: true });
  } catch (err: any) {
    return res.status(400).json({ error: err.message });
  }
}
