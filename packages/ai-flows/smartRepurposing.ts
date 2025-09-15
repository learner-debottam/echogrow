import NodeCache from 'node-cache';
import { HfInference } from '@huggingface/inference';

const cache = new NodeCache({ stdTTL: 60 * 10 });
const hf = new HfInference(process.env.HF_ACCESS_TOKEN);

export type RepurposeInput = {
  posts: Array<{ id: string; content: string; hashtags?: string[] }>;
  metrics: Array<{ id: string; likes: number; shares: number; comments: number }>;
  traceId?: string;
};

export type RepurposedSuggestion = {
  basePostId: string;
  text: string;
  hashtags: string[];
  mediaHint?: 'image' | 'video' | 'none';
};

export type RepurposeOutput = {
  suggestions: RepurposedSuggestion[];
};

function logWithTraceId(traceId: string | undefined, message: string, meta?: any) {
  const t = traceId || Math.random().toString(36).slice(2);
  console.log(`[traceId=${t}] ${message}`, meta || '');
}

export async function generateRepurposedPosts(input: RepurposeInput): Promise<RepurposeOutput> {
  const { posts, metrics, traceId } = input;
  const key = `repurpose:${posts.map(p => p.id).join(',')}:${metrics.map(m => `${m.id}-${m.likes}-${m.shares}-${m.comments}`).join('|')}`;
  const cached = cache.get<RepurposeOutput>(key);
  if (cached) {
    logWithTraceId(traceId, 'Repurposing cache hit');
    return cached;
  }

  logWithTraceId(traceId, 'Generating repurposed suggestions');

  // Pick top-N posts by simple engagement heuristic
  const scoreById = new Map(metrics.map(m => [m.id, m.likes + 2 * m.shares + 1.5 * m.comments]));
  const top = [...posts].sort((a, b) => (scoreById.get(b.id) || 0) - (scoreById.get(a.id) || 0)).slice(0, 3);

  const suggestions: RepurposedSuggestion[] = [];
  for (const post of top) {
    const prompt = `Rewrite this post for a new audience. Keep it concise and add 2-4 relevant hashtags. Text: "${post.content}"`;
    let text = `Repurposed: ${post.content}`;
    let hashtags: string[] = post.hashtags?.slice(0, 4) || [];
    try {
      const resp = await hf.textGeneration({ model: 'gpt2', inputs: prompt, parameters: { max_new_tokens: 50, temperature: 0.8 } });
      const generated = (resp as any)?.generated_text?.trim();
      if (generated) text = generated;
      // naive hashtag extraction
      hashtags = Array.from(new Set((text.match(/#[A-Za-z0-9_]+/g) || []).slice(0, 4))).map(h => h.replace(/#/, '').toLowerCase());
    } catch (err) {
      logWithTraceId(traceId, 'HF generation failed; using fallback text', err);
    }
    const mediaHint: 'image' | 'video' | 'none' = (text.length > 180 ? 'video' : text.length > 100 ? 'image' : 'none');
    suggestions.push({ basePostId: post.id, text, hashtags, mediaHint });
  }

  const output: RepurposeOutput = { suggestions };
  cache.set(key, output);
  return output;
}
