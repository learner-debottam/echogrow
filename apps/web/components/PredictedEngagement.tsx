type Props = {
  score?: number;
  probability?: number;
  loading?: boolean;
};

export default function PredictedEngagement({ score, probability, loading }: Props) {
  return (
    <div className="p-3 bg-blue-50 rounded">
      {loading ? (
        <div className="animate-pulse h-4 bg-blue-200 rounded w-1/2" />
      ) : (
        <div>
          <div className="font-semibold">Predicted Engagement Score: {score ?? '-'}</div>
          <div>Viral Probability: {probability !== undefined ? `${Math.round((probability || 0) * 100)}%` : '-'}</div>
        </div>
      )}
    </div>
  );
}
