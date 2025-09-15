import { describe, it, expect } from 'vitest';
import { generateRepurposedPosts } from '../smartRepurposing';

describe('generateRepurposedPosts', () => {
  it('returns repurposed suggestions (placeholder)', async () => {
    const res = await generateRepurposedPosts({
      posts: [{ id: '1', content: 'Original content #hello' }],
      metrics: [{ id: '1', likes: 10, shares: 2, comments: 3 }],
    });
    expect(res).toHaveProperty('suggestions');
  });
});
