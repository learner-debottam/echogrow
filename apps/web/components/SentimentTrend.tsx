type Props = {
  scores: { label: string; score: number }[];
  loading?: boolean;
};

export default function SentimentTrend({ scores, loading }: Props) {
  if (loading) return <div className="animate-pulse h-4 bg-green-200 rounded w-1/2" />;
  return (
    <div className="space-y-1">
      {scores.map(s => (
        <div key={s.label} className="flex items-center gap-2">
          <div className="w-24 text-sm capitalize">{s.label}</div>
          <div className="flex-1 bg-gray-100 h-2 rounded">
            <div className="bg-green-600 h-2 rounded" style={{ width: `${Math.min(100, Math.round(s.score * 100))}%` }} />
          </div>
        </div>
      ))}
    </div>
  );
}
