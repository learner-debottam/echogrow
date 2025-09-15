import { describe, it, expect, vi } from 'vitest';
import * as twitterApi from '../../packages/backend/api/twitter';

describe('Twitter API', () => {
  it('should throw if no token is set', async () => {
    process.env.TWITTER_BEARER_TOKEN = '';
    await expect(twitterApi.postTweet('trace', 'hello')).rejects.toThrow();
  });
  it('should throw if no tweetId is provided', async () => {
    process.env.TWITTER_BEARER_TOKEN = '';
    await expect(twitterApi.getTweetMetrics('trace', '')).rejects.toThrow();
  });
});
