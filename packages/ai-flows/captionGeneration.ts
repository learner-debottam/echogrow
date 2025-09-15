import NodeCache from 'node-cache';
import { HfInference } from '@huggingface/inference';

const cache = new NodeCache({ stdTTL: 60 * 10 }); // 10 minutes
const hf = new HfInference(process.env.HF_ACCESS_TOKEN);

export type CaptionInput = {
  content: string;
  language: string; // e.g., 'en', 'es'
  traceId?: string;
};

export type CaptionOutput = {
  caption: string;
  sentiment: 'positive' | 'neutral' | 'negative';
};

function logWithTraceId(traceId: string | undefined, message: string, meta?: any) {
  const t = traceId || Math.random().toString(36).slice(2);
  console.log(`[traceId=${t}] ${message}`, meta || '');
}

export async function generateCaption(input: CaptionInput): Promise<CaptionOutput> {
  const { content, language, traceId } = input;
  const key = `caption:${language}:${content}`;
  const cached = cache.get<CaptionOutput>(key);
  if (cached) {
    logWithTraceId(traceId, 'Cache hit for caption');
    return cached;
  }

  logWithTraceId(traceId, 'Generating caption via Hugging Face');

  // Very simple prompt, replace with a better system prompt as needed
  const prompt = `Write a concise social media caption in ${language} for: "${content}"`;

  let caption = `AI caption for: ${content}`; // default fallback
  try {
    const resp = await hf.textGeneration({
      model: 'gpt2',
      inputs: prompt,
      parameters: { max_new_tokens: 40, temperature: 0.7 },
    });
    caption = (resp as any)?.generated_text?.trim() || caption;
  } catch (err) {
    logWithTraceId(traceId, 'HF text generation failed, using fallback', err);
  }

  // Simple sentiment heuristic using HF; fallback to neutral
  let sentiment: 'positive' | 'neutral' | 'negative' = 'neutral';
  try {
    const sentimentRes = await hf.textClassification({
      model: 'distilbert-base-uncased-finetuned-sst-2-english',
      inputs: caption,
    });
    const label = Array.isArray(sentimentRes) ? (sentimentRes[0][0]?.label || 'NEUTRAL') : 'NEUTRAL';
    if (label.toUpperCase().includes('POSITIVE')) sentiment = 'positive';
    else if (label.toUpperCase().includes('NEGATIVE')) sentiment = 'negative';
  } catch (err) {
    logWithTraceId(traceId, 'HF sentiment failed, defaulting to neutral', err);
  }

  const output: CaptionOutput = { caption, sentiment };
  cache.set(key, output);
  return output;
}
