import { describe, it, expect } from 'vitest';
import { predictViralPotential } from '../viralPredictor';

describe('predictViralPotential', () => {
  it('returns engagement score and probability (placeholder)', async () => {
    const res = await predictViralPotential({ content: 'Test content', history: [{ likes: 1, shares: 1, comments: 1 }] });
    expect(res).toHaveProperty('engagementScore');
    expect(res).toHaveProperty('viralProbability');
  });
});
