import type { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../lib/supabaseClient';

function logWithTraceId(traceId: string, message: string, meta?: any) {
  console.log(`[traceId=${traceId}] ${message}`, meta || '');
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const traceId = (req.headers['x-trace-id'] as string) || Math.random().toString(36).slice(2);

  try {
    if (req.method !== 'GET') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      logWithTraceId(traceId, 'Supabase env missing, returning placeholder');
      return res.status(200).json({
        analytics: [
          { label: 'Likes', value: 42 },
          { label: 'Shares', value: 17 },
          { label: 'Comments', value: 9 },
        ],
        aiPrediction: 'Medium engagement expected (placeholder)',
      });
    }

    // Example aggregation from a hypothetical 'engagements' table
    const { data, error } = await supabase
      .from('engagements')
      .select('likes, shares, comments');

    if (error) {
      logWithTraceId(traceId, 'Error fetching engagements', error);
      return res.status(500).json({ error: error.message, traceId });
    }

    const totals = (data || []).reduce(
      (acc: any, row: any) => {
        acc.likes += row.likes || 0;
        acc.shares += row.shares || 0;
        acc.comments += row.comments || 0;
        return acc;
      },
      { likes: 0, shares: 0, comments: 0 }
    );

    const analytics = [
      { label: 'Likes', value: totals.likes },
      { label: 'Shares', value: totals.shares },
      { label: 'Comments', value: totals.comments },
    ];

    return res.status(200).json({ analytics, aiPrediction: 'Prediction pending (placeholder)' });
  } catch (error: any) {
    logWithTraceId(traceId, 'Unhandled analytics error', error);
    return res.status(500).json({ error: error.message, traceId });
  }
}
