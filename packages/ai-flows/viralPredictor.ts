import NodeCache from 'node-cache';
import { HfInference } from '@huggingface/inference';

const cache = new NodeCache({ stdTTL: 60 * 10 });
const hf = new HfInference(process.env.HF_ACCESS_TOKEN);

export type ViralPredictorInput = {
  content: string;
  history: Array<{ likes: number; shares: number; comments: number }>;
  traceId?: string;
};

export type ViralPredictorOutput = {
  engagementScore: number; // 0-100
  viralProbability: number; // 0-1
};

function logWithTraceId(traceId: string | undefined, message: string, meta?: any) {
  const t = traceId || Math.random().toString(36).slice(2);
  console.log(`[traceId=${t}] ${message}`, meta || '');
}

export async function predictViralPotential(input: ViralPredictorInput): Promise<ViralPredictorOutput> {
  const { content, history, traceId } = input;
  const key = `viral:${content}:${history.map(h => `${h.likes}-${h.shares}-${h.comments}`).join('|')}`;
  const cached = cache.get<ViralPredictorOutput>(key);
  if (cached) {
    logWithTraceId(traceId, 'Viral predictor cache hit');
    return cached;
  }

  logWithTraceId(traceId, 'Predicting engagement via Hugging Face');

  // Simple heuristic baseline using history averages
  const base = history.length
    ? history.reduce((acc, h) => acc + (h.likes + 2 * h.shares + 1.5 * h.comments), 0) / history.length
    : 10;

  let engagementScore = Math.max(0, Math.min(100, Math.round(base)));
  let viralProbability = Math.max(0, Math.min(1, base / 200));

  try {
    // Use a zero-shot classification as a lightweight signal to adjust score
    const resp = await hf.zeroShotClassification({
      model: 'facebook/bart-large-mnli',
      inputs: content,
      parameters: { candidate_labels: ['viral', 'engaging', 'boring'] },
    });
    const labels = (resp as any)?.labels || [];
    const scores = (resp as any)?.scores || [];
    const viralIdx = labels.findIndex((l: string) => l === 'viral');
    const engagingIdx = labels.findIndex((l: string) => l === 'engaging');
    const viralScore = viralIdx >= 0 ? scores[viralIdx] : 0.2;
    const engagingScore = engagingIdx >= 0 ? scores[engagingIdx] : 0.2;

    engagementScore = Math.max(0, Math.min(100, Math.round(engagementScore * (0.7 + 0.3 * engagingScore))));
    viralProbability = Math.max(0, Math.min(1, (viralProbability + viralScore) / 2));
  } catch (err) {
    logWithTraceId(traceId, 'HF zero-shot failed, using heuristic only', err);
  }

  const output: ViralPredictorOutput = { engagementScore, viralProbability };
  cache.set(key, output);
  return output;
}
