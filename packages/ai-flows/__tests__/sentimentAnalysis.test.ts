import { describe, it, expect } from 'vitest';
import { analyzeSentiment } from '../sentimentAnalysis';

describe('analyzeSentiment', () => {
  it('returns aggregated scores and trend (placeholder)', async () => {
    const res = await analyzeSentiment({ texts: ['Great!', 'Okay', 'Bad'] });
    expect(res).toHaveProperty('scores');
    expect(res).toHaveProperty('trend');
  });
});
