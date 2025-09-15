import { describe, it, expect } from 'vitest';
import { translateText } from '../translation';

describe('translateText', () => {
  it('returns translated text (placeholder)', async () => {
    const res = await translateText({ text: 'Hello world', targetLang: 'es' });
    expect(res).toHaveProperty('translated');
  });
});
