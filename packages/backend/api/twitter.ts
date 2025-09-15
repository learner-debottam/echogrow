import type { NextApiRequest, NextApiResponse } from 'next';
import fetch, { RequestInit } from 'node-fetch';

const TWITTER_BEARER_TOKEN = process.env.TWITTER_BEARER_TOKEN;
const TWITTER_API_URL = 'https://api.twitter.com/2';

function logWithTraceId(traceId: string, message: string, meta?: any) {
  // Replace with real logger if needed
  console.log(`[traceId=${traceId}] ${message}`, meta || '');
}

async function fetchWithRetry(url: string, options: RequestInit, traceId: string, retries = 3, backoff = 500): Promise<any> {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const res = await fetch(url, options);
      if (!res.ok) {
        const error = await res.text();
        throw new Error(`HTTP ${res.status}: ${error}`);
      }
      return await res.json();
    } catch (err) {
      logWithTraceId(traceId, `Attempt ${attempt} failed: ${err}`);
      if (attempt === retries) throw err;
      await new Promise(r => setTimeout(r, backoff * attempt));
    }
  }
}

export async function postTweet(traceId: string, text: string): Promise<any> {
  if (!TWITTER_BEARER_TOKEN) throw new Error('Missing Twitter API token');
  const url = `${TWITTER_API_URL}/tweets`;
  const options: RequestInit = {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${TWITTER_BEARER_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ text }),
  };
  return fetchWithRetry(url, options, traceId);
}

export async function getTweetMetrics(traceId: string, tweetId: string): Promise<any> {
  if (!TWITTER_BEARER_TOKEN) throw new Error('Missing Twitter API token');
  const url = `${TWITTER_API_URL}/tweets/${tweetId}?tweet.fields=public_metrics`;
  const options: RequestInit = {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${TWITTER_BEARER_TOKEN}`,
    },
  };
  return fetchWithRetry(url, options, traceId);
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const traceId = req.headers['x-trace-id'] as string || Math.random().toString(36).substring(2);
  try {
    if (req.method === 'POST') {
      const { text } = req.body;
      if (!text) return res.status(400).json({ error: 'Missing tweet text' });
      const tweet = await postTweet(traceId, text);
      logWithTraceId(traceId, 'Tweet posted', tweet);
      return res.status(201).json({ tweet });
    }
    if (req.method === 'GET') {
      const { tweetId } = req.query;
      if (!tweetId || typeof tweetId !== 'string') return res.status(400).json({ error: 'Missing tweetId' });
      const metrics = await getTweetMetrics(traceId, tweetId);
      logWithTraceId(traceId, 'Fetched tweet metrics', metrics);
      return res.status(200).json({ metrics });
    }
    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error: any) {
    logWithTraceId(traceId, 'Error in Twitter API route', error);
    return res.status(500).json({ error: error.message, traceId });
  }
}
