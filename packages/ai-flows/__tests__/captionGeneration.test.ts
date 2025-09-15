import { describe, it, expect } from 'vitest';
import { generateCaption } from '../captionGeneration';

describe('generateCaption', () => {
  it('returns caption and sentiment (placeholder)', async () => {
    const res = await generateCaption({ content: 'Hello world', language: 'en' });
    expect(res).toHaveProperty('caption');
    expect(['positive', 'neutral', 'negative']).toContain(res.sentiment);
  });
});
