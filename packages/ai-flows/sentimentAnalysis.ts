import { HfInference } from '@huggingface/inference';

const hf = new HfInference(process.env.HF_ACCESS_TOKEN);

export type SentimentInput = {
  texts: string[]; // comments, engagement text, feedback
  traceId?: string;
};

export type SentimentLabel = 'positive' | 'neutral' | 'negative';

export type SentimentOutput = {
  scores: { label: SentimentLabel; score: number }[]; // aggregated scores
  trend: Array<{ index: number; label: SentimentLabel }>; // per item trend
};

function logWithTraceId(traceId: string | undefined, message: string, meta?: any) {
  const t = traceId || Math.random().toString(36).slice(2);
  console.log(`[traceId=${t}] ${message}`, meta || '');
}

export async function analyzeSentiment(input: SentimentInput): Promise<SentimentOutput> {
  const { texts, traceId } = input;
  if (!Array.isArray(texts) || texts.length === 0) {
    throw new Error('texts required');
  }

  logWithTraceId(traceId, 'Running sentiment analysis');

  const trend: Array<{ index: number; label: SentimentLabel }> = [];
  const agg = { positive: 0, neutral: 0, negative: 0 } as Record<SentimentLabel, number>;

  for (let i = 0; i < texts.length; i++) {
    const text = texts[i];
    try {
      const res = await hf.textClassification({
        model: 'distilbert-base-uncased-finetuned-sst-2-english',
        inputs: text,
      });
      const label = Array.isArray(res) ? (res[0][0]?.label || 'NEUTRAL') : 'NEUTRAL';
      let mapped: SentimentLabel = 'neutral';
      if (label.toUpperCase().includes('POSITIVE')) mapped = 'positive';
      else if (label.toUpperCase().includes('NEGATIVE')) mapped = 'negative';
      trend.push({ index: i, label: mapped });
      agg[mapped] += 1;
    } catch (err) {
      logWithTraceId(traceId, 'Sentiment analysis failed for item, marking neutral', { error: String(err) });
      trend.push({ index: i, label: 'neutral' });
      agg.neutral += 1;
    }
  }

  const total = texts.length || 1;
  const scores = (['positive', 'neutral', 'negative'] as SentimentLabel[]).map(label => ({
    label,
    score: agg[label] / total,
  }));

  return { scores, trend };
}
