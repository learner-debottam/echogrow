type Suggestion = {
  basePostId: string;
  text: string;
  hashtags: string[];
  mediaHint?: 'image' | 'video' | 'none';
};

type Props = {
  suggestions: Suggestion[];
  onSchedule: (s: Suggestion) => void;
  loading?: boolean;
};

export default function RepurposedPostSuggestions({ suggestions, onSchedule, loading }: Props) {
  if (loading) return <div className="animate-pulse h-4 bg-purple-200 rounded w-1/2" />;
  if (!suggestions?.length) return null;
  return (
    <div className="space-y-3">
      {suggestions.map((s, idx) => (
        <div key={idx} className="border rounded p-3">
          <div className="font-semibold mb-1">Suggested Post</div>
          <div className="mb-2 whitespace-pre-wrap">{s.text}</div>
          <div className="text-sm text-gray-600 mb-2">#{s.hashtags.join(' #')}</div>
          <div className="text-xs mb-2">Media Hint: {s.mediaHint || 'none'}</div>
          <button className="bg-blue-600 text-white px-3 py-1 rounded" onClick={() => onSchedule(s)}>Schedule this</button>
        </div>
      ))}
    </div>
  );
}
