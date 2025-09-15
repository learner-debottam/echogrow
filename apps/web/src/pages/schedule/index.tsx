import { useState } from 'react';

type ScheduledPost = { id: string; date: string; time: string; platform: string; content: string };

export default function SchedulePostPage() {
  const [tweet, setTweet] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePost = async () => {
    setLoading(true);
    setSuccess(false);
    setError(null);
    try {
      const res = await fetch('/api/twitter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: tweet }),
      });
      const data: { error?: string } = await res.json();
      if (res.ok) setSuccess(true);
      else setError(data.error || 'Unknown error');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Schedule a Post to Twitter/X</h1>
      <textarea className="w-full border p-2 rounded mb-4" rows={4} placeholder="What's happening?" value={tweet} onChange={e => setTweet(e.target.value)} disabled={loading} />
      <button className="w-full bg-blue-600 text-white p-2 rounded disabled:opacity-50" onClick={handlePost} disabled={loading || !tweet.trim()}>
        {loading ? <span className="animate-pulse">Posting...</span> : 'Post to Twitter'}
      </button>
      {success && <div className="text-green-600 mt-2">Tweet posted successfully!</div>}
      {error && <div className="text-red-600 mt-2">{error}</div>}
    </div>
  );
}
