export default function RecommendationList({ recommendations = [] }) {
  if (recommendations.length === 0) return null;
  return (
    <div className="rounded-lg border border-cyan-700 bg-cyan-950/20 p-3 sm:p-4">
      <h4 className="font-semibold text-cyan-400 mb-2 text-sm sm:text-base">💡 Recommandations</h4>
      <ul className="list-disc list-inside space-y-1 text-sm text-slate-300">
        {recommendations.map((rec, idx) => (
          <li key={idx}>{rec}</li>
        ))}
      </ul>
    </div>
  );
}
