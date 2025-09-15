import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import Calendar from 'react-calendar';
import { format } from 'date-fns';
import { useTranslation } from 'react-i18next';

const platforms = [
  { value: 'twitter', label: 'Twitter/X' },
  { value: 'facebook', label: 'Facebook' },
  { value: 'linkedin', label: 'LinkedIn' },
];

const languages = [
  { value: 'en', label: 'English' },
  { value: 'es', label: 'Español' },
  { value: 'fr', label: 'Français' },
  { value: 'de', label: 'Deutsch' },
];

const schema = z.object({
  content: z.string().min(1, 'Content required'),
  date: z.date(),
  time: z.string().min(1, 'Time required'),
  platform: z.string().min(1, 'Platform required'),
});

type FormData = z.infer<typeof schema>;

type ScheduledPost = {
  id: string;
  content: string;
  date: string;
  time: string;
  platform: string;
};

export default function SchedulePage() {
  const { t, i18n } = useTranslation();
  const [calendarDate, setCalendarDate] = useState<Date>(new Date());
  const [scheduledPosts, setScheduledPosts] = useState<ScheduledPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [aiCaption, setAiCaption] = useState<string>('');
  const [aiLoading, setAiLoading] = useState(false);
  const [targetLang, setTargetLang] = useState<string>('en');
  const [translated, setTranslated] = useState<string>('');
  const [transLoading, setTransLoading] = useState(false);

  const { register, handleSubmit, watch, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { date: new Date(), time: '12:00', platform: platforms[0].value },
  });

  const contentValue = watch('content');

  useEffect(() => {
    setLoading(true);
    fetch('/api/posts')
      .then(res => res.json())
      .then(data => setScheduledPosts(data.posts || []))
      .catch(() => setError(t('Failed to load scheduled posts')))
      .finally(() => setLoading(false));
  }, [t]);

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error(await res.text());
      const post = await res.json();
      setScheduledPosts(prev => [...prev, post]);
      reset();
    } catch (err) {
      setError(err instanceof Error ? err.message : t('Failed to schedule post'));
    } finally {
      setLoading(false);
    }
  };

  const handlePreviewAICaption = async () => {
    if (!contentValue?.trim()) return;
    setAiLoading(true);
    setAiCaption('');
    try {
      const res = await fetch('/api/ai-caption', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: contentValue, language: i18n.language || 'en' }),
      });
      const data = await res.json();
      if (res.ok) setAiCaption(`${data.caption} (${data.sentiment})`);
      else setAiCaption(t('Failed to generate caption'));
    } catch {
      setAiCaption(t('Failed to generate caption'));
    } finally {
      setAiLoading(false);
    }
  };

  const handleTranslate = async () => {
    if (!aiCaption?.trim()) return;
    setTransLoading(true);
    setTranslated('');
    try {
      const res = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: aiCaption, targetLang }),
      });
      const data = await res.json();
      if (res.ok) setTranslated(data.translated);
      else setTranslated(t('Translation failed'));
    } catch {
      setTranslated(t('Translation failed'));
    } finally {
      setTransLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-white rounded shadow" aria-label={t('Schedule Post Page')}>
      <h1 className="text-2xl font-bold mb-4">{t('Schedule a Post')}</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" aria-label={t('Schedule Post Form')}>
        <textarea className="w-full border p-2 rounded" placeholder={t('Post content')} {...register('content')} aria-label={t('Post content')} required />
        {errors.content && <div className="text-red-600">{errors.content.message}</div>}
        <div className="flex gap-4 items-center">
          <label htmlFor="date" className="font-semibold">{t('Date')}</label>
          <input type="date" id="date" className="border p-2 rounded" {...register('date', { valueAsDate: true })} aria-required="true" />
          <label htmlFor="time" className="font-semibold">{t('Time')}</label>
          <input type="time" id="time" className="border p-2 rounded" {...register('time')} aria-required="true" />
        </div>
        <div className="flex gap-4 items-center">
          <label htmlFor="platform" className="font-semibold">{t('Platform')}</label>
          <select id="platform" className="border p-2 rounded" {...register('platform')} aria-required="true">
            {platforms.map(p => (<option key={p.value} value={p.value}>{p.label}</option>))}
          </select>
          <label htmlFor="language" className="font-semibold">{t('Language')}</label>
          <select id="language" className="border p-2 rounded" value={targetLang} onChange={e => setTargetLang(e.target.value)}>
            {languages.map(l => (<option key={l.value} value={l.value}>{l.label}</option>))}
          </select>
        </div>
        <div className="flex gap-2">
          <button type="button" className="bg-gray-200 p-2 rounded" onClick={handlePreviewAICaption} disabled={aiLoading} aria-busy={aiLoading}>{aiLoading ? t('Generating...') : t('Preview AI Caption')}</button>
          <button type="button" className="bg-gray-200 p-2 rounded" onClick={handleTranslate} disabled={transLoading || !aiCaption} aria-busy={transLoading}>{transLoading ? t('Translating...') : t('Translate Caption')}</button>
        </div>
        {aiCaption && <div className="bg-blue-50 p-2 rounded mt-2">{aiCaption}</div>}
        {translated && <div className="bg-green-50 p-2 rounded mt-2">{translated}</div>}
        <button className="w-full bg-blue-600 text-white p-2 rounded disabled:opacity-50" type="submit" disabled={loading} aria-busy={loading}>{loading ? t('Scheduling...') : t('Schedule Post')}</button>
        {error && <div className="text-red-600">{error}</div>}
      </form>
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-2">{t('Scheduled Posts')}</h2>
        {loading ? (
          <div className="animate-pulse h-8 bg-gray-200 rounded w-1/2 mb-2" />
        ) : (
          <Calendar value={calendarDate} onChange={(val) => {
            const date = Array.isArray(val) ? val[0] : (val as Date | null);
            if (date) setCalendarDate(date);
          }} tileContent={({ date }) => {
            const posts = scheduledPosts.filter(p => p.date === format(date, 'yyyy-MM-dd'));
            return posts.length > 0 ? (<span className="block text-xs text-blue-600">●</span>) : null;
          }} aria-label={t('Calendar View')} />
        )}
        <ul className="mt-4">
          {scheduledPosts.filter(p => p.date === format(calendarDate, 'yyyy-MM-dd')).map(p => (
            <li key={p.id} className="border-b py-2">
              <div className="font-semibold">{p.content}</div>
              <div className="text-sm text-gray-600">{p.time} • {p.platform}</div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
