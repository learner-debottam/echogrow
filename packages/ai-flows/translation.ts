import NodeCache from 'node-cache';
import { HfInference } from '@huggingface/inference';

const cache = new NodeCache({ stdTTL: 60 * 10 });
const hf = new HfInference(process.env.HF_ACCESS_TOKEN);

export type TranslationInput = {
  text: string;
  targetLang: string; // e.g., 'en', 'es', 'fr', 'de'
  traceId?: string;
};

export type TranslationOutput = {
  translated: string;
};

function sanitizeForSocial(text: string): string {
  // simple sanitation: trim and remove control characters
  return text.replace(/[\u0000-\u001F\u007F]/g, '').trim();
}

function logWithTraceId(traceId: string | undefined, message: string, meta?: any) {
  const t = traceId || Math.random().toString(36).slice(2);
  console.log(`[traceId=${t}] ${message}`, meta || '');
}

export async function translateText(input: TranslationInput): Promise<TranslationOutput> {
  const { text, targetLang, traceId } = input;
  const key = `translate:${targetLang}:${text}`;
  const cached = cache.get<TranslationOutput>(key);
  if (cached) {
    logWithTraceId(traceId, 'Translation cache hit');
    return cached;
  }
  logWithTraceId(traceId, 'Translating via Hugging Face');

  const modelMap: Record<string, string> = {
    en: 'Helsinki-NLP/opus-mt-mul-en',
    es: 'Helsinki-NLP/opus-mt-mul-es',
    fr: 'Helsinki-NLP/opus-mt-mul-fr',
    de: 'Helsinki-NLP/opus-mt-mul-de',
  };
  const model = modelMap[targetLang] || 'Helsinki-NLP/opus-mt-mul-en';

  let translated = text;
  try {
    const resp = await hf.translation({ model, inputs: text });
    const out = Array.isArray(resp) ? resp[0] : resp;
    translated = (out as any)?.translation_text || translated;
  } catch (err) {
    logWithTraceId(traceId, 'HF translation failed, using original text', err);
  }

  const sanitized = sanitizeForSocial(translated);
  const output = { translated: sanitized };
  cache.set(key, output);
  return output;
}
